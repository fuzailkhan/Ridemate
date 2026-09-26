import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Card, AvatarStack } from '@/components/ui';
import { RideStatusPill } from './RideStatusPill';
import { RideCoverImage } from './RideCoverImage';
import type { Ride } from '@/types/models';

export interface RideCardProps {
  ride: Ride;
  onPress?: () => void;
}

/** Ride summary card — Discover Rides list and Groups/Profile ride references. */
export function RideCard({ ride, onPress }: RideCardProps) {
  const participants = ride.participants.slice(0, 4).map((p) => ({ id: p.userId, name: p.displayName }));

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card padded={false} elevated style={styles.card}>
        <RideCoverImage title={ride.title} difficulty={ride.difficulty}>
          <View style={styles.coverMetaRow}>
            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.coverMetaText}>{ride.dateLabel}</Text>
            <Text style={styles.coverMetaDot}>·</Text>
            <Text style={styles.coverMetaText}>{ride.distanceKm} km</Text>
          </View>
        </RideCoverImage>
        <View style={styles.statusRow}>
          <RideStatusPill status={ride.status} />
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[typography.caption, styles.metaText]} numberOfLines={1}>
              Meet: {ride.meetingPoint.name}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <AvatarStack people={participants} totalCountOverride={ride.currentRiderCount} size="sm" />
            <View style={styles.footerRight}>
              <Text style={[typography.captionMedium, styles.ridersGoing]}>
                {ride.currentRiderCount} riders going
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg
  },
  statusRow: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm
  },
  coverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs
  },
  coverMetaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)'
  },
  coverMetaDot: {
    color: 'rgba(255,255,255,0.5)'
  },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.md
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md
  },
  metaText: {
    color: colors.textSecondary
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs
  },
  ridersGoing: {
    color: colors.textPrimary
  }
});
