import { useEffect, useState } from 'react';
import { useAuth } from '@/store/AuthProvider';
import { subscribeToVehicles } from '@/services/vehiclesService';
import type { Vehicle } from '@/types/models';

export interface UseVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
}

/** Subscribes to the current signed-in user's vehicles. */
export function useVehicles(): UseVehiclesResult {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToVehicles(user.uid, (nextVehicles) => {
      setVehicles(nextVehicles);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { vehicles, loading };
}
