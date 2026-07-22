'use client'

import React, { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

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
    <div ref={ref} style={{ marginBottom: '16px', fontFamily: 'inherit', position: 'relative' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: '100%',
          padding: '8px 14px',
          borderRadius: '8px',
          border: error ? '1.5px solid #EF4444' : '1.5px solid #D1D5DB',
          backgroundColor: disabled ? '#F9FAFB' : '#FFFFFF',
          color: selected ? '#111827' : '#9CA3AF',
          fontSize: '0.875rem',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'inherit',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ fontSize: '0.625rem', color: '#9CA3AF' }}>▼</span>
      </button>
      {error && <p style={{ marginTop: '4px', fontSize: '0.8125rem', color: '#EF4444' }}>{error}</p>}
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
            zIndex: 1000,
            maxHeight: '240px',
            overflow: 'auto',
            margin: '4px 0 0 0',
            padding: '4px',
            listStyle: 'none',
          }}
        >
          {options.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange?.(option.value)
                setOpen(false)
              }}
              style={{
                padding: '8px 12px',
                fontSize: '0.875rem',
                color: '#111827',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: option.value === value ? '#EEF2FF' : 'transparent',
                fontWeight: option.value === value ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (option.value !== value) {
                  (e.target as HTMLElement).style.backgroundColor = '#F1F5F9'
                }
              }}
              onMouseLeave={e => {
                if (option.value !== value) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
