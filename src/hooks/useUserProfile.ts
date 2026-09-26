import { useEffect, useState } from 'react';
import { useAuth } from '@/store/AuthProvider';
import { subscribeToUserProfile } from '@/services/profileService';
import type { RiderUser } from '@/types/models';

export interface UseUserProfileResult {
  profile: RiderUser | null;
  loading: boolean;
}

/**
 * Subscribes to the current signed-in user's Firestore profile document.
 * Returns loading:true until the first snapshot arrives (or there is no
 * signed-in user, in which case it resolves to profile:null immediately).
 */
export function useUserProfile(): UseUserProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RiderUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToUserProfile(user.uid, (nextProfile) => {
      setProfile(nextProfile);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return { profile, loading };
}
