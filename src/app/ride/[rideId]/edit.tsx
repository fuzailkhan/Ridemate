import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Button, IconButton, ScreenContainer } from '@/components/ui';
import { useRide } from '@/hooks/useRide';
import { updateRide } from '@/services/ridesService';

/**
 * Edit Ride. Scoped to title + description for this task, matching what
 * was already here — expanding to stops/date/etc. is reasonable future
 * polish, not required to make this screen real. Organizer-only access is
 * enforced by firestore.rules; this screen additionally doesn't render an
 * entry point for non-organizers (see Ride Details), so reaching this
 * screen at all already implies organizer.
 */
export default function EditRideScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const { ride, loading } = useRide(rideId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !seeded && ride) {
      setTitle(ride.title);
      setDescription(ride.description ?? '');
      setSeeded(true);
    }
  }, [loading, seeded, ride]);

  async function handleSave() {
    if (!ride) return;
    if (!title.trim()) {
      setError('Ride name cannot be empty.');
      return;
    }

    setError(null);
    setSaving(true);
    const result = await updateRide(ride.id, {
      title: title.trim(),
      description: description.trim() || undefined
    });
    setSaving(false);

    if (!result.success) {
      setError(result.error ?? 'Could not save changes.');
      return;
    }
    router.back();
  }

  if (loading) {
    return (
      <ScreenContainer contentStyle={styles.loadingContainer}>
        <ActivityIndicator color={colors.accentSolid} size="large" />
      </ScreenContainer>
    );
  }

  if (!ride) {
    return (
      <ScreenContainer noPadding>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={colors.textPrimary} />
          </IconButton>
          <Text style={[typography.h2, styles.topBarTitle]}>Edit ride</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={[typography.body, styles.notFoundText]}>This ride could not be found.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Edit ride</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={[typography.captionMedium, styles.label]}>Ride name</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholderTextColor={colors.textTertiary} />

        <Text style={[typography.captionMedium, styles.label]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.multiline]}
          multiline
          placeholderTextColor={colors.textTertiary}
        />

        {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

        <Button label="Save changes" onPress={handleSave} loading={saving} style={styles.saveButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  notFound: { alignItems: 'center', paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl },
  notFoundText: { color: colors.textSecondary },
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
  label: { color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg },
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
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  errorText: { color: colors.danger, marginTop: spacing.md },
  saveButton: { marginTop: spacing.xl }
});
