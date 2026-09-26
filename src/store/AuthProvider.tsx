import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { subscribeToAuthChanges, type AuthUser } from '@/services/authService';
import { ensureUserProfile } from '@/services/profileService';

interface AuthContextValue {
  /** Null when signed out, or while auth state is still resolving. */
  user: AuthUser | null;
  /** True only until the first auth-state event has been received. */
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Wraps Firebase's onAuthStateChanged observer (not a one-time check) in a
 * React context so the whole app can reactively respond to sign-in/out —
 * this is what src/app/_layout.tsx reads to decide between the (auth) and
 * (tabs) route groups via Stack.Protected.
 *
 * Also bootstraps the Firestore users/{uid} profile document on every
 * sign-in via ensureUserProfile, which is idempotent (create-if-missing).
 * This is what backfills a profile for accounts created back in Task 2,
 * before this document existed at all, and is deliberately fire-and-forget
 * relative to auth state — a profile-creation hiccup should never block
 * the user from reaching the app after a real, successful sign-in.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setInitializing(false);

      if (nextUser) {
        ensureUserProfile(nextUser.uid, {
          email: nextUser.email,
          displayName: nextUser.displayName
        }).catch(() => {
          // Intentionally swallowed here: profile bootstrap failing should
          // not block sign-in. useUserProfile's own loading/null state
          // surfaces the consequence to whichever screen needs the profile.
        });
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ user, initializing }), [user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
