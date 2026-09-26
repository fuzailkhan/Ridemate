/**
 * RideMate color tokens.
 *
 * Derived from the Rork prototype's visual direction: a dark, asphalt-like
 * base with a warm amber-to-orange accent used for primary actions, and a
 * clear red reserved exclusively for safety/SOS so it never competes with
 * ordinary CTAs for attention.
 */
export const colors = {
  // Backgrounds
  background: '#0B0D10',
  backgroundElevated: '#111419',
  surface: '#15181D',
  surfaceElevated: '#1C2026',
  border: '#262B33',
  borderSubtle: '#1D2127',

  // Text
  textPrimary: '#F5F6F7',
  textSecondary: '#9BA1AC',
  textTertiary: '#6B7280',
  textInverse: '#0B0D10',

  // Accent (primary CTA gradient)
  accentStart: '#FFB238',
  accentEnd: '#FF6A1A',
  accentSolid: '#FF7A18',
  accentMuted: 'rgba(255, 122, 24, 0.16)',

  // Status
  danger: '#E23B3B',
  dangerMuted: 'rgba(226, 59, 59, 0.16)',
  success: '#34C77B',
  warning: '#F5B84C',
  online: '#34C77B',
  offline: '#5B616B',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlaySubtle: 'rgba(0, 0, 0, 0.35)',
  scrim: 'rgba(11, 13, 16, 0.92)'
} as const;

export type ColorToken = keyof typeof colors;
