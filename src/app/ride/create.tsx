import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Button, Card, IconButton, ScreenContainer } from '@/components/ui';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { useAuth } from '@/store/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { createRide } from '@/services/ridesService';
import type { RideDifficulty, RideStopType } from '@/types/models';

interface DraftStop {
  id: string;
  type: RideStopType;
  name: string;
}

const STOP_ICON: Record<RideStopType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  meeting: 'map-marker',
  fuel: 'gas-station',
  rest: 'coffee',
  food: 'silverware-fork-knife',
  checkpoint: 'flag-variant',
  destination: 'flag-checkered'
};

// Tapping a stop's icon cycles through these — a lightweight alternative to
// a picker component for a form this size.
const CYCLABLE_STOP_TYPES: RideStopType[] = ['fuel', 'rest', 'food', 'checkpoint'];

const DIFFICULTIES: RideDifficulty[] = ['easy', 'moderate', 'hard'];

export default function CreateRideScreen() {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [estimatedDurationMin, setEstimatedDurationMin] = useState('');
  const [difficulty, setDifficulty] = useState<RideDifficulty>('moderate');
  const [maxRiders, setMaxRiders] = useState('');
  const [sweepRiderName, setSweepRiderName] = useState('');
  const [sweepRiderPhone, setSweepRiderPhone] = useState('');
  const [nearestHospital, setNearestHospital] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [stops, setStops] = useState<DraftStop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function removeStop(id: string) {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  function addStop() {
    setStops((prev) => [...prev, { id: `draft-${Date.now()}`, type: 'fuel', name: '' }]);
  }

  function cycleStopType(id: string) {
    setStops((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const currentIndex = CYCLABLE_STOP_TYPES.indexOf(s.type);
        const nextType = CYCLABLE_STOP_TYPES[(currentIndex + 1) % CYCLABLE_STOP_TYPES.length];
        return { ...s, type: nextType };
      })
    );
  }

  function updateStopName(id: string, name: string) {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  async function handlePublish() {
    if (!user) return;

    if (!title.trim() || !meetingPoint.trim() || !destination.trim()) {
      setError('Ride name, meeting point, and destination are required.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setError('Enter the date as YYYY-MM-DD.');
      return;
    }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime.trim())) {
      setError('Enter the start time as HH:MM (24-hour).');
      return;
    }
    const parsedDistance = Number(distanceKm.trim());
    if (!distanceKm.trim() || Number.isNaN(parsedDistance) || parsedDistance <= 0) {
      setError('Enter a valid distance in km.');
      return;
    }
    const parsedDuration = Number(estimatedDurationMin.trim());
    if (!estimatedDurationMin.trim() || Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Enter a valid estimated duration in minutes.');
      return;
    }
    const parsedMaxRiders = maxRiders.trim() ? Number(maxRiders.trim()) : undefined;
    if (maxRiders.trim() && (Number.isNaN(parsedMaxRiders) || parsedMaxRiders! <= 0)) {
      setError('Maximum riders must be a positive number.');
      return;
    }
    if (stops.some((s) => !s.name.trim())) {
      setError('Every stop needs a name, or remove the blank one.');
      return;
    }

    setError(null);
    setSaving(true);
    const result = await createRide(
      user.uid,
      { displayName: profile?.displayName || user.displayName || 'Rider', photoURL: profile?.photoURL },
      {
        title: title.trim(),
        description: description.trim() || undefined,
        visibility: isPublic ? 'public' : 'private',
        date: date.trim(),
        startTime: startTime.trim(),
        meetingPointName: meetingPoint.trim(),
        destinationName: destination.trim(),
        distanceKm: parsedDistance,
        estimatedDurationMin: parsedDuration,
        difficulty,
        maxRiders: parsedMaxRiders,
        sweepRiderName: sweepRiderName.trim() || undefined,
        sweepRiderPhone: sweepRiderPhone.trim() || undefined,
        nearestHospital: nearestHospital.trim() || undefined,
        stops: stops.map((s, index) => ({ type: s.type, name: s.name.trim(), order: index + 1 }))
      }
    );
    setSaving(false);

    if (!result.success || !result.rideId) {
      setError(result.error ?? 'Could not create ride.');
      return;
    }

    router.replace(`/ride/${result.rideId}`);
  }

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Create a ride</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Field label="Ride name" value={title} onChangeText={setTitle} placeholder="e.g. Sunrise Ghats Run" />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What's the plan for this ride?"
          multiline
        />

        <View style={styles.rowFields}>
          <View style={styles.rowField}>
            <Field label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numeric" />
          </View>
          <View style={styles.rowField}>
            <Field label="Start time" value={startTime} onChangeText={setStartTime} placeholder="HH:MM" keyboardType="numeric" />
          </View>
        </View>

        <Field label="Meeting point" value={meetingPoint} onChangeText={setMeetingPoint} placeholder="Lonavala Toll Plaza" />
        <Field label="Destination" value={destination} onChangeText={setDestination} placeholder="Pawna Lake" />

        <View style={styles.mapPreview}>
          <MapPlaceholder height={130} compact />
        </View>

        <View style={styles.rowFields}>
          <View style={styles.rowField}>
            <Field label="Distance (km)" value={distanceKm} onChangeText={setDistanceKm} placeholder="142" keyboardType="numeric" />
          </View>
          <View style={styles.rowField}>
            <Field label="Duration (min)" value={estimatedDurationMin} onChangeText={setEstimatedDurationMin} placeholder="210" keyboardType="numeric" />
          </View>
        </View>

        <Text style={[typography.captionMedium, styles.label]}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          {DIFFICULTIES.map((level) => {
            const active = level === difficulty;
            return (
              <TouchableOpacity
                key={level}
                activeOpacity={0.8}
                onPress={() => setDifficulty(level)}
                style={[styles.difficultyChip, active && styles.difficultyChipActive]}
              >
                <Text style={[typography.captionMedium, active ? styles.difficultyTextActive : styles.difficultyText]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Field
          label="Maximum riders (optional)"
          value={maxRiders}
          onChangeText={setMaxRiders}
          placeholder="e.g. 15"
          keyboardType="numeric"
        />

        <Text style={[typography.captionMedium, styles.label]}>Stops</Text>
        <Card style={styles.stopsCard} padded={false}>
          {stops.length === 0 ? (
            <Text style={[typography.caption, styles.noStopsText]}>No stops added yet.</Text>
          ) : null}
          {stops.map((stop, index) => (
            <View key={stop.id} style={[styles.stopRow, index < stops.length - 1 && styles.stopRowBorder]}>
              <TouchableOpacity onPress={() => cycleStopType(stop.id)}>
                <MaterialCommunityIcons name={STOP_ICON[stop.type]} size={18} color={colors.accentSolid} />
              </TouchableOpacity>
              <TextInput
                value={stop.name}
                onChangeText={(value) => updateStopName(stop.id, value)}
                placeholder={`${stop.type} stop name`}
                placeholderTextColor={colors.textTertiary}
                style={styles.stopInput}
              />
              <TouchableOpacity onPress={() => removeStop(stop.id)}>
                <Ionicons name="remove-circle-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity activeOpacity={0.7} onPress={addStop} style={styles.addStopRow}>
            <Ionicons name="add" size={16} color={colors.accentSolid} />
            <Text style={[typography.captionMedium, styles.addStopText]}>Add fuel / rest / food stop</Text>
          </TouchableOpacity>
        </Card>

        <Text style={[typography.captionMedium, styles.sectionLabel]}>SAFETY (OPTIONAL)</Text>
        <Field label="Sweep rider name" value={sweepRiderName} onChangeText={setSweepRiderName} placeholder="e.g. Rhea" />
        <Field
          label="Sweep rider phone"
          value={sweepRiderPhone}
          onChangeText={setSweepRiderPhone}
          placeholder="+91 98XXXXXX21"
          keyboardType="phone-pad"
        />
        <Field label="Nearest hospital" value={nearestHospital} onChangeText={setNearestHospital} placeholder="Kamshet Rural, 8 km" />

        <View style={styles.visibilityRow}>
          <View style={styles.flexShrink}>
            <Text style={[typography.bodyMedium, styles.visibilityTitle]}>Public — discoverable by all riders</Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.surfaceElevated, true: colors.accentSolid }}
            thumbColor={colors.textPrimary}
          />
        </View>

        {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

        <Button label="Publish ride" onPress={handlePublish} loading={saving} style={styles.publishButton} />
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
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
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
  topBarTitle: {
    color: colors.textPrimary
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl
  },
  field: {
    marginTop: spacing.lg
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  sectionLabel: {
    color: colors.textTertiary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs
  },
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
    minHeight: 80,
    textAlignVertical: 'top'
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  rowField: {
    flex: 1
  },
  mapPreview: {
    marginTop: spacing.md
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  difficultyChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  difficultyChipActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentSolid
  },
  difficultyText: {
    color: colors.textSecondary
  },
  difficultyTextActive: {
    color: colors.accentSolid
  },
  stopsCard: {
    marginTop: spacing.xs
  },
  noStopsText: {
    color: colors.textTertiary,
    padding: spacing.md
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  stopRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  stopInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: spacing.xs
  },
  addStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  addStopText: {
    color: colors.accentSolid
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xl
  },
  flexShrink: {
    flexShrink: 1
  },
  visibilityTitle: {
    color: colors.textPrimary
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.md
  },
  publishButton: {
    marginTop: spacing.lg
  }
});
