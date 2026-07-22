import React from 'react'

export interface CheckboxProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
}

export function Checkbox({ label, checked = false, onChange, disabled = false, id }: CheckboxProps) {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <label
      htmlFor={checkboxId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        color: '#111827',
      }}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        style={{
          width: '16px',
          height: '16px',
          accentColor: '#4F46E5',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      {label}
    </label>
  )
}
