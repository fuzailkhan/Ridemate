import React from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '@/theme';

export interface IconButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  variant?: 'default' | 'filled';
  style?: ViewStyle;
  testID?: string;
}

/** Circular icon-only button — top-bar actions (back, share, more, notifications bell). */
export function IconButton({ children, onPress, size = 40, variant = 'default', style, testID }: IconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      testID={testID}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'filled' && styles.filled,
        style
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  filled: {
    backgroundColor: colors.surface
  }
});
