'use client'

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface LayoutContextValue {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  toggleCollapse: () => void
  setSidebarOpen: (open: boolean) => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), [])
  const toggleCollapse = useCallback(() => setSidebarCollapsed(v => !v), [])

  return (
    <LayoutContext.Provider
      value={{ sidebarOpen, sidebarCollapsed, toggleSidebar, toggleCollapse, setSidebarOpen }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider')
  return ctx
}
