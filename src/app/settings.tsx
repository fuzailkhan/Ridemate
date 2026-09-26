import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Card, IconButton, ScreenContainer } from '@/components/ui';
import { mockEmergencyContacts } from '@/constants/mockData';
import { logout } from '@/services/authService';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [shareLocationByDefault, setShareLocationByDefault] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const primaryContact = mockEmergencyContacts.find((c) => c.isPrimary);

  async function handleLogout() {
    setLoggingOut(true);
    const result = await logout();
    setLoggingOut(false);
    // On success, AuthProvider's observer flips `user` to null and
    // Stack.Protected redirects into (auth) on its own — no manual
    // navigation here. If it fails, the row simply stops spinning; the
    // user is still signed in and can retry.
    if (!result.success) {
      // No dedicated error surface for this row in Task 1's visual shell;
      // failing silently-but-safely (user stays signed in) is preferable
      // to a broken navigation state.
    }
  }

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={[typography.captionMedium, styles.sectionLabel]}>NOTIFICATIONS</Text>
        <Card style={styles.card}>
          <ToggleRow
            label="Push notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
        </Card>

        <Text style={[typography.captionMedium, styles.sectionLabel]}>PRIVACY & LOCATION</Text>
        <Card style={styles.card}>
          <ToggleRow
            label="Share location by default on new rides"
            value={shareLocationByDefault}
            onValueChange={setShareLocationByDefault}
            last
          />
        </Card>
        <Text style={[typography.caption, styles.helperText]}>
          Live location is always visible only to joined members of an active ride, and stops
          automatically when a ride ends or you leave.
        </Text>

        <Text style={[typography.captionMedium, styles.sectionLabel]}>SAFETY</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Card style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={[typography.body, styles.rowLabel]}>Emergency contact</Text>
                <Text style={[typography.caption, styles.rowSubtitle]}>
                  {primaryContact ? `${primaryContact.name} · ${primaryContact.relation}` : 'Not set'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </Card>
        </TouchableOpacity>

        <Text style={[typography.captionMedium, styles.sectionLabel]}>ACCOUNT</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} disabled={loggingOut}>
          <Card style={styles.card}>
            {loggingOut ? (
              <ActivityIndicator color={colors.danger} />
            ) : (
              <Text style={[typography.bodyMedium, styles.logoutText]}>Log out</Text>
            )}
          </Card>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  last
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.rowBetween, !last && styles.rowBorder]}>
      <Text style={[typography.body, styles.rowLabel, styles.flexShrink]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceElevated, true: colors.accentSolid }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  topBarTitle: { color: colors.textPrimary },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sectionLabel: { color: colors.textTertiary, marginTop: spacing.xl, marginBottom: spacing.sm },
  card: { paddingVertical: spacing.sm },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  rowLabel: { color: colors.textPrimary },
  rowSubtitle: { color: colors.textSecondary, marginTop: 2 },
  flexShrink: { flexShrink: 1 },
  helperText: { color: colors.textTertiary, marginTop: spacing.sm },
  logoutText: { color: colors.danger, textAlign: 'center' }
});
