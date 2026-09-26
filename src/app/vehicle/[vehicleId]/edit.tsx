import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Button, IconButton, ScreenContainer } from '@/components/ui';
import { useAuth } from '@/store/AuthProvider';
import { useVehicles } from '@/hooks/useVehicles';
import { updateVehicle, updateVehiclePhoto } from '@/services/vehiclesService';
import { pickImageFromLibrary } from '@/utils/imagePicker';

export default function EditVehicleScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const { vehicles, loading } = useVehicles();
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  const [manufacturer, setManufacturer] = useState(vehicle?.manufacturer ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [year, setYear] = useState(vehicle ? String(vehicle.year) : '');
  const [color, setColor] = useState(vehicle?.color ?? '');
  const [registrationNumber, setRegistrationNumber] = useState(vehicle?.registrationNumber ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleChangePhoto() {
    if (!vehicle || !user) return;
    const result = await pickImageFromLibrary();
    if (result.permissionDenied) {
      setError('Photo library permission is needed to change the photo.');
      return;
    }
    if (!result.uri) return;

    setUploadingPhoto(true);
    const uploadResult = await updateVehiclePhoto(user.uid, vehicle.id, result.uri);
    setUploadingPhoto(false);
    if (!uploadResult.success) {
      setError(uploadResult.error ?? 'Could not update photo.');
    }
  }

  async function handleSave() {
    if (!vehicle) return;
    if (!manufacturer.trim() || !model.trim() || !registrationNumber.trim()) {
      setError('Manufacturer, model, and registration number are required.');
      return;
    }
    const parsedYear = Number(year.trim());
    if (!year.trim() || Number.isNaN(parsedYear)) {
      setError('Enter a valid year.');
      return;
    }

    setError(null);
    setSaving(true);
    const result = await updateVehicle(vehicle.id, {
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year: parsedYear,
      color: color.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase()
    });
    setSaving(false);

    if (!result.success) {
      setError(result.error ?? 'Could not save vehicle.');
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

  if (!vehicle) {
    return (
      <ScreenContainer noPadding>
        <View style={styles.topBar}>
          <IconButton onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={colors.textPrimary} />
          </IconButton>
          <Text style={[typography.h2, styles.topBarTitle]}>Edit vehicle</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={[typography.body, styles.notFoundText]}>This vehicle could not be found.</Text>
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
        <Text style={[typography.h2, styles.topBarTitle]}>Edit vehicle</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.photoSection}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleChangePhoto} disabled={uploadingPhoto}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="motorbike" size={28} color={colors.accentSolid} />
            </View>
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

        <Field label="Manufacturer" value={manufacturer} onChangeText={setManufacturer} placeholder="e.g. KTM" />
        <Field label="Model" value={model} onChangeText={setModel} placeholder="e.g. Duke 390" />
        <Field label="Year" value={year} onChangeText={setYear} placeholder="e.g. 2023" keyboardType="numeric" />
        <Field label="Color" value={color} onChangeText={setColor} placeholder="e.g. Atlas Grey" />
        <Field
          label="Registration number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          placeholder="MH12 AB 1234"
          autoCapitalize="characters"
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
  autoCapitalize
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'characters';
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
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
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
  notFound: { alignItems: 'center', paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl },
  notFoundText: { color: colors.textSecondary },
  photoSection: { alignItems: 'center', marginBottom: spacing.xl },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 15
  },
  errorText: { color: colors.danger, marginBottom: spacing.md },
  saveButton: { marginTop: spacing.sm }
});
