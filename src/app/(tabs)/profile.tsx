import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Avatar, Card, ScreenContainer } from '@/components/ui';
import { useAuth } from '@/store/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useVehicles } from '@/hooks/useVehicles';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { vehicles, loading: vehiclesLoading } = useVehicles();

  if (profileLoading) {
    return (
      <ScreenContainer contentStyle={styles.loadingContainer}>
        <ActivityIndicator color={colors.accentSolid} size="large" />
      </ScreenContainer>
    );
  }

  const displayName = profile?.displayName || user?.displayName || 'Rider';
  const stats = profile?.rideStats;
  const primaryVehicle = vehicles.find((v) => v.isPrimary) ?? vehicles[0];

  return (
    <ScreenContainer scroll>
      <View style={styles.headerRow}>
        <Text style={[typography.h1, styles.headerTitle]}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/profile/edit')}>
        <View style={styles.identityRow}>
          <Avatar name={displayName} photoURL={profile?.photoURL} size="lg" />
          <View style={styles.identityText}>
            <Text style={[typography.h2, styles.name]}>{displayName}</Text>
            <Text style={[typography.caption, styles.location]}>
              {profile?.city ? `${profile.city} · ` : ''}
              {typeof profile?.ridingExperienceYears === 'number'
                ? `${profile.ridingExperienceYears} yrs riding`
                : 'Tap to complete your profile'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {profile?.bio ? <Text style={[typography.body, styles.bio]}>{profile.bio}</Text> : null}

      {stats ? (
        <View style={styles.statsRow}>
          <StatBlock label="Rides" value={String(stats.totalRides)} />
          <StatBlock label="Distance" value={`${(stats.totalDistanceKm / 1000).toFixed(1)}k km`} />
          <StatBlock label="Led" value={String(stats.groupRidesLed)} />
        </View>
      ) : null}

      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/vehicle')}>
        <Card style={styles.vehicleCard}>
          <View style={styles.vehicleIcon}>
            <MaterialCommunityIcons name="motorbike" size={22} color={colors.accentSolid} />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={[typography.bodyMedium, styles.vehicleTitle]}>My Vehicles</Text>
            {vehiclesLoading ? (
              <Text style={[typography.caption, styles.vehicleSubtitle]}>Loading...</Text>
            ) : primaryVehicle ? (
              <Text style={[typography.caption, styles.vehicleSubtitle]} numberOfLines={1}>
                {primaryVehicle.manufacturer} {primaryVehicle.model} · {vehicles.length} total
              </Text>
            ) : (
              <Text style={[typography.caption, styles.vehicleSubtitle]}>No vehicles added</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Card>
      </TouchableOpacity>

      <View style={styles.menuList}>
        <MenuRow icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />
        <MenuRow icon="shield-checkmark-outline" label="Emergency contact" onPress={() => router.push('/settings')} />
        <MenuRow icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
      </View>
    </ScreenContainer>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={[typography.h2, styles.statValue]}>{value}</Text>
      <Text style={[typography.caption, styles.statLabel]}>{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.menuRow}>
      <View style={styles.menuRowLeft}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
        <Text style={[typography.body, styles.menuLabel]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  headerTitle: {
    color: colors.textPrimary
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md
  },
  identityText: {
    flex: 1
  },
  name: {
    color: colors.textPrimary
  },
  location: {
    color: colors.textSecondary,
    marginTop: 2
  },
  bio: {
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xxs,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  statValue: {
    color: colors.textPrimary
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: 2
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  vehicleInfo: {
    flex: 1
  },
  vehicleTitle: {
    color: colors.textPrimary
  },
  vehicleSubtitle: {
    color: colors.textSecondary,
    marginTop: 2
  },
  menuList: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
    marginBottom: spacing.xxl
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  menuLabel: {
    color: colors.textPrimary
  }
});
