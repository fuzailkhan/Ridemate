import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Button, IconButton, ScreenContainer } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { registerWithEmail } from '@/services/authService';
import { validateRegisterForm } from '@/utils/validation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function clearErrorOnEdit<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      if (error) setError(null);
    };
  }

  async function handleRegister() {
    const validationError = validateRegisterForm({ fullName: name, email, password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await registerWithEmail(name.trim(), email.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
    // On success, Stack.Protected redirects automatically via AuthProvider.
  }

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <IconButton onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
      </IconButton>

      <Text style={[typography.displayLg, styles.title]}>Create your account</Text>
      <Text style={[typography.body, styles.subtitle]}>Join RideMate to plan and join group rides.</Text>

      <View style={styles.field}>
        <Text style={[typography.captionMedium, styles.label]}>Full name</Text>
        <TextInput
          value={name}
          onChangeText={clearErrorOnEdit(setName)}
          placeholder="Your name"
          placeholderTextColor={colors.textTertiary}
          editable={!submitting}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={[typography.captionMedium, styles.label]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={clearErrorOnEdit(setEmail)}
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
          onChangeText={clearErrorOnEdit(setPassword)}
          placeholder="At least 8 characters"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          editable={!submitting}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={[typography.captionMedium, styles.label]}>Confirm password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={clearErrorOnEdit(setConfirmPassword)}
          placeholder="Re-enter your password"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          editable={!submitting}
          style={styles.input}
        />
      </View>

      {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

      <Button label="Create account" onPress={handleRegister} loading={submitting} style={styles.submitButton} />

      <View style={styles.footerRow}>
        <Text style={[typography.body, styles.footerText]}>Already have an account?</Text>
        <Link href="/(auth)/login">
          <Text style={[typography.bodyMedium, styles.footerLink]}>Log in</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg
  },
  backButton: {
    marginBottom: spacing.xl
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
  submitButton: {
    marginTop: spacing.sm,
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
