/**
 * Firestore access for the vehicles/{vehicleId} collection. Owner-only per
 * firebase/firestore.rules — see the security note in profileService for
 * why this isn't yet readable by other riders.
 *
 * PRIMARY VEHICLE DESIGN NOTE:
 * "Which vehicle is primary" is stored as a single field —
 * users/{ownerId}.primaryVehicleId — rather than an `isPrimary` boolean
 * duplicated across vehicle documents. Firestore transactions only give
 * atomic-read guarantees via transaction.get(docRef) on a known reference,
 * not via arbitrary queries — so "find whichever vehicle currently has
 * isPrimary:true, then flip it" cannot be made race-free with a query-based
 * read. A single pointer field can only ever name one vehicle, so setting
 * it is a single atomic document write with no race window at all, by
 * construction rather than by transaction cleverness. Each Vehicle's
 * `isPrimary` (in the public type) is computed by cross-referencing this
 * pointer, not stored redundantly.
 */
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage } from './storageService';
import type { Vehicle } from '@/types/models';

interface VehicleDoc {
  ownerId: string;
  manufacturer: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  photoURL?: string;
  modifications?: string[];
  createdAt: unknown;
  updatedAt: unknown;
}

export interface ServiceResult {
  success: boolean;
  error?: string;
}

export interface VehicleInput {
  manufacturer: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  modifications?: string[];
}

function toVehicle(id: string, data: VehicleDoc, primaryVehicleId: string | null): Vehicle {
  return {
    id,
    ownerId: data.ownerId,
    manufacturer: data.manufacturer,
    model: data.model,
    year: data.year,
    registrationNumber: data.registrationNumber,
    color: data.color,
    photoURL: data.photoURL,
    modifications: data.modifications ?? [],
    isPrimary: id === primaryVehicleId
  };
}

/**
 * Subscribes to live updates of every vehicle owned by the given user,
 * combined with the owner's primaryVehicleId pointer so each Vehicle's
 * isPrimary is always derived from a single source of truth rather than
 * two subscriptions independently going stale relative to each other.
 */
export function subscribeToVehicles(ownerId: string, callback: (vehicles: Vehicle[]) => void): Unsubscribe {
  let latestVehicleDocs: { id: string; data: VehicleDoc }[] = [];
  let latestPrimaryId: string | null = null;
  let hasVehicles = false;
  let hasPrimary = false;

  function emitIfReady() {
    if (!hasVehicles || !hasPrimary) return;
    callback(latestVehicleDocs.map(({ id, data }) => toVehicle(id, data, latestPrimaryId)));
  }

  const vehiclesQuery = query(
    collection(db, 'vehicles'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'asc')
  );
  const unsubscribeVehicles = onSnapshot(
    vehiclesQuery,
    (snapshot) => {
      latestVehicleDocs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, data: docSnap.data() as VehicleDoc }));
      hasVehicles = true;
      emitIfReady();
    },
    () => {
      latestVehicleDocs = [];
      hasVehicles = true;
      emitIfReady();
    }
  );

  const unsubscribePrimary = onSnapshot(
    doc(db, 'users', ownerId),
    (snapshot) => {
      latestPrimaryId = (snapshot.data()?.primaryVehicleId as string | undefined) ?? null;
      hasPrimary = true;
      emitIfReady();
    },
    () => {
      latestPrimaryId = null;
      hasPrimary = true;
      emitIfReady();
    }
  );

  return () => {
    unsubscribeVehicles();
    unsubscribePrimary();
  };
}

/**
 * Creates a vehicle. If makePrimary is set, the new vehicle and the
 * owner's primaryVehicleId pointer are written in one transaction — both
 * writes are to documents with known references (the fresh vehicle ref and
 * the owner's user doc), so this is fully atomic with no query-based read
 * involved.
 */
export async function addVehicle(
  ownerId: string,
  input: VehicleInput,
  makePrimary: boolean
): Promise<ServiceResult & { vehicleId?: string }> {
  try {
    const newRef = doc(collection(db, 'vehicles'));

    await runTransaction(db, async (transaction) => {
      transaction.set(newRef, {
        ownerId,
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      } satisfies VehicleDoc);

      if (makePrimary) {
        transaction.update(doc(db, 'users', ownerId), {
          primaryVehicleId: newRef.id,
          updatedAt: serverTimestamp()
        });
      }
    });

    return { success: true, vehicleId: newRef.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not save vehicle: ${message}` };
  }
}

export async function updateVehicle(vehicleId: string, updates: Partial<VehicleInput>): Promise<ServiceResult> {
  try {
    await updateDoc(doc(db, 'vehicles', vehicleId), { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not update vehicle: ${message}` };
  }
}

/**
 * Deletes a vehicle. If it was the primary vehicle, clears the owner's
 * primaryVehicleId pointer in the same transaction so the pointer never
 * references a deleted document.
 */
export async function deleteVehicle(ownerId: string, vehicleId: string): Promise<ServiceResult> {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', ownerId);
      const userSnapshot = await transaction.get(userRef);
      const currentPrimaryId = userSnapshot.data()?.primaryVehicleId as string | undefined;

      transaction.delete(doc(db, 'vehicles', vehicleId));

      if (currentPrimaryId === vehicleId) {
        transaction.update(userRef, { primaryVehicleId: null, updatedAt: serverTimestamp() });
      }
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not delete vehicle: ${message}` };
  }
}

/** Sets one vehicle as primary — a single atomic pointer write, no race window. */
export async function setPrimaryVehicle(ownerId: string, vehicleId: string): Promise<ServiceResult> {
  try {
    await updateDoc(doc(db, 'users', ownerId), {
      primaryVehicleId: vehicleId,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not set primary vehicle: ${message}` };
  }
}

export async function updateVehiclePhoto(ownerId: string, vehicleId: string, localUri: string): Promise<ServiceResult> {
  const uploadResult = await uploadImage(`vehicle-photos/${ownerId}/${vehicleId}.jpg`, localUri);
  if (!uploadResult.success || !uploadResult.downloadURL) {
    return { success: false, error: uploadResult.error ?? 'Photo upload failed.' };
  }
  try {
    await updateDoc(doc(db, 'vehicles', vehicleId), {
      photoURL: uploadResult.downloadURL,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Photo uploaded but could not be saved: ${message}` };
  }
}
