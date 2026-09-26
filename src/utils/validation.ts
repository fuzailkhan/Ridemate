/**
 * Client-side validation shared by the auth screens. Runs before any
 * Firebase call so obviously-invalid input gets instant feedback instead
 * of a round trip — Firebase's own errors (mapped in authService) remain
 * the backstop for anything this misses.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Returns the first validation problem found, or null if the form is valid. */
export function validateRegisterForm(values: RegisterFormValues): string | null {
  if (!values.fullName.trim()) return 'Enter your full name.';
  if (!values.email.trim()) return 'Enter your email address.';
  if (!isValidEmail(values.email)) return 'That email address looks invalid.';
  if (!values.password) return 'Enter a password.';
  if (!isValidPassword(values.password)) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (values.password !== values.confirmPassword) return 'Passwords do not match.';
  return null;
}

export function validateLoginForm(email: string, password: string): string | null {
  if (!email.trim()) return 'Enter your email address.';
  if (!isValidEmail(email)) return 'That email address looks invalid.';
  if (!password) return 'Enter your password.';
  return null;
}

export function validateEmailForReset(email: string): string | null {
  if (!email.trim()) return 'Enter your email address.';
  if (!isValidEmail(email)) return 'That email address looks invalid.';
  return null;
}

export { MIN_PASSWORD_LENGTH };
