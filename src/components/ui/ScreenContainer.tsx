import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  noPadding?: boolean;
}

/** Standard screen wrapper: safe-area + dark background + optional scroll. */
export function ScreenContainer({
  children,
  scroll = false,
  edges = ['top', 'left', 'right'],
  contentStyle,
  noPadding = false
}: ScreenContainerProps) {
  const padding = noPadding ? undefined : styles.padding;

  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[padding, styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.flex, padding, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  flex: {
    flex: 1
  },
  padding: {
    paddingHorizontal: spacing.lg
  },
  scrollContent: {
    paddingBottom: spacing.xxxl
  }
});
