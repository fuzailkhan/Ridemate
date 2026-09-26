/**
 * Patches a confirmed gap in firebase@12.18.0's published type declarations.
 *
 * `getReactNativePersistence` is Firebase's own supported mechanism for
 * persisting auth sessions on React Native (backed by AsyncStorage) — it is
 * NOT a custom auth/token-storage scheme. The function exists and works
 * correctly at runtime: Metro resolves `firebase/auth` via the package's
 * "react-native" export condition, which points at a React-Native-specific
 * build that does export it.
 *
 * However, the package's `types` field (in its exports map) always points
 * at the generic/web declaration file regardless of platform, and that file
 * does not declare `getReactNativePersistence`. This was verified directly
 * by installing firebase@12.18.0 in isolation and inspecting both its
 * package.json exports map and the resulting .d.ts output — it is a
 * types-only gap, not a runtime bug, and has been an open, known issue
 * across multiple Firebase JS SDK major versions.
 *
 * This is a minimal, scoped declaration merge — it adds exactly the one
 * missing signature rather than disabling type-checking for the module.
 */
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
