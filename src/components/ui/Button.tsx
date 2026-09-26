import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

/**
 * RideMate's primary action button. The "primary" variant renders the
 * amber-to-orange gradient seen throughout the Rork prototype (the "Build" /
 * "Publish ride" / "Join ride" buttons); other variants cover secondary and
 * destructive (SOS-adjacent, but SOS itself uses its own component) actions.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  style,
  testID
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const height = size === 'lg' ? 52 : 44;
  const fontStyle = size === 'lg' ? typography.bodyMedium : typography.captionMedium;

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.textPrimary : colors.textInverse} />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              fontStyle,
              styles.label,
              variant === 'secondary' || variant === 'ghost' ? styles.labelOnDark : styles.labelOnAccent
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  const baseStyle: ViewStyle = {
    height,
    borderRadius: radii.pill,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        onPress={onPress}
        testID={testID}
        style={[baseStyle, styles.primaryShadow, style]}
      >
        <LinearGradient
          colors={[colors.accentStart, colors.accentEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.filled, { height, borderRadius: radii.pill }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        onPress={onPress}
        testID={testID}
        style={[
          baseStyle,
          styles.filled,
          { backgroundColor: colors.danger },
          style
        ]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        onPress={onPress}
        testID={testID}
        style={[
          baseStyle,
          styles.filled,
          styles.secondary,
          style
        ]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  // ghost
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      style={[baseStyle, styles.filled, styles.ghost, style]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryShadow: {
    shadowColor: colors.accentEnd,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  filled: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  label: {
    textAlign: 'center'
  },
  labelOnAccent: {
    color: colors.textInverse
  },
  labelOnDark: {
    color: colors.textPrimary
  }
});
