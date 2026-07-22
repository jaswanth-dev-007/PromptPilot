import { colors, typography, spacing, radii, shadows, motion } from '../tokens'

export const lightTheme = {
  colors: {
    bg: colors.white,
    'bg-muted': colors.neutral[50],
    'bg-subtle': colors.neutral[100],
    'bg-hover': colors.neutral[100],
    'bg-pressed': colors.neutral[200],

    fg: colors.neutral[900],
    'fg-muted': colors.neutral[500],
    'fg-subtle': colors.neutral[400],
    'fg-on-emphasis': colors.white,

    border: colors.neutral[200],
    'border-muted': colors.neutral[100],
    'border-hover': colors.neutral[300],

    'primary-bg': colors.primary[600],
    'primary-fg': colors.white,
    'primary-hover': colors.primary[700],
    'primary-pressed': colors.primary[800],
    'primary-subtle': colors.primary[50],
    'primary-fg-subtle': colors.primary[600],

    'success-bg': colors.success[500],
    'success-fg': colors.white,
    'success-subtle': colors.success[50],

    'warning-bg': colors.warning[500],
    'warning-fg': colors.white,
    'warning-subtle': colors.warning[50],

    'error-bg': colors.error[500],
    'error-fg': colors.white,
    'error-subtle': colors.error[50],

    'info-bg': colors.info[500],
    'info-fg': colors.white,
    'info-subtle': colors.info[50],
  },
  shadows,
  radii,
  spacing,
  typography,
  motion,
} as const

export type SemanticTheme = typeof lightTheme
