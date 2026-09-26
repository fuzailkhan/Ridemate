import { useEffect, useState } from 'react';
import { subscribeToPublicRides } from '@/services/ridesService';
import type { Ride } from '@/types/models';

export interface UseRidesResult {
  rides: Ride[];
  loading: boolean;
}

/** Subscribes to public, published rides for Discover Rides. */
export function useRides(): UseRidesResult {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPublicRides((nextRides) => {
      setRides(nextRides);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { rides, loading };
}
