import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name: string;
  photoURL?: string;
  size?: AvatarSize;
  online?: boolean;
  showStatusDot?: boolean;
}

const SIZE_MAP: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 56 };

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Circular rider avatar with optional online-status dot (green dot seen on the prototype's rider chips). */
export function Avatar({ name, photoURL, size = 'md', online, showStatusDot = false }: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const dotSize = Math.max(8, Math.round(dimension * 0.28));

  return (
    <View style={{ width: dimension, height: dimension }}>
      {photoURL ? (
        <Image
          source={{ uri: photoURL }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: dimension, height: dimension, borderRadius: dimension / 2 }
          ]}
        >
          <Text style={[styles.initials, { fontSize: dimension * 0.36 }]}>{initialsFor(name)}</Text>
        </View>
      )}
      {showStatusDot ? (
        <View
          style={[
            styles.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: online ? colors.online : colors.offline
            }
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceElevated
  },
  fallback: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  initials: {
    color: colors.textSecondary,
    fontWeight: '700'
  },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    borderWidth: 2,
    borderColor: colors.background
  }
});
