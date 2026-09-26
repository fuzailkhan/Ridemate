import * as ImagePicker from 'expo-image-picker';

export interface PickImageResult {
  uri: string | null;
  /** Set when the user actively denied permission, so callers can show a
   * specific message rather than treating it the same as "user cancelled". */
  permissionDenied?: boolean;
}

/**
 * Requests photo-library permission (if not already granted) and opens the
 * picker. Returns null uri if the user cancels or denies permission —
 * callers should treat both as "no photo selected", using
 * permissionDenied to decide whether to explain why.
 */
export async function pickImageFromLibrary(): Promise<PickImageResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return { uri: null, permissionDenied: true };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8
  });

  if (result.canceled || result.assets.length === 0) {
    return { uri: null };
  }

  return { uri: result.assets[0].uri };
}
