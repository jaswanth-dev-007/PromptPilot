export interface NavSection {
  id: string
  label?: string
  items: NavItem[]
}

export interface NavItem {
  label: string
  href: string
  icon: string
  shortcut?: string
  children?: NavItem[]
  badge?: string | number
  workspaceScoped?: boolean
  projectScoped?: boolean
}

// ── Application Navigation ────────────────────────────────────────────────────

export const appNavigation: NavSection[] = [
  {
    id: 'main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊', shortcut: 'G D' },
      { label: 'Workspaces', href: '/workspaces', icon: '🏢', shortcut: 'G W' },
      { label: 'Projects', href: '/projects', icon: '📁', shortcut: 'G P' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { label: 'Overview', href: '/workspace/[slug]', icon: '🏠', workspaceScoped: true },
      { label: 'Projects', href: '/workspace/[slug]/projects', icon: '📁', workspaceScoped: true },
      { label: 'Members', href: '/workspace/[slug]/members', icon: '👥', workspaceScoped: true },
      { label: 'Settings', href: '/workspace/[slug]/settings', icon: '⚙️', workspaceScoped: true },
    ],
  },
  {
    id: 'project',
    label: 'Project',
    items: [
      { label: 'Overview', href: '/project/[slug]', icon: '📋', projectScoped: true },
      { label: 'Documents', href: '/project/[slug]/documents', icon: '📄', projectScoped: true },
      {
        label: 'AI Conversations',
        href: '/project/[slug]/conversations',
        icon: '🤖',
        projectScoped: true,
      },
      { label: 'Exports', href: '/project/[slug]/exports', icon: '📦', projectScoped: true },
      { label: 'Settings', href: '/project/[slug]/settings', icon: '⚙️', projectScoped: true },
    ],
  },
  {
    id: 'ai',
    label: 'AI Workspace',
    items: [
      { label: 'Prompt Templates', href: '/templates', icon: '📝' },
      { label: 'AI Conversations', href: '/conversations', icon: '💬' },
      { label: 'Generation History', href: '/generations', icon: '📜' },
    ],
  },
]

export const bottomNavigation: NavSection['items'] = [
  { label: 'Activity', href: '/activity', icon: '🔔', shortcut: 'G A' },
  { label: 'Settings', href: '/settings', icon: '⚙️', shortcut: 'G S' },
  { label: 'Help', href: '/help', icon: '❓' },
]

// ── Public Navigation ─────────────────────────────────────────────────────────

export const publicNavigation: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Features', href: '/#features', icon: '✨' },
  { label: 'Pricing', href: '/#pricing', icon: '💎' },
  { label: 'Docs', href: '/docs', icon: '📚' },
]

// ── Auth Navigation ────────────────────────────────────────────────────────────

export const authNavigation: NavItem[] = [
  { label: 'Sign In', href: '/login', icon: '🔑' },
  { label: 'Create Account', href: '/register', icon: '✨' },
]
