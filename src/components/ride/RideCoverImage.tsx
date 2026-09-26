import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import type { RideDifficulty } from '@/types/models';

export interface RideCoverImageProps {
  title: string;
  height?: number;
  difficulty?: RideDifficulty;
  children?: React.ReactNode;
}

/**
 * Reusable gradient cover for ride cards/headers, standing in for a photo
 * until real cover-image upload exists. Built entirely from theme colors
 * and a vector icon watermark — no external or placeholder image downloads,
 * and nothing derived from the Rork prototype's own imagery/assets.
 *
 * Varies the gradient mood slightly by difficulty so a list of ride cards
 * doesn't read as visually identical, similar in spirit to how the
 * prototype's photos differ per ride without us reproducing any of them.
 */
export function RideCoverImage({ title, height = 132, difficulty = 'moderate', children }: RideCoverImageProps) {
  const [from, to] = GRADIENT_BY_DIFFICULTY[difficulty];

  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient colors={[from, to]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill}>
        <MaterialCommunityIcons
          name="road-variant"
          size={height * 1.1}
          color="rgba(255,255,255,0.08)"
          style={[styles.watermark, { right: -height * 0.18, bottom: -height * 0.28 }]}
        />
      </LinearGradient>

      <LinearGradient
        colors={['rgba(11,13,16,0)', 'rgba(11,13,16,0.85)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.35 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>
        <Text style={[typography.h2, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        {children}
      </View>
    </View>
  );
}

const GRADIENT_BY_DIFFICULTY: Record<RideDifficulty, [string, string]> = {
  easy: ['#2E4B3B', '#0B0D10'],
  moderate: [colors.accentEnd, '#3A1F0B'],
  hard: ['#6B1F1F', '#0B0D10']
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated
  },
  watermark: {
    position: 'absolute'
  },
  content: {
    padding: spacing.md
  },
  title: {
    color: '#FFFFFF'
  }
});
