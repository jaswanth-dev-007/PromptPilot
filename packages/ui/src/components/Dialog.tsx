import React from 'react'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1400,
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)',
          padding: '24px',
          width: '90%',
          maxWidth: '512px',
          maxHeight: '85vh',
          overflow: 'auto',
          zIndex: 1401,
          fontFamily: 'inherit',
        }}
      >
        {title && (
          <h2
            id="dialog-title"
            style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id="dialog-desc"
            style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 16px 0' }}
          >
            {description}
          </p>
        )}
        <div>{children}</div>
        {footer && (
          <div
            style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            {footer}
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#9CA3AF',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          ✕
        </button>
      </div>
    </>
  )
}
