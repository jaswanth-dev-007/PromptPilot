'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  duration?: number
  dismissible?: boolean
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => setToasts([]), [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const TYPE_STYLES: Record<string, React.CSSProperties> = {
  success: { borderLeft: '4px solid #10B981', backgroundColor: '#ECFDF5' },
  error: { borderLeft: '4px solid #EF4444', backgroundColor: '#FEF2F2' },
  warning: { borderLeft: '4px solid #F59E0B', backgroundColor: '#FFFBEB' },
  info: { borderLeft: '4px solid #0EA5E9', backgroundColor: '#F0F9FF' },
}

const TYPE_ICONS: Record<string, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1800,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
        fontFamily: 'inherit',
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (!toast.duration) return
    const t = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(t)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: '0.875rem',
        color: '#111827',
        fontFamily: 'inherit',
        ...TYPE_STYLES[toast.type],
      }}
    >
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{TYPE_ICONS[toast.type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{toast.title}</div>
        {toast.description && (
          <div style={{ color: '#6B7280', marginTop: '2px' }}>{toast.description}</div>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#FFFFFF',
              color: '#4F46E5',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      {toast.dismissible !== false && (
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            color: '#9CA3AF',
            padding: '0',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
