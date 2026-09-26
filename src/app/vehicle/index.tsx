import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Badge, Card, IconButton, ScreenContainer } from '@/components/ui';
import { useVehicles } from '@/hooks/useVehicles';

export default function VehicleListScreen() {
  const { vehicles, loading } = useVehicles();

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>My Vehicles</Text>
        <IconButton onPress={() => router.push('/vehicle/add')}>
          <Ionicons name="add" size={20} color={colors.textPrimary} />
        </IconButton>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accentSolid} size="large" />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/vehicle/${item.id}`)}>
              <Card style={styles.vehicleCard}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="motorbike" size={22} color={colors.accentSolid} />
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={[typography.bodyMedium, styles.name]} numberOfLines={1}>
                      {item.manufacturer} {item.model}
                    </Text>
                    {item.isPrimary ? <Badge label="Primary" tone="accent" /> : null}
                  </View>
                  <Text style={[typography.caption, styles.subtitle]}>
                    {item.year} · {item.color} · {item.registrationNumber}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="motorbike-off" size={36} color={colors.textTertiary} />
              <Text style={[typography.h2, styles.emptyTitle]}>No vehicles added</Text>
              <Text style={[typography.body, styles.emptySubtitle]}>
                Add a motorcycle to attach it to the rides you join.
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  topBarTitle: { color: colors.textPrimary },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: spacing.xxl },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { color: colors.textPrimary, flexShrink: 1 },
  subtitle: { color: colors.textSecondary, marginTop: 2 },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.textPrimary,
    marginTop: spacing.xs
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center'
  }
});
