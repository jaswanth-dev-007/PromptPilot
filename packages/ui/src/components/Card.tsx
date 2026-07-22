import React, { type ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function Card({ children, padding = 'md', shadow = 'sm', style }: CardProps) {
  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: '0' },
    sm: { padding: '12px' },
    md: { padding: '20px' },
    lg: { padding: '32px' },
  }

  const shadowStyles: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: shadowStyles[shadow],
        fontFamily: 'inherit',
        ...paddingStyles[padding],
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: '16px', fontFamily: 'inherit', ...style }}>
      {children}
    </div>
  )
}

export function CardTitle({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'inherit', ...style }}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '4px 0 0 0', fontFamily: 'inherit', ...style }}>
      {children}
    </p>
  )
}

export function CardContent({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontFamily: 'inherit', ...style }}>{children}</div>
}

export function CardFooter({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
