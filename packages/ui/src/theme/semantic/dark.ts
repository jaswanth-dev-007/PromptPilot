import { colors, typography, spacing, radii, shadows, motion } from '../tokens'

export const darkTheme = {
  colors: {
    bg: colors.neutral[950],
    'bg-muted': colors.neutral[900],
    'bg-subtle': colors.neutral[800],
    'bg-hover': colors.neutral[800],
    'bg-pressed': colors.neutral[700],

    fg: colors.neutral[50],
    'fg-muted': colors.neutral[400],
    'fg-subtle': colors.neutral[500],
    'fg-on-emphasis': colors.white,

    border: colors.neutral[800],
    'border-muted': colors.neutral[800],
    'border-hover': colors.neutral[700],

    'primary-bg': colors.primary[500],
    'primary-fg': colors.white,
    'primary-hover': colors.primary[400],
    'primary-pressed': colors.primary[300],
    'primary-subtle': colors.primary[950],
    'primary-fg-subtle': colors.primary[300],

    'success-bg': colors.success[500],
    'success-fg': colors.white,
    'success-subtle': '#022C22',

    'warning-bg': colors.warning[500],
    'warning-fg': colors.white,
    'warning-subtle': '#2C1B00',

    'error-bg': colors.error[500],
    'error-fg': colors.white,
    'error-subtle': '#2C0004',

    'info-bg': colors.info[500],
    'info-fg': colors.white,
    'info-subtle': '#001E2E',
  },
  shadows: {
    ...shadows,
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6)',
  },
  radii,
  spacing,
  typography,
  motion,
} as const
