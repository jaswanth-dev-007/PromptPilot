'use client'

import React, { useState } from 'react'

export interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const handleClick = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          gap: '0',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            onClick={() => handleClick(tab.id)}
            style={{
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: tab.id === active ? 600 : 400,
              color: tab.id === active ? '#4F46E5' : '#64748B',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: tab.id === active ? '2px solid #4F46E5' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ padding: '16px 0' }}>
        {activeTab?.content}
      </div>
    </div>
  )
}
