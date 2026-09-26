import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Button, IconButton, ScreenContainer } from '@/components/ui';
import { sendPasswordReset } from '@/services/authService';
import { validateEmailForReset } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    const validationError = validateEmailForReset(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await sendPasswordReset(email.trim());
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <ScreenContainer scroll contentStyle={styles.content}>
        <IconButton onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
        </IconButton>

        <View style={styles.successIcon}>
          <Ionicons name="mail-outline" size={28} color={colors.success} />
        </View>
        <Text style={[typography.displayLg, styles.title]}>Check your email</Text>
        <Text style={[typography.body, styles.subtitle]}>
          If an account exists for {email.trim()}, a password reset link is on its way.
        </Text>

        <Button label="Back to login" onPress={() => router.replace('/(auth)/login')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <IconButton onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
      </IconButton>

      <Text style={[typography.displayLg, styles.title]}>Reset password</Text>
      <Text style={[typography.body, styles.subtitle]}>
        Enter the email on your account and we will send a reset link.
      </Text>

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

      {error ? <Text style={[typography.caption, styles.errorText]}>{error}</Text> : null}

      <Button label="Send reset link" onPress={handleSendReset} loading={submitting} />
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
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(52, 199, 123, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
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
    marginBottom: spacing.xl
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
  }
});
