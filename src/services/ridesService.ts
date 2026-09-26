/**
 * Firestore access for rides/{rideId} and rideStops/{stopId}.
 *
 * SCOPE NOTE (Task 4 — Rides Core): this file handles ride and stop CRUD
 * only. Joining/leaving a ride, participant lists, and currentRiderCount
 * increments are rideMembers concerns — a later task. currentRiderCount is
 * initialized to 0 here and deliberately left alone otherwise.
 *
 * GEO NOTE: with no map/geocoding integration yet, meetingPoint/destination/
 * stop GeoPoints are stored as {lat:0,lng:0} placeholders — only the place
 * `name` a rider types is meaningful until the Maps phase does real
 * geocoding. This is stored as-is rather than faked with invented
 * coordinates.
 *
 * ORGANIZER DENORMALIZATION: organizerName/organizerPhotoURL are copied
 * from the creator's own profile onto the ride document at creation time.
 * This is self-authored data (a user reading their own profile to write
 * their own ride), not a cross-user read — it lets Ride Details show who's
 * hosting without opening up general cross-user profile visibility, which
 * stays deferred until rideMembers actually needs it.
 */
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { GeoPoint, Ride, RideDifficulty, RideStop, RideStopType, RideVisibility } from '@/types/models';

interface RideDoc {
  organizerId: string;
  organizerName: string;
  organizerPhotoURL?: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  visibility: RideVisibility;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:MM'
  meetingPointName: string;
  meetingPointLocation: GeoPoint;
  destinationName: string;
  destinationLocation: GeoPoint;
  distanceKm: number;
  estimatedDurationMin: number;
  difficulty: RideDifficulty;
  maxRiders?: number;
  currentRiderCount: number;
  sweepRiderName?: string;
  sweepRiderPhone?: string;
  nearestHospital?: string;
  coverImageURL?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

interface RideStopDoc {
  rideId: string;
  type: RideStopType;
  name: string;
  location: GeoPoint;
  order: number;
  estimatedArrival?: string;
  notes?: string;
}

export interface ServiceResult {
  success: boolean;
  error?: string;
}

const PLACEHOLDER_LOCATION: GeoPoint = { lat: 0, lng: 0 };

function formatDateLabel(date: string, startTime: string): string {
  try {
    const parsed = new Date(`${date}T${startTime}:00`);
    if (Number.isNaN(parsed.getTime())) return `${date} ${startTime}`;
    const dateStr = parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = parsed.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${dateStr} · ${timeStr}`;
  } catch {
    return `${date} ${startTime}`;
  }
}

function toRide(id: string, data: RideDoc, stops: RideStop[]): Ride {
  return {
    id,
    organizerId: data.organizerId,
    organizerName: data.organizerName,
    title: data.title,
    description: data.description,
    status: data.status,
    visibility: data.visibility,
    dateLabel: formatDateLabel(data.date, data.startTime),
    startTime: data.startTime,
    meetingPoint: { name: data.meetingPointName, location: data.meetingPointLocation ?? PLACEHOLDER_LOCATION },
    destination: { name: data.destinationName, location: data.destinationLocation ?? PLACEHOLDER_LOCATION },
    distanceKm: data.distanceKm,
    estimatedDurationMin: data.estimatedDurationMin,
    difficulty: data.difficulty,
    maxRiders: data.maxRiders,
    currentRiderCount: data.currentRiderCount ?? 0,
    sweepRiderName: data.sweepRiderName,
    sweepRiderPhone: data.sweepRiderPhone,
    nearestHospital: data.nearestHospital,
    coverImageURL: data.coverImageURL,
    stops,
    // rideMembers doesn't exist yet (later task) — always empty rather than
    // fabricated, matching the honest "joining coming soon" UI treatment.
    participants: []
  };
}

function toRideStop(id: string, data: RideStopDoc): RideStop {
  return {
    id,
    rideId: data.rideId,
    type: data.type,
    name: data.name,
    location: data.location ?? PLACEHOLDER_LOCATION,
    order: data.order,
    estimatedArrival: data.estimatedArrival,
    notes: data.notes
  };
}

export interface RideStopInput {
  type: RideStopType;
  name: string;
  order: number;
  estimatedArrival?: string;
}

export interface CreateRideInput {
  title: string;
  description?: string;
  visibility: RideVisibility;
  date: string;
  startTime: string;
  meetingPointName: string;
  destinationName: string;
  distanceKm: number;
  estimatedDurationMin: number;
  difficulty: RideDifficulty;
  maxRiders?: number;
  sweepRiderName?: string;
  sweepRiderPhone?: string;
  nearestHospital?: string;
  stops: RideStopInput[];
}

export interface OrganizerProfile {
  displayName: string;
  photoURL?: string;
}

/**
 * Creates a ride and its stops atomically via a single batched write — a
 * ride is never left without its stops (or vice versa) even if the app is
 * killed mid-write, since a batch either fully commits or fully fails.
 */
export async function createRide(
  organizerId: string,
  organizer: OrganizerProfile,
  input: CreateRideInput
): Promise<ServiceResult & { rideId?: string }> {
  try {
    const rideRef = doc(collection(db, 'rides'));
    const batch = writeBatch(db);

    batch.set(rideRef, {
      organizerId,
      organizerName: organizer.displayName,
      organizerPhotoURL: organizer.photoURL,
      title: input.title,
      description: input.description,
      status: 'published',
      visibility: input.visibility,
      date: input.date,
      startTime: input.startTime,
      meetingPointName: input.meetingPointName,
      meetingPointLocation: PLACEHOLDER_LOCATION,
      destinationName: input.destinationName,
      destinationLocation: PLACEHOLDER_LOCATION,
      distanceKm: input.distanceKm,
      estimatedDurationMin: input.estimatedDurationMin,
      difficulty: input.difficulty,
      maxRiders: input.maxRiders,
      currentRiderCount: 0,
      sweepRiderName: input.sweepRiderName,
      sweepRiderPhone: input.sweepRiderPhone,
      nearestHospital: input.nearestHospital,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } satisfies RideDoc);

    input.stops.forEach((stop) => {
      const stopRef = doc(collection(db, 'rideStops'));
      batch.set(stopRef, {
        rideId: rideRef.id,
        type: stop.type,
        name: stop.name,
        location: PLACEHOLDER_LOCATION,
        order: stop.order,
        estimatedArrival: stop.estimatedArrival
      } satisfies RideStopDoc);
    });

    await batch.commit();
    return { success: true, rideId: rideRef.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not create ride: ${message}` };
  }
}

export interface UpdateRideInput {
  title?: string;
  description?: string;
}

export async function updateRide(rideId: string, updates: UpdateRideInput): Promise<ServiceResult> {
  try {
    await updateDoc(doc(db, 'rides', rideId), { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not update ride: ${message}` };
  }
}

export async function cancelRide(rideId: string): Promise<ServiceResult> {
  try {
    await updateDoc(doc(db, 'rides', rideId), { status: 'cancelled', updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Could not cancel ride: ${message}` };
  }
}

/** Subscribes to public, published rides for Discover Rides, newest date first. */
export function subscribeToPublicRides(callback: (rides: Ride[]) => void): Unsubscribe {
  const ridesQuery = query(
    collection(db, 'rides'),
    where('visibility', '==', 'public'),
    where('status', '==', 'published'),
    orderBy('date', 'asc')
  );

  return onSnapshot(
    ridesQuery,
    (snapshot) => {
      // Discover Rides doesn't need per-ride stop detail in the list view
      // (RideCard doesn't render stops) — stops are fetched only when a
      // specific ride is opened, via subscribeToRide below.
      callback(snapshot.docs.map((docSnap) => toRide(docSnap.id, docSnap.data() as RideDoc, [])));
    },
    (error) => {
      console.warn('[ridesService] subscribeToPublicRides error:', error.message);
      callback([]);
    }
  );
}

/** Subscribes to a single ride plus its stops, combined into one Ride object. */
export function subscribeToRide(rideId: string, callback: (ride: Ride | null) => void): Unsubscribe {
  let latestRideDoc: RideDoc | null = null;
  let latestStops: RideStop[] = [];
  let hasRide = false;
  let hasStops = false;

  function emitIfReady() {
    if (!hasRide || !hasStops) return;
    callback(latestRideDoc ? toRide(rideId, latestRideDoc, latestStops) : null);
  }

  const unsubscribeRide = onSnapshot(
    doc(db, 'rides', rideId),
    (snapshot) => {
      latestRideDoc = snapshot.exists() ? (snapshot.data() as RideDoc) : null;
      hasRide = true;
      emitIfReady();
    },
    (error) => {
      console.warn('[ridesService] subscribeToRide (ride doc) error:', error.message);
      latestRideDoc = null;
      hasRide = true;
      emitIfReady();
    }
  );

  const stopsQuery = query(collection(db, 'rideStops'), where('rideId', '==', rideId), orderBy('order', 'asc'));
  const unsubscribeStops = onSnapshot(
    stopsQuery,
    (snapshot) => {
      latestStops = snapshot.docs.map((docSnap) => toRideStop(docSnap.id, docSnap.data() as RideStopDoc));
      hasStops = true;
      emitIfReady();
    },
    (error) => {
      console.warn('[ridesService] subscribeToRide (stops query) error:', error.message);
      latestStops = [];
      hasStops = true;
      emitIfReady();
    }
  );

  return () => {
    unsubscribeRide();
    unsubscribeStops();
  };
}
