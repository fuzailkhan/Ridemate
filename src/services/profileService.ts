/**
 * Firestore access for the users/{userId} collection. Every rider's own
 * profile document only — see firebase/firestore.rules for the owner-only
 * enforcement this relies on.
 */
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage } from './storageService';
import type { RiderUser } from '@/types/models';

interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  city?: string;
  ridingExperienceYears?: number;
  bio?: string;
  /** Points at the vehicles/{id} the rider has marked primary, or null. See vehiclesService for why this is a single pointer rather than a per-vehicle flag. */
  primaryVehicleId?: string | null;
  rideStats: {
    totalRides: number;
    totalDistanceKm: number;
    groupRidesLed: number;
    memberSince: unknown; // Firestore Timestamp on read; serverTimestamp() sentinel on write
  };
  createdAt: unknown;
  updatedAt: unknown;
}

export interface ServiceResult {
  success: boolean;
  error?: string;
}

function toRiderUser(uid: string, data: UserProfileDoc): RiderUser {
  const memberSinceValue = data.rideStats?.memberSince;
  const memberSince =
    memberSinceValue && typeof memberSinceValue === 'object' && 'toDate' in memberSinceValue
      ? (memberSinceValue as { toDate: () => Date }).toDate().toISOString()
      : new Date().toISOString();

  return {
    uid,
    email: data.email ?? null,
    displayName: data.displayName ?? '',
    photoURL: data.photoURL,
    city: data.city,
    ridingExperienceYears: data.ridingExperienceYears,
    bio: data.bio,
    rideStats: {
      totalRides: data.rideStats?.totalRides ?? 0,
      totalDistanceKm: data.rideStats?.totalDistanceKm ?? 0,
      groupRidesLed: data.rideStats?.groupRidesLed ?? 0,
      memberSince
    }
  };
}

/**
 * Creates the Firestore profile document on first sign-in if it doesn't
 * already exist (idempotent — safe to call on every login). This is what
 * backfills a profile for accounts registered in Task 2, before this
 * document existed at all.
 */
export async function ensureUserProfile(
  uid: string,
  seed: { email: string | null; displayName: string | null }
): Promise<ServiceResult> {
  try {
    const ref = doc(db, 'users', uid);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      return { success: true };
    }
    await setDoc(ref, {
      uid,
      email: seed.email,
      displayName: seed.displayName ?? '',
      primaryVehicleId: null,
      rideStats: {
        totalRides: 0,
        totalDistanceKm: 0,
        groupRidesLed: 0,
        memberSince: serverTimestamp()
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } satisfies Omit<UserProfileDoc, 'photoURL' | 'city' | 'ridingExperienceYears' | 'bio'>);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not create profile: ${message}` };
  }
}

/** Subscribes to live updates of the current user's profile document. */
export function subscribeToUserProfile(
  uid: string,
  callback: (profile: RiderUser | null) => void
): Unsubscribe {
  const ref = doc(db, 'users', uid);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback(toRiderUser(uid, snapshot.data() as UserProfileDoc));
    },
    () => callback(null)
  );
}

export interface ProfileUpdateInput {
  displayName?: string;
  city?: string;
  ridingExperienceYears?: number;
  bio?: string;
}

export async function updateUserProfile(uid: string, updates: ProfileUpdateInput): Promise<ServiceResult> {
  try {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not save profile: ${message}` };
  }
}

/** Uploads a new profile photo and saves its URL onto the user's profile document. */
export async function updateProfilePhoto(uid: string, localUri: string): Promise<ServiceResult> {
  const uploadResult = await uploadImage(`profile-photos/${uid}.jpg`, localUri);
  if (!uploadResult.success || !uploadResult.downloadURL) {
    return { success: false, error: uploadResult.error ?? 'Photo upload failed.' };
  }
  try {
    await updateDoc(doc(db, 'users', uid), {
      photoURL: uploadResult.downloadURL,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Photo uploaded but could not be saved: ${message}` };
  }
}
