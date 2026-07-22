'use client'

import React, { useState } from 'react'
import { Input, type InputProps } from './Input'

export function PasswordField(props: Omit<InputProps, 'type'>) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '10px',
          top: props.label ? '34px' : '10px',
          background: 'none',
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '4px',
          color: '#6b7280',
        }}
      >
        {visible ? '🙈' : '👁️'}
      </button>
    </div>
  )
}
