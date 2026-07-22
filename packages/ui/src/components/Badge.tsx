import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' },
  primary: { backgroundColor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' },
  success: { backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' },
  warning: { backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' },
  error: { backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' },
  info: { backgroundColor: '#F0F9FF', color: '#075985', border: '1px solid #BAE6FD' },
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '1px 6px', fontSize: '0.6875rem', borderRadius: '4px' },
    md: { padding: '2px 10px', fontSize: '0.75rem', borderRadius: '6px' },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 600,
        lineHeight: 1.4,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  )
}
