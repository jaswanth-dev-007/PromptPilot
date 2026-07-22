import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'error'
  indeterminate?: boolean
}

const SIZE_HEIGHTS: Record<string, string> = { sm: '4px', md: '8px', lg: '12px' }
const VARIANT_COLORS: Record<string, string> = {
  primary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
  indeterminate = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = VARIANT_COLORS[variant]

  return (
    <div style={{ width: '100%', fontFamily: 'inherit' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '0.8125rem',
            color: '#6B7280',
            fontWeight: 500,
          }}
        >
          {label && <span>{label}</span>}
          {showPercentage && <span>{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        style={{
          width: '100%',
          height: SIZE_HEIGHTS[size],
          backgroundColor: '#F1F5F9',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        {indeterminate ? (
          <div
            style={{
              height: '100%',
              width: '40%',
              backgroundColor: color,
              borderRadius: '999px',
              animation: 'promptpilot-indeterminate 1.5s ease-in-out infinite',
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              backgroundColor: color,
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        )}
      </div>
    </div>
  )
}
