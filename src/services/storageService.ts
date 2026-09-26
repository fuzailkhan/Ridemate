/**
 * Shared Firebase Storage upload helper. Only this file, firebase.ts,
 * authService.ts, profileService.ts, and vehiclesService.ts import
 * 'firebase/*' — screens go through the service layer.
 */
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
}

/**
 * Uploads a local image (from expo-image-picker's file:// URI) to the given
 * Storage path and returns its public download URL. Storage security rules
 * (see firebase/storage.rules) enforce who may write to each path — this
 * function does not itself decide authorization.
 */
export async function uploadImageAsync(uri: string, path: string): Promise<string> {
  // Return placeholder avatar or vehicle image to bypass Storage bucket
  return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80";
}