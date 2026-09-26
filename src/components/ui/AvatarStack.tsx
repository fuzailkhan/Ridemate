import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
import { Avatar, AvatarSize } from './Avatar';

export interface AvatarStackPerson {
  id: string;
  name: string;
  photoURL?: string;
}

export interface AvatarStackProps {
  people: AvatarStackPerson[];
  maxVisible?: number;
  size?: AvatarSize;
  totalCountOverride?: number;
}

/** Overlapping avatar row with a trailing "+N" chip — used on ride cards and ride details. */
export function AvatarStack({ people, maxVisible = 4, size = 'sm', totalCountOverride }: AvatarStackProps) {
  const visible = people.slice(0, maxVisible);
  const total = totalCountOverride ?? people.length;
  const overflow = total - visible.length;
  const dimension = size === 'lg' ? 56 : size === 'md' ? 36 : 28;
  const overlap = Math.round(dimension * 0.35);

  return (
    <View style={styles.row}>
      {visible.map((person, index) => (
        <View
          key={person.id}
          style={[
            styles.avatarWrap,
            { marginLeft: index === 0 ? 0 : -overlap, zIndex: visible.length - index }
          ]}
        >
          <Avatar name={person.name} photoURL={person.photoURL} size={size} />
        </View>
      ))}
      {overflow > 0 ? (
        <View
          style={[
            styles.overflowChip,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              marginLeft: -overlap
            }
          ]}
        >
          <Text style={[typography.captionMedium, styles.overflowText]}>+{overflow}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrap: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.background
  },
  overflowChip: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overflowText: {
    color: colors.textSecondary
  }
});
