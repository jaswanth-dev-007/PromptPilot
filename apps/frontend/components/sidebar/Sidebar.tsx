'use client'

import React, { type ReactNode } from 'react'
import { useLayout } from './LayoutContext'

interface NavItem {
  label: string
  href: string
  icon?: ReactNode
  children?: NavItem[]
}

interface SidebarProps {
  items: NavItem[]
  bottomItems?: NavItem[]
  logo?: ReactNode
}

const NAV: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#FFFFFF',
  borderRight: '1px solid #E2E8F0',
  fontFamily: 'inherit',
  transition: 'width 0.2s',
  overflow: 'hidden',
}

const ITEM_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 14px',
  margin: '2px 8px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#475569',
  textDecoration: 'none',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  fontFamily: 'inherit',
  width: 'calc(100% - 16px)',
  textAlign: 'left',
  transition: 'background-color 0.15s, color 0.15s',
  whiteSpace: 'nowrap',
}

export function Sidebar({ items, bottomItems, logo }: SidebarProps) {
  const { sidebarCollapsed, toggleCollapse } = useLayout()
  const width = sidebarCollapsed ? '64px' : '240px'

  return (
    <aside style={{ ...NAV, width }}>
      {logo && (
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {sidebarCollapsed ? 'PP' : 'PromptPilot'}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#9CA3AF', padding: '2px 6px' }}
            >
              ⟪
            </button>
          )}
        </div>
      )}

      <nav style={{ flex: 1, overflow: 'auto', padding: '8px 0' }} aria-label="Main navigation">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            style={ITEM_BASE}
            onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = '#F1F5F9' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0, width: '20px', textAlign: 'center' }}>{item.icon || '○'}</span>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {bottomItems && (
        <div style={{ borderTop: '1px solid #F1F5F9', padding: '8px 0' }}>
          {bottomItems.map(item => (
            <a key={item.href} href={item.href} style={ITEM_BASE} title={sidebarCollapsed ? item.label : undefined}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0, width: '20px', textAlign: 'center' }}>{item.icon || '○'}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}
