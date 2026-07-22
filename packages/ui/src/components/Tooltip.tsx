import React, { type ReactNode } from 'react'

export interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = React.useState(false)

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
  }

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '-4px', left: '50%', marginLeft: '-4px', borderTop: '4px solid #1E293B', borderLeft: '4px solid transparent', borderRight: '4px solid transparent' },
    bottom: { top: '-4px', left: '50%', marginLeft: '-4px', borderBottom: '4px solid #1E293B', borderLeft: '4px solid transparent', borderRight: '4px solid transparent' },
    left: { right: '-4px', top: '50%', marginTop: '-4px', borderLeft: '4px solid #1E293B', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' },
    right: { left: '-4px', top: '50%', marginTop: '-4px', borderRight: '4px solid #1E293B', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' },
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
            fontSize: '0.75rem',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            zIndex: 1700,
            pointerEvents: 'none',
            fontFamily: 'inherit',
            ...positionStyles[position],
          }}
        >
          {content}
          <span
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              ...arrowStyles[position],
            }}
          />
        </span>
      )}
    </span>
  )
}
