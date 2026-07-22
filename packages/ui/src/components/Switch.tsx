import React from 'react'

export interface SwitchProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export function Switch({ label, checked = false, onChange, disabled = false }: SwitchProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        color: '#111827',
      }}
    >
      <span
        onClick={e => {
          e.preventDefault()
          if (!disabled) onChange?.(!checked)
        }}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!disabled) onChange?.(!checked)
          }
        }}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '40px',
          height: '22px',
          borderRadius: '999px',
          backgroundColor: checked ? '#4F46E5' : '#CBD5E1',
          transition: 'background-color 0.2s',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '20px' : '2px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transition: 'left 0.2s',
          }}
        />
      </span>
      {label}
    </label>
  )
}
