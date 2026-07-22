'use client'

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { NavSection, NavItem } from '@/lib/navigation/routes'
import { appNavigation, bottomNavigation } from '@/lib/navigation/routes'

interface NavigationContextValue {
  activeWorkspace: string | null
  activeProject: string | null
  setActiveWorkspace: (slug: string | null) => void
  setActiveProject: (slug: string | null) => void
  sidebarSections: NavSection[]
  sidebarBottom: NavItem[]
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter sidebar sections based on current workspace/project context
  const sidebarSections = appNavigation.map(section => {
    // If section has workspace-scoped items, only show when a workspace is active
    const allWorkspaceScoped = section.items.every(i => i.workspaceScoped)
    const allProjectScoped = section.items.every(i => i.projectScoped)

    if (allWorkspaceScoped && !activeWorkspace) return { ...section, items: [] }
    if (allProjectScoped && !activeProject) return { ...section, items: [] }

    // Replace [slug] placeholders with actual values
    const items = section.items.map(item => ({
      ...item,
      href: item.href
        .replace('[slug]', activeWorkspace || '')
        .replace('[slug]', activeProject || ''),
    }))

    return { ...section, items }
  })

  return (
    <NavigationContext.Provider
      value={{
        activeWorkspace,
        activeProject,
        setActiveWorkspace: useCallback((slug: string | null) => setActiveWorkspace(slug), []),
        setActiveProject: useCallback((slug: string | null) => setActiveProject(slug), []),
        sidebarSections,
        sidebarBottom: bottomNavigation,
        commandPaletteOpen,
        setCommandPaletteOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
