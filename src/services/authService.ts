/**
 * Thin wrapper around Firebase Authentication. Every Firebase Auth call in
 * the app goes through here — screens and the auth store never import
 * 'firebase/auth' directly. Every exported function returns a plain result
 * object rather than throwing, and every raw Firebase error is translated
 * to a user-friendly message before it leaves this file (never surfaced
 * verbatim to the UI).
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, isConfigured } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

function mapUser(user: FirebaseUser | null): AuthUser | null {
  if (!user) return null;
  return { uid: user.uid, email: user.email, displayName: user.displayName };
}

/**
 * User-friendly translation of Firebase Auth error codes. Deliberately
 * generic for wrong-password vs. user-not-found (mapped to the same
 * message) — this matches current Firebase Auth's own security posture of
 * not revealing which part of a credential pair was wrong, and covers
 * both the classic separate codes and the newer consolidated
 * 'auth/invalid-credential' code, since which one a given project returns
 * can vary.
 */
function mapAuthError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/missing-email':
      return 'Enter your email address.';
    case 'auth/missing-password':
      return 'Enter your password.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 8 characters).';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/invalid-api-key':
    case 'auth/configuration-not-found':
      return 'Firebase is not configured yet. See setup instructions.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function ensureConfigured(): AuthResult | null {
  if (!isConfigured()) {
    return { success: false, error: 'Firebase is not configured yet. See setup instructions.' };
  }
  return null;
}

export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const configError = ensureConfigured();
  if (configError) return configError;

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName.trim()) {
      // Best-effort: registration should still succeed even if this fails.
      try {
        await updateProfile(credential.user, { displayName: fullName.trim() });
      } catch {
        // Intentionally swallowed — display name is not critical path.
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: mapAuthError(error) };
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  const configError = ensureConfigured();
  if (configError) return configError;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: mapAuthError(error) };
  }
}

export async function logout(): Promise<AuthResult> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: mapAuthError(error) };
  }
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  const configError = ensureConfigured();
  if (configError) return configError;

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';
    // Deliberately treated as success: whether or not this email has an
    // account, the user sees the same "check your email" outcome, so the
    // screen never reveals account existence — independent of whether the
    // Firebase project has email-enumeration protection enabled.
    if (code === 'auth/user-not-found') {
      return { success: true };
    }
    return { success: false, error: mapAuthError(error) };
  }
}

/**
 * Subscribes to Firebase's auth state observer (not a one-time check).
 * Returns the unsubscribe function for cleanup.
 */
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => callback(mapUser(user)));
}
