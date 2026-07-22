import React from 'react'

export interface ErrorFallbackProps {
  title?: string
  message?: string
  code?: string | number
  retry?: () => void
  retryLabel?: string
  variant?: 'full' | 'inline' | 'card'
}

export function ErrorFallback({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  code,
  retry,
  retryLabel = 'Try again',
  variant = 'card',
}: ErrorFallbackProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    full: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 24px',
    },
    inline: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#FEF2F2',
      borderRadius: '10px',
      border: '1px solid #FECACA',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px',
      backgroundColor: '#FEF2F2',
      borderRadius: '12px',
      border: '1px solid #FECACA',
      maxWidth: '480px',
      margin: '24px auto',
    },
  }

  const isInline = variant === 'inline'

  return (
    <div
      role="alert"
      style={{
        fontFamily: 'inherit',
        textAlign: isInline ? 'left' : 'center',
        ...variantStyles[variant],
      }}
    >
      <div
        style={{
          fontSize: isInline ? '1.25rem' : '2.5rem',
          marginBottom: isInline ? 0 : '16px',
          flexShrink: 0,
        }}
      >
        ⚠️
      </div>
      <div>
        <div
          style={{
            fontSize: isInline ? '0.875rem' : '1.125rem',
            fontWeight: 600,
            color: '#991B1B',
            marginBottom: '4px',
          }}
        >
          {title}
          {code && (
            <span style={{ fontWeight: 400, color: '#EF4444', marginLeft: '8px' }}>{code}</span>
          )}
        </div>
        <p
          style={{ fontSize: '0.875rem', color: '#B91C1C', margin: '0 0 16px 0', lineHeight: 1.6 }}
        >
          {message}
        </p>
        {retry && (
          <button
            onClick={retry}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
