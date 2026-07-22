'use client'

import React, { type ReactNode } from 'react'
import { useLayout } from '../LayoutContext'

interface NavbarProps {
  left?: ReactNode
  right?: ReactNode
  mobileSidebarToggle?: boolean
}

const BAR: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '56px',
  padding: '0 20px',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E2E8F0',
  fontFamily: 'inherit',
}

export function Navbar({ left, right, mobileSidebarToggle = true }: NavbarProps) {
  const { toggleSidebar } = useLayout()

  return (
    <header style={BAR}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {mobileSidebarToggle && (
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
            }}
            className="nav-mobile-toggle"
          >
            ☰
          </button>
        )}
        {left}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{right}</div>
    </header>
  )
}
