'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface DropdownMenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, children, align = 'left' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', fontFamily: 'inherit' }}>
      <span onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        {trigger}
      </span>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            [align]: 0,
            marginTop: '4px',
            minWidth: '180px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
            padding: '4px',
            zIndex: 1000,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
}

export function DropdownItem({ children, onClick, danger = false }: DropdownItemProps) {
  return (
    <button
      role="menuitem"
      onClick={() => onClick?.()}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        fontSize: '0.875rem',
        color: danger ? '#EF4444' : '#111827',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: 400,
      }}
      onMouseEnter={e => {
        (e.target as HTMLElement).style.backgroundColor = '#F1F5F9'
      }}
      onMouseLeave={e => {
        (e.target as HTMLElement).style.backgroundColor = 'transparent'
      }}
    >
      {children}
    </button>
  )
}
