import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  style: externalStyle,
  onClick,
}: ButtonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#4f46e5',
      color: '#ffffff',
      border: '1px solid transparent',
    },
    secondary: {
      backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
      color: disabled ? '#9ca3af' : '#374151',
      border: '1px solid transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#4f46e5',
      border: disabled ? '1px solid #e5e7eb' : '1px solid #4f46e5',
    },
    danger: {
      backgroundColor: disabled ? '#fca5a5' : '#ef4444',
      color: '#ffffff',
      border: '1px solid transparent',
    },
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '0.8125rem' },
    md: { padding: '8px 18px', fontSize: '0.875rem' },
    lg: { padding: '10px 24px', fontSize: '1rem' },
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'opacity 0.15s, box-shadow 0.15s',
    border: '1px solid transparent',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...externalStyle,
  }

  return (
    <button type={type} style={baseStyle} disabled={disabled || loading} onClick={onClick}>
      {loading && <span aria-hidden="true">⏳</span>}
      {children}
    </button>
  )
}
