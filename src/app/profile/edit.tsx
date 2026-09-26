import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Avatar, Button, IconButton, ScreenContainer } from '@/components/ui';
import { useAuth } from '@/store/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateProfilePhoto, updateUserProfile } from '@/services/profileService';
import { pickImageFromLibrary } from '@/utils/imagePicker';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [experience, setExperience] = useState(
    typeof profile?.ridingExperienceYears === 'number' ? String(profile.ridingExperienceYears) : ''
  );
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Re-seed local state once the profile finishes its first load — avoids
  // fields staying blank if this screen mounts before the subscription's
  // first snapshot arrives.
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!loading && !seeded && profile) {
      setDisplayName(profile.displayName ?? '');
      setCity(profile.city ?? '');
      setExperience(typeof profile.ridingExperienceYears === 'number' ? String(profile.ridingExperienceYears) : '');
      setBio(profile.bio ?? '');
      setSeeded(true);
    }
  }, [loading, seeded, profile]);

  async function handleChangePhoto() {
    if (!user) return;
    const result = await pickImageFromLibrary();
    if (result.permissionDenied) {
      setError('Photo library permission is needed to change your photo.');
      return;
    }
    if (!result.uri) return;

    setUploadingPhoto(true);
    const uploadResult = await updateProfilePhoto(user.uid, result.uri);
    setUploadingPhoto(false);
    if (!uploadResult.success) {
      setError(uploadResult.error ?? 'Could not update photo.');
    }
  }

  async function handleSave() {
    if (!user) return;
    if (!displayName.trim()) {
      setError('Enter your name.');
      return;
    }

    const parsedExperience = experience.trim() ? Number(experience.trim()) : undefined;
    if (experience.trim() && (Number.isNaN(parsedExperience) || parsedExperience! < 0)) {
      setError('Riding experience must be a number.');
      return;
    }

    setError(null);
    setSaving(true);
    const result = await updateUserProfile(user.uid, {
      displayName: displayName.trim(),
      city: city.trim() || undefined,
      ridingExperienceYears: parsedExperience,
      bio: bio.trim() || undefined
    });
    setSaving(false);

    if (!result.success) {
      setError(result.error ?? 'Could not save profile.');
      return;
    }
    router.back();
  }

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Edit profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.photoSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleChangePhoto} disabled={uploadingPhoto}>
            <Avatar name={displayName || 'Rider'} photoURL={profile?.photoURL} size="lg" />
            <View style={styles.cameraBadge}>
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <Ionicons name="camera" size={14} color={colors.textInverse} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={[typography.caption, styles.photoHint]}>Tap to change photo</Text>
        </View>

        <Field label="Full name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
        <Field label="City" value={city} onChangeText={setCity} placeholder="e.g. Pune" />
        <Field
          label="Riding experience (years)"
          value={experience}
          onChangeText={setExperience}
          placeholder="e.g. 6"
          keyboardType="numeric"
        />
        <Field
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="A line about how you ride"
          multiline
        />

        {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

        <Button label="Save changes" onPress={handleSave} loading={saving} style={styles.saveButton} />
      </View>
    </ScreenContainer>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={[typography.captionMedium, styles.label]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilineInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  topBarTitle: { color: colors.textPrimary },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  photoSection: { alignItems: 'center', marginBottom: spacing.xl },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background
  },
  photoHint: { color: colors.textTertiary, marginTop: spacing.sm },
  field: { marginBottom: spacing.lg },
  label: { color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top'
  },
  errorText: { color: colors.danger, marginBottom: spacing.md },
  saveButton: { marginTop: spacing.sm }
});
