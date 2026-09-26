import { useEffect, useState } from 'react';
import { subscribeToRide } from '@/services/ridesService';
import { mockRides } from '@/constants/mockData';
import type { Ride } from '@/types/models';

export interface UseRideResult {
  ride: Ride | null;
  loading: boolean;
  /** True when this id resolved to mock data rather than a real Firestore
   * ride — currently true for ids the Live tab still links to, since that
   * screen stays mock-data-driven until the Live Location task. */
  isMock: boolean;
}

/**
 * Subscribes to a single ride by id. Falls back to mock data if no
 * matching Firestore document exists — a deliberate bridge, not a bug: the
 * Live tab still navigates using mock ride ids (out of scope for this
 * task), while Discover Rides now navigates using real Firestore ids.
 */
export function useRide(rideId: string | undefined): UseRideResult {
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (!rideId) {
      setRide(null);
      setLoading(false);
      setIsMock(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToRide(rideId, (firestoreRide) => {
      if (firestoreRide) {
        setRide(firestoreRide);
        setIsMock(false);
        setLoading(false);
        return;
      }

      const mockMatch = mockRides.find((r) => r.id === rideId);
      setRide(mockMatch ?? null);
      setIsMock(Boolean(mockMatch));
      setLoading(false);
    });

    return unsubscribe;
  }, [rideId]);

  return { ride, loading, isMock };
}
