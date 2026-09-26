import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Avatar, AvatarStack, Badge, Button, Card, IconButton, ScreenContainer } from '@/components/ui';
import { RideScheduleList } from '@/components/ride';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { mockRides } from '@/constants/mockData';

export default function RideDetailsScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = useMemo(
    () => mockRides.find((r) => r.id === rideId) ?? mockRides[0],
    [rideId]
  );

  const visibleParticipants = ride.participants.slice(0, 4).map((p) => ({ id: p.userId, name: p.displayName }));

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <View style={styles.topBarRight}>
          <IconButton>
            <Ionicons name="share-outline" size={18} color={colors.textPrimary} />
          </IconButton>
          <IconButton>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textPrimary} />
          </IconButton>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <MapPlaceholder height={200} stops={ride.stops} live={ride.status === 'live'} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[typography.h1, styles.title]}>{ride.title}</Text>
          <Badge label={ride.difficulty} tone="neutral" />
        </View>

        <View style={styles.organizerRow}>
          <Avatar name={ride.organizerName} size="sm" />
          <Text style={[typography.caption, styles.organizerText]} numberOfLines={1}>
            Hosted by {ride.organizerName}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={[typography.caption, styles.metaText]}>{ride.dateLabel}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
          <Text style={[typography.caption, styles.metaText]}>{ride.distanceKm} km</Text>
        </View>

        <Card style={styles.scheduleCard}>
          <Text style={[typography.captionMedium, styles.sectionLabel]}>SCHEDULE</Text>
          <RideScheduleList stops={ride.stops} />
        </Card>

        <View style={styles.ridersHeaderRow}>
          <Text style={[typography.captionMedium, styles.sectionLabel]}>RIDERS</Text>
          <AvatarStack people={visibleParticipants} totalCountOverride={ride.currentRiderCount} size="md" />
        </View>

        {ride.sweepRiderName ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.infoRow}
            onPress={() => ride.sweepRiderPhone && Linking.openURL(`tel:${ride.sweepRiderPhone}`)}
          >
            <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
            <Text style={[typography.caption, styles.infoText]}>
              Sweep rider: {ride.sweepRiderName}{ride.sweepRiderPhone ? ` · ${ride.sweepRiderPhone}` : ''}
            </Text>
          </TouchableOpacity>
        ) : null}

        {ride.nearestHospital ? (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="hospital-box-outline" size={16} color={colors.textSecondary} />
            <Text style={[typography.caption, styles.infoText]}>Nearest hospital: {ride.nearestHospital}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Button label={`Join ride · ${ride.currentRiderCount} going`} onPress={() => {}} />
      </View>
    </ScreenContainer>
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
  topBarRight: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  mapWrap: {
    paddingHorizontal: spacing.lg
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  title: {
    color: colors.textPrimary,
    flexShrink: 1
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  organizerText: {
    color: colors.textSecondary
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.lg
  },
  metaText: {
    color: colors.textSecondary
  },
  metaDot: {
    color: colors.textTertiary
  },
  scheduleCard: {
    marginBottom: spacing.lg
  },
  sectionLabel: {
    color: colors.textTertiary,
    marginBottom: spacing.md
  },
  ridersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  infoText: {
    color: colors.textSecondary,
    flexShrink: 1
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  }
});
