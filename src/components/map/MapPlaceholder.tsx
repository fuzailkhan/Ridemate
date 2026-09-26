import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import type { RideParticipant, RideStop } from '@/types/models';

export interface MapPlaceholderProps {
  height?: number;
  stops?: RideStop[];
  participants?: RideParticipant[];
  compact?: boolean;
  live?: boolean;
}

/**
 * Static visual stand-in for the live/route map. Task 1 is scoped to the
 * navigation and visual shell only — a real map SDK (react-native-maps or
 * equivalent) is wired up in the Live Location phase, not here. This
 * component reproduces the map's *layout role* (route line, stop pins,
 * rider markers) using styled Views so every screen composes correctly
 * ahead of that integration.
 */
export function MapPlaceholder({
  height = 220,
  stops = [],
  participants = [],
  compact = false,
  live = false
}: MapPlaceholderProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!live) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [live, pulse]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.grid} pointerEvents="none">
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={`row-${row}`} style={styles.gridRow} />
        ))}
      </View>
      <View style={styles.vignetteLeft} pointerEvents="none" />
      <View style={styles.vignetteRight} pointerEvents="none" />

      <View style={styles.routeWrap} pointerEvents="none">
        <View style={[styles.routeSegment, styles.routeSegmentA]} />
        <View style={[styles.routeSegment, styles.routeSegmentB]} />
      </View>

      {stops.length > 0 ? (
        <View style={styles.stopsRow}>
          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopPinWrap}>
              <View style={styles.stopPin}>
                <MaterialCommunityIcons name={iconForStop(stop.type)} size={13} color={colors.textInverse} />
              </View>
              {!compact ? (
                <Text style={[typography.caption, styles.stopLabel]} numberOfLines={1}>
                  {index + 1}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {participants.length > 0 ? (
        <View style={styles.ridersLayer} pointerEvents="none">
          {participants.slice(0, 6).map((p, index) => (
            <View
              key={p.userId}
              style={[
                styles.riderDot,
                {
                  left: `${12 + ((index * 15) % 76)}%`,
                  top: `${20 + ((index * 23) % 55)}%`,
                  backgroundColor: p.isSharingLocation ? colors.accentSolid : colors.offline
                }
              ]}
            />
          ))}
        </View>
      ) : null}

      {live ? (
        <View style={styles.liveBadge}>
          <View style={styles.liveDotWrap}>
            <Animated.View
              style={[styles.liveDotPulse, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]}
            />
            <View style={styles.liveDot} />
          </View>
          <Text style={[typography.captionMedium, styles.liveText]}>LIVE</Text>
        </View>
      ) : null}

      <View style={styles.badge}>
        <MaterialCommunityIcons name="map-marker-radius" size={14} color={colors.textSecondary} />
        <Text style={[typography.caption, styles.badgeText]}>Map preview — live map connects in a later task</Text>
      </View>
    </View>
  );
}

function iconForStop(type: RideStop['type']): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (type) {
    case 'fuel':
      return 'gas-station';
    case 'rest':
      return 'coffee';
    case 'food':
      return 'silverware-fork-knife';
    case 'destination':
      return 'flag-checkered';
    case 'meeting':
      return 'map-marker';
    default:
      return 'map-marker-outline';
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    backgroundColor: '#0E1218',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: 'flex-end'
  },
  grid: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-evenly'
  },
  gridRow: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  vignetteLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: 'rgba(0,0,0,0.28)'
  },
  vignetteRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '20%',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  routeWrap: {
    position: 'absolute',
    left: '14%',
    right: '14%',
    top: '24%',
    height: '30%'
  },
  routeSegment: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accentSolid,
    opacity: 0.85
  },
  routeSegmentA: {
    left: 0,
    width: '58%',
    top: '10%',
    transform: [{ rotate: '-10deg' }]
  },
  routeSegmentB: {
    right: 0,
    width: '52%',
    bottom: '10%',
    transform: [{ rotate: '6deg' }]
  },
  stopsRow: {
    position: 'absolute',
    top: '24%',
    left: '10%',
    right: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stopPinWrap: {
    alignItems: 'center'
  },
  stopPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  stopLabel: {
    color: colors.textSecondary,
    marginTop: 2
  },
  ridersLayer: {
    ...StyleSheet.absoluteFill
  },
  riderDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.background
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.scrim,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill
  },
  liveDotWrap: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success
  },
  liveDotPulse: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success
  },
  liveText: {
    color: colors.success,
    letterSpacing: 0.6
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    margin: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.scrim,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill
  },
  badgeText: {
    color: colors.textSecondary
  }
});
