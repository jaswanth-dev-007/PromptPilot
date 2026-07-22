'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { lightTheme, darkTheme } from '../theme'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  mode: ThemeMode
  theme: typeof lightTheme | typeof darkTheme
  resolved: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children, defaultMode = 'system' }: { children: ReactNode; defaultMode?: ThemeMode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('promptpilot-theme') as ThemeMode | null
      if (stored) return stored
    }
    return defaultMode
  })

  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveMode(mode))

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem('promptpilot-theme', newMode)
    setResolved(resolveMode(newMode))
  }, [])

  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setMode])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    const theme = resolved === 'dark' ? darkTheme : lightTheme
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--color-${key}`, value as string)
    }
  }, [resolved])

  useEffect(() => {
    if (mode !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolved(resolveMode('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const theme = resolved === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode, theme, resolved, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
