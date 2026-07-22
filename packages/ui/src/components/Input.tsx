import React, { forwardRef } from 'react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, size = 'md', id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '6px 10px', fontSize: '0.8125rem' },
      md: { padding: '8px 14px', fontSize: '0.875rem' },
      lg: { padding: '10px 18px', fontSize: '1rem' },
    }

    const baseStyle: React.CSSProperties = {
      display: 'block',
      width: '100%',
      borderRadius: '8px',
      border: error ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
      backgroundColor: '#ffffff',
      color: '#111827',
      outline: 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      lineHeight: 1.5,
      ...sizeStyles[size],
    }

    return (
      <div style={{ marginBottom: '16px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={className}
          style={baseStyle}
          {...props}
          onFocus={e => {
            e.currentTarget.style.borderColor = error ? '#ef4444' : '#4f46e5'
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px rgba(239,68,68,0.1)'
              : '0 0 0 3px rgba(79,70,229,0.1)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? '#ef4444' : '#d1d5db'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {error && (
          <p style={{ marginTop: '4px', fontSize: '0.8125rem', color: '#ef4444' }}>{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
