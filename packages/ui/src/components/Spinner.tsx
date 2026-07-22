import React from 'react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const sizes: Record<string, { width: string; height: string; border: string }> = {
  sm: { width: '16px', height: '16px', border: '2px' },
  md: { width: '24px', height: '24px', border: '3px' },
  lg: { width: '36px', height: '36px', border: '4px' },
}

export function Spinner({ size = 'md', color = '#4F46E5' }: SpinnerProps) {
  const s = sizes[size]
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: s.width,
        height: s.height,
        border: `${s.border} solid #E2E8F0`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'promptpilot-spin 0.6s linear infinite',
      }}
    />
  )
}
