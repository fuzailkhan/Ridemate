import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Badge, Card, IconButton, ScreenContainer } from '@/components/ui';
import { useAuth } from '@/store/AuthProvider';
import { useVehicles } from '@/hooks/useVehicles';
import { deleteVehicle, setPrimaryVehicle } from '@/services/vehiclesService';

export default function VehicleDetailScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const { vehicles, loading } = useVehicles();
  const [busy, setBusy] = useState(false);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  async function handleSetPrimary() {
    if (!user || !vehicle) return;
    setBusy(true);
    const result = await setPrimaryVehicle(user.uid, vehicle.id);
    setBusy(false);
    if (!result.success) {
      Alert.alert('Could not update', result.error ?? 'Please try again.');
    }
  }

  function confirmDelete() {
    if (!vehicle) return;
    Alert.alert('Delete vehicle', `Remove ${vehicle.manufacturer} ${vehicle.model}? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete }
    ]);
  }

  async function handleDelete() {
    if (!user || !vehicle) return;
    setBusy(true);
    const result = await deleteVehicle(user.uid, vehicle.id);
    setBusy(false);
    if (!result.success) {
      Alert.alert('Could not delete', result.error ?? 'Please try again.');
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
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </IconButton>
          <Text style={[typography.h2, styles.topBarTitle]}>Vehicle</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={[typography.body, styles.notFoundText]}>This vehicle could not be found.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Vehicle</Text>
        <IconButton onPress={() => router.push(`/vehicle/${vehicle.id}/edit`)}>
          <Ionicons name="create-outline" size={18} color={colors.textPrimary} />
        </IconButton>
      </View>

      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="motorbike" size={32} color={colors.accentSolid} />
        </View>
        <View style={styles.nameRow}>
          <Text style={[typography.h1, styles.name]}>
            {vehicle.manufacturer} {vehicle.model}
          </Text>
          {vehicle.isPrimary ? <Badge label="Primary" tone="accent" /> : null}
        </View>

        <Card style={styles.detailCard}>
          <DetailRow label="Year" value={String(vehicle.year)} />
          <DetailRow label="Color" value={vehicle.color} />
          <DetailRow label="Registration" value={vehicle.registrationNumber} last />
        </Card>

        {vehicle.modifications && vehicle.modifications.length > 0 ? (
          <View style={styles.modsSection}>
            <Text style={[typography.captionMedium, styles.sectionLabel]}>MODIFICATIONS</Text>
            <View style={styles.modsRow}>
              {vehicle.modifications.map((mod) => (
                <Badge key={mod} label={mod} tone="neutral" />
              ))}
            </View>
          </View>
        ) : null}

        {!vehicle.isPrimary ? (
          <TouchableOpacity activeOpacity={0.8} onPress={handleSetPrimary} disabled={busy} style={styles.actionRow}>
            <Ionicons name="star-outline" size={16} color={colors.accentSolid} />
            <Text style={[typography.bodyMedium, styles.actionText]}>Set as primary vehicle</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity activeOpacity={0.8} onPress={confirmDelete} disabled={busy} style={styles.actionRow}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[typography.bodyMedium, styles.deleteText]}>Delete vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <Text style={[typography.body, styles.detailLabel]}>{label}</Text>
      <Text style={[typography.bodyMedium, styles.detailValue]}>{value}</Text>
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
  body: { paddingHorizontal: spacing.lg },
  notFound: { alignItems: 'center', paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl },
  notFoundText: { color: colors.textSecondary },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  name: { color: colors.textPrimary, flexShrink: 1 },
  detailCard: { marginBottom: spacing.lg },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  detailLabel: { color: colors.textSecondary },
  detailValue: { color: colors.textPrimary },
  modsSection: { marginBottom: spacing.xl },
  sectionLabel: { color: colors.textTertiary, marginBottom: spacing.sm },
  modsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md
  },
  actionText: { color: colors.accentSolid },
  deleteText: { color: colors.danger }
});
