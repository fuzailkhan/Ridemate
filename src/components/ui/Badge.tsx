import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export type BadgeTone = 'neutral' | 'accent' | 'danger' | 'success';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

const TONE_STYLES: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceElevated, fg: colors.textSecondary },
  accent: { bg: colors.accentMuted, fg: colors.accentSolid },
  danger: { bg: colors.dangerMuted, fg: colors.danger },
  success: { bg: 'rgba(52, 199, 123, 0.16)', fg: colors.success }
};

/** Small rounded label — difficulty tags, "12 riders going", status pills. */
export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const toneStyle = TONE_STYLES[tone];
  return (
    <View style={[styles.base, { backgroundColor: toneStyle.bg }, style]}>
      <Text style={[typography.captionMedium, { color: toneStyle.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start'
  }
});
