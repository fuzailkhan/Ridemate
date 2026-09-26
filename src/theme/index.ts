import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = { colors, spacing, radii, typography } as const;

export { colors, spacing, radii, typography };
export type { ColorToken } from './colors';
export type { SpacingToken } from './spacing';
export type { RadiusToken } from './radii';
