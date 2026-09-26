import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';
import { AuthProvider, useAuth } from '@/store/AuthProvider';

/**
 * Route gating driven by real Firebase auth state via Stack.Protected
 * (the current officially-recommended Expo Router pattern, stable since
 * SDK 53) rather than a manual <Redirect>. Router's own documented
 * fallback behavior — landing on the first accessible screen for the
 * current guard state — replaces the Task 1 index.tsx redirect, which is
 * why that file no longer exists: keeping an unconditional redirect
 * alongside guards is exactly what causes redirect bounces.
 */
function RootLayoutNav() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.accentSolid} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ride/create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ride/[rideId]/index" />
        <Stack.Screen name="ride/[rideId]/edit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ride/[rideId]/chat" />
        <Stack.Screen name="vehicle/index" />
        <Stack.Screen name="vehicle/add" options={{ presentation: 'modal' }} />
        <Stack.Screen name="vehicle/[vehicleId]/index" />
        <Stack.Screen name="vehicle/[vehicleId]/edit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="group/[groupId]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
