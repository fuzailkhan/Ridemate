import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import type { RideStop } from '@/types/models';

const ICON_BY_TYPE: Record<RideStop['type'], keyof typeof MaterialCommunityIcons.glyphMap> = {
  meeting: 'map-marker',
  fuel: 'gas-station',
  rest: 'coffee',
  food: 'silverware-fork-knife',
  checkpoint: 'flag-variant',
  destination: 'flag-checkered'
};

/** Vertical timeline of ride stops — used on Ride Details. */
export function RideScheduleList({ stops }: { stops: RideStop[] }) {
  const sorted = [...stops].sort((a, b) => a.order - b.order);

  return (
    <View>
      {sorted.map((stop, index) => (
        <View key={stop.id} style={styles.row}>
          <View style={styles.iconColumn}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={ICON_BY_TYPE[stop.type]} size={14} color={colors.accentSolid} />
            </View>
            {index < sorted.length - 1 ? <View style={styles.connector} /> : null}
          </View>
          <View style={styles.textColumn}>
            {stop.estimatedArrival ? (
              <Text style={[typography.captionMedium, styles.time]}>{stop.estimatedArrival}</Text>
            ) : null}
            <Text style={[typography.body, styles.name]}>{stop.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  iconColumn: {
    alignItems: 'center',
    width: 32
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: colors.border,
    marginVertical: spacing.xxs
  },
  textColumn: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingLeft: spacing.sm
  },
  time: {
    color: colors.textSecondary,
    marginBottom: 2
  },
  name: {
    color: colors.textPrimary
  }
});
