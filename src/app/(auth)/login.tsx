import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/components/ui';
import { loginWithEmail } from '@/services/authService';
import { validateLoginForm } from '@/utils/validation';

/**
 * Login screen wired to real Firebase Authentication. On success this does
 * NOT manually navigate — Stack.Protected in the root layout reacts to the
 * auth-state change (via AuthProvider's onAuthStateChanged subscription)
 * and redirects into (tabs) on its own. A manual redirect here would race
 * with that and risk the bounce the routing rules were written to avoid.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await loginWithEmail(email.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
    // On success, AuthProvider's observer updates `user` and Stack.Protected
    // handles navigation — nothing further to do here.
  }

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <MaterialCommunityIcons name="motorbike" size={22} color={colors.accentSolid} />
        </View>
        <Text style={[typography.h1, styles.brandText]}>RideMate</Text>
      </View>

      <Text style={[typography.displayLg, styles.title]}>Welcome back</Text>
      <Text style={[typography.body, styles.subtitle]}>Log in to see your rides and groups.</Text>

      <View style={styles.field}>
        <Text style={[typography.captionMedium, styles.label]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!submitting}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={[typography.captionMedium, styles.label]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) setError(null);
          }}
          placeholder="••••••••"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          editable={!submitting}
          style={styles.input}
        />
      </View>

      {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

      <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
        <Text style={[typography.caption, styles.forgotText]}>Forgot password?</Text>
      </Link>

      <Button label="Log in" onPress={handleLogin} loading={submitting} style={styles.loginButton} />

      <View style={styles.footerRow}>
        <Text style={[typography.body, styles.footerText]}>New to RideMate?</Text>
        <Link href="/(auth)/register">
          <Text style={[typography.bodyMedium, styles.footerLink]}>Create an account</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingTop: spacing.xxxl
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandText: {
    color: colors.textPrimary
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xxl
  },
  field: {
    marginBottom: spacing.lg
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 15
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl
  },
  forgotText: {
    color: colors.accentSolid
  },
  loginButton: {
    marginBottom: spacing.xl
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs
  },
  footerText: {
    color: colors.textSecondary
  },
  footerLink: {
    color: colors.accentSolid
  }
});
