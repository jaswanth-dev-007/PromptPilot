import React from 'react'

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
  style?: React.CSSProperties
}

export function Skeleton({ variant = 'text', width, height, count = 1, style }: SkeletonProps) {
  const defaultDims: Record<string, { width: string; height: string }> = {
    text: { width: width ? String(width) : '100%', height: height ? String(height) : '16px' },
    circular: { width: width ? String(width) : '40px', height: height ? String(height) : '40px' },
    rectangular: {
      width: width ? String(width) : '100%',
      height: height ? String(height) : '100px',
    },
  }

  const dims = defaultDims[variant]

  const baseStyle: React.CSSProperties = {
    display: 'block',
    width: dims.width,
    height: dims.height,
    backgroundColor: '#F1F5F9',
    borderRadius: variant === 'circular' ? '50%' : '6px',
    animation: 'promptpilot-shimmer 2s ease-in-out infinite',
    backgroundImage: 'linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)',
    backgroundSize: '200% 100%',
    marginBottom: '8px',
    fontFamily: 'inherit',
    ...style,
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={baseStyle} aria-hidden="true" />
      ))}
    </>
  )
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        fontFamily: 'inherit',
      }}
    >
      <Skeleton variant="text" width="60%" height="22px" />
      <Skeleton variant="text" width="40%" height="14px" />
      <div style={{ marginTop: '16px' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${85 - i * 10}%`} height="12px" />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ fontFamily: 'inherit' }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" width={`${Math.floor(80 / cols)}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  )
}
