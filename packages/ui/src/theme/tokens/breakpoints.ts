export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const screens = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  'max-sm': `@media (max-width: ${+breakpoints.sm.replace('px', '') - 1}px)`,
  'max-md': `@media (max-width: ${+breakpoints.md.replace('px', '') - 1}px)`,
  'max-lg': `@media (max-width: ${+breakpoints.lg.replace('px', '') - 1}px)`,
} as const

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
