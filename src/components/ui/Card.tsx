import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radii, spacing } from '@/theme';

export interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

/** Rounded surface container — the base of every ride/vehicle/notification card. */
export function Card({ padded = true, elevated = false, style, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        elevated && styles.elevated,
        padded && styles.padded,
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden'
  },
  elevated: {
    backgroundColor: colors.surfaceElevated
  },
  padded: {
    padding: spacing.lg
  }
});
