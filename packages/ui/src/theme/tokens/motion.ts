export const motion = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400,
    gentle: 600,
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    linear: 'linear',
  },

  spring: {
    default: { type: 'spring' as const, stiffness: 300, damping: 30 },
    gentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
    bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
  },
} as const
