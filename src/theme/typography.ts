import { TextStyle } from 'react-native';

/**
 * RideMate typography scale. Uses the platform default system font
 * (San Francisco on iOS, Roboto on Android) rather than a bundled custom
 * font for Task 1 — keeps the shell dependency-free. A branded display
 * font can be introduced later via expo-font without touching call sites,
 * since every screen consumes these tokens rather than raw style objects.
 */
type TypographyToken = Pick<
  TextStyle,
  'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'
>;

export const typography: Record<string, TypographyToken> = {
  displayLg: { fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.4 },
  h1: { fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: -0.2 },
  h2: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
  bodyMedium: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  overline: { fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.4 }
};
