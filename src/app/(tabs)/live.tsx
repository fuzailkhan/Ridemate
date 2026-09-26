import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Avatar, Badge, Button, Card, ScreenContainer } from '@/components/ui';
import { MapPlaceholder } from '@/components/map/MapPlaceholder';
import { mockRides } from '@/constants/mockData';

/**
 * Home / Live Ride tab. Shows the active ride's live tracker when the
 * rider has a ride in "live" status (matches the prototype's primary
 * screen); otherwise falls back to an empty state. All data is mock —
 * the actual "am I in a live ride" check and live location feed are
 * wired up in the Live Location task.
 */
export default function LiveRideScreen() {
  const activeRide = useMemo(() => mockRides.find((r) => r.status === 'live'), []);
  const [isSharing, setIsSharing] = useState(true);

  if (!activeRide) {
    return (
      <ScreenContainer contentStyle={styles.emptyState}>
        <MaterialCommunityIcons name="motorbike" size={40} color={colors.textTertiary} />
        <Text style={[typography.h2, styles.emptyTitle]}>No ride in progress</Text>
        <Text style={[typography.body, styles.emptySubtitle]}>
          Join a ride from Discover to see live tracking here.
        </Text>
        <Button label="Discover rides" onPress={() => router.push('/(tabs)')} fullWidth={false} />
      </ScreenContainer>
    );
  }

  const nextStop = activeRide.stops.find((s) => s.type !== 'meeting') ?? activeRide.stops[0];
  const progressPct = 0.62;

  return (
    <ScreenContainer scroll>
      <View style={styles.mapWrap}>
        <MapPlaceholder height={300} stops={activeRide.stops} participants={activeRide.participants} live />
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton}>
            <Ionicons name="locate" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <Ionicons name="navigate" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <View style={styles.flexShrink}>
            <Text style={[typography.h2, styles.rideTitle]} numberOfLines={1}>
              {activeRide.title}
            </Text>
            <Text style={[typography.caption, styles.nextStopText]} numberOfLines={1}>
              Next: {nextStop.name.replace(/^Fuel:\s*|^Rest:\s*|^Destination:\s*/, '')}
            </Text>
          </View>
          <Badge label="Live now" tone="success" />
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
        </View>
        <View style={styles.progressMetaRow}>
          <Text style={[typography.caption, styles.progressMetaText]}>
            {Math.round(activeRide.distanceKm * (1 - progressPct))} km · {Math.round(
              activeRide.estimatedDurationMin * (1 - progressPct)
            )} min left
          </Text>
          <Text style={[typography.caption, styles.progressMetaText]}>
            {activeRide.currentRiderCount} riders live
          </Text>
        </View>

        <View style={styles.ridersRow}>
          {activeRide.participants.slice(0, 5).map((p) => (
            <View key={p.userId} style={styles.riderChip}>
              <Avatar name={p.displayName} online={p.isSharingLocation} showStatusDot size="sm" />
              <Text style={[typography.caption, styles.riderName]} numberOfLines={1}>
                {p.displayName}
              </Text>
              <Text style={[typography.caption, styles.riderSpeed]} numberOfLines={1}>
                {typeof p.speedKmh === 'number' ? `${p.speedKmh.toFixed(1)}km/h` : '—'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push(`/ride/${activeRide.id}/chat`)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.textPrimary} />
            <Text style={[typography.captionMedium, styles.chatButtonText]}>Chat · 3 new</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stopsButton}
            onPress={() => router.push(`/ride/${activeRide.id}`)}
          >
            <Ionicons name="location-outline" size={16} color={colors.textPrimary} />
            <Text style={[typography.captionMedium, styles.chatButtonText]}>Stops</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sosButton}>
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={[typography.captionMedium, styles.sosButtonText]}>SOS</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.sharingCard}>
        <View style={styles.sharingRow}>
          <View style={styles.flexShrink}>
            <Text style={[typography.bodyMedium, styles.sharingTitle]}>Location sharing</Text>
            <Text style={[typography.caption, styles.sharingSubtitle]}>
              {isSharing ? 'Visible to riders on this ride' : 'Not sharing your location'}
            </Text>
          </View>
          <Button
            label={isSharing ? 'Stop sharing' : 'Start sharing'}
            variant={isSharing ? 'secondary' : 'primary'}
            fullWidth={false}
            size="md"
            onPress={() => setIsSharing((v) => !v)}
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl
  },
  emptyTitle: {
    color: colors.textPrimary,
    marginTop: spacing.sm
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg
  },
  mapWrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm
  },
  mapControls: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    gap: spacing.sm
  },
  mapControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    zIndex: 2
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  flexShrink: {
    flexShrink: 1
  },
  rideTitle: {
    color: colors.textPrimary
  },
  nextStopText: {
    color: colors.textSecondary,
    marginTop: 2
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceElevated,
    marginTop: spacing.md,
    overflow: 'hidden'
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentSolid
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs
  },
  progressMetaText: {
    color: colors.textSecondary
  },
  ridersRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md
  },
  riderChip: {
    alignItems: 'center',
    width: 56
  },
  riderName: {
    color: colors.textPrimary,
    marginTop: spacing.xs
  },
  riderSpeed: {
    color: colors.textTertiary
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  stopsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  chatButtonText: {
    color: colors.textPrimary
  },
  sosButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.danger
  },
  sosButtonText: {
    color: '#FFFFFF'
  },
  sharingCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl
  },
  sharingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  sharingTitle: {
    color: colors.textPrimary
  },
  sharingSubtitle: {
    color: colors.textSecondary,
    marginTop: 2
  }
});
