import React, { type ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void; href?: string }
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  size = 'md',
}: EmptyStateProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '24px', maxWidth: '320px' },
    md: { padding: '48px 24px', maxWidth: '400px' },
    lg: { padding: '64px 24px', maxWidth: '480px' },
  }

  const s = sizeStyles[size]

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'inherit',
        margin: '0 auto',
        ...s,
      }}
    >
      <div style={{ fontSize: size === 'sm' ? '2rem' : '3rem', marginBottom: '16px' }}>{icon}</div>
      <h3
        style={{
          fontSize: size === 'sm' ? '1rem' : '1.125rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: '0 0 20px 0',
            maxWidth: '320px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
      {action &&
        (action.href ? (
          <a
            href={action.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {action.label}
          </button>
        ))}
    </div>
  )
}
