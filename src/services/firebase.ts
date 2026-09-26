/**
 * Firebase app + Auth initialization.
 *
 * This file (and authService.ts) are the ONLY files in the codebase allowed
 * to import from 'firebase/*' — every other file goes through authService's
 * wrapper functions. This boundary was set in the Task 1 architecture doc
 * and is preserved here so future Firestore/Storage additions have exactly
 * one place each to live, rather than Firebase calls scattered across UI.
 *
 * Config comes from EXPO_PUBLIC_ environment variables (see .env.example).
 * These values are Firebase's client-side config, not secrets — but are
 * still kept out of source so different environments (dev/staging/prod
 * Firebase projects) can be swapped without code changes.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQQoCPBbjNmLXvzF7ZfLuN1tdlB8gdRlo",
  authDomain: "ridemate-4781b.firebaseapp.com",
  projectId: "ridemate-4781b",
  storageBucket: "ridemate-4781b.firebasestorage.app",
  messagingSenderId: "753469043253",
  appId: "753469043253:web:c3a96cda6b632b5550377c"
};

function isConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * initializeAuth with getReactNativePersistence must only be called once per
 * app — calling it a second time (e.g. on Fast Refresh) throws. Guard by
 * falling back to getAuth(app), which returns the already-initialized
 * instance if one exists.
 */
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage, isConfigured };
