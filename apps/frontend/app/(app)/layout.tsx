'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { LayoutProvider } from '@/components/LayoutContext'
import { NavigationProvider } from '@/components/NavigationContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/components/feedback/ToastProvider'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Navbar } from '@/components/nav/Navbar'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { CommandPalette } from '@/components/nav/CommandPalette'
import { useNavigation } from '@/components/NavigationContext'

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { sidebarSections, sidebarBottom, commandPaletteOpen, setCommandPaletteOpen } =
    useNavigation()

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    ...pathSegments.slice(1).map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: '/' + pathSegments.slice(0, i + 2).join('/'),
    })),
  ]

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#F8FAFC',
      }}
    >
      <Sidebar items={sidebarSections.flatMap(s => s.items)} bottomItems={sidebarBottom} logo />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar
          left={<Breadcrumbs items={breadcrumbs} />}
          right={
            <button
              onClick={() => setCommandPaletteOpen(true)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                fontSize: '0.8125rem',
                color: '#64748B',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontWeight: 600 }}>⌘K</span> Search
            </button>
          }
        />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '32px',
          }}
        >
          {children}
        </main>
      </div>
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={[
          {
            id: 'nav-dashboard',
            label: 'Dashboard',
            category: 'Navigation',
            shortcut: 'G D',
            action: () => (window.location.href = '/dashboard'),
          },
          {
            id: 'nav-workspaces',
            label: 'Workspaces',
            category: 'Navigation',
            shortcut: 'G W',
            action: () => (window.location.href = '/workspaces'),
          },
          {
            id: 'nav-projects',
            label: 'Projects',
            category: 'Navigation',
            shortcut: 'G P',
            action: () => (window.location.href = '/projects'),
          },
          {
            id: 'nav-templates',
            label: 'Prompt Templates',
            category: 'AI',
            action: () => (window.location.href = '/templates'),
          },
          {
            id: 'nav-settings',
            label: 'Settings',
            category: 'Navigation',
            shortcut: 'G S',
            action: () => (window.location.href = '/settings'),
          },
        ]}
      />
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <LayoutProvider>
          <NavigationProvider>
            <AppShell>{children}</AppShell>
          </NavigationProvider>
        </LayoutProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
