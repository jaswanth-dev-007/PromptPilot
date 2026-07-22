'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

interface Command {
  id: string
  label: string
  category: string
  shortcut?: string
  keywords?: string[]
  action: () => void
}

interface CommandPaletteProps {
  commands: Command[]
  open: boolean
  onClose: () => void
}

export function CommandPalette({ commands, open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = commands.filter(c => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      c.label.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.keywords?.some(k => k.toLowerCase().includes(q))
    )
  })

  const grouped: Record<string, Command[]> = {}
  for (const c of filtered) {
    if (!grouped[c.category]) grouped[c.category] = []
    grouped[c.category].push(c)
  }

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const execute = useCallback(
    (cmd: Command) => {
      cmd.action()
      onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        execute(filtered[selectedIndex])
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIndex, execute, onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  let index = -1

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1500,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette. Type to search."
        style={{
          position: 'fixed',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          zIndex: 1501,
          overflow: 'hidden',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#111827',
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
        </div>
        <div style={{ maxHeight: '360px', overflow: 'auto', padding: '8px' }}>
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category} style={{ marginBottom: '4px' }}>
              <div
                style={{
                  padding: '6px 12px 2px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {category}
              </div>
              {cmds.map(cmd => {
                index++
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#111827',
                      backgroundColor: isSelected ? '#EEF2FF' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{cmd.shortcut}</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: '#9CA3AF',
                fontSize: '0.875rem',
              }}
            >
              No results found
            </div>
          )}
        </div>
      </div>
    </>
  )
}
