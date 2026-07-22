# PromptPilot — Enterprise Dashboard Specification

## Complete UX, UI, Engineering & Architecture Design

### Version 1.0 — Production-Ready Build Document

---

## Design System Reference

All components reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`), Tailwind token config (`tailwind.config.js`), and the UX Specification (`docs/PRODUCT_UX_SPECIFICATION.md`).

**Existing foundation (already built):**

| Component                                                                                       | Status   | Location                                     |
| ----------------------------------------------------------------------------------------------- | -------- | -------------------------------------------- |
| App Shell (Sidebar + Navbar + Breadcrumbs + ⌘K)                                                 | ✅ Built | `apps/frontend/app/(app)/layout.tsx`         |
| Dashboard page (WelcomeHero, QuickActions, RecentProjects, Stats, AIActivity, Favorites, Tasks) | ✅ Built | `apps/frontend/app/(app)/dashboard/page.tsx` |
| Sidebar (collapsible, context-aware navigation)                                                 | ✅ Built | `components/sidebar/Sidebar.tsx`             |
| Navbar (left/right slots, mobile toggle)                                                        | ✅ Built | `components/nav/Navbar.tsx`                  |
| Breadcrumbs (dynamic path generation)                                                           | ✅ Built | `components/nav/Breadcrumbs.tsx`             |
| CommandPalette (⌘K search, categories, keyboard nav)                                            | ✅ Built | `components/nav/CommandPalette.tsx`          |
| NavigationContext (workspace/project context, sidebar sections, search state)                   | ✅ Built | `components/NavigationContext.tsx`           |
| LayoutContext (sidebar open/collapsed state, toggle)                                            | ✅ Built | `components/LayoutContext.tsx`               |
| Navigation routes (app + bottom + public + auth)                                                | ✅ Built | `lib/navigation/routes.ts`                   |
| EmptyState (icon, title, description, action)                                                   | ✅ Built | `components/feedback/EmptyState.tsx`         |
| Skeleton (text/circular/rectangular, CardSkeleton, TableSkeleton)                               | ✅ Built | `components/feedback/Skeleton.tsx`           |
| ToastProvider (success/error/warning/info, auto-dismiss, action)                                | ✅ Built | `components/feedback/ToastProvider.tsx`      |
| Dashboard API (GET /dashboard/stats)                                                            | ✅ Built | `apps/api/src/routes/dashboard.ts`           |
| UI Components (Card, Button, Input, Badge, etc.)                                                | ✅ Built | `packages/ui/`                               |

**Design tokens (existing Tailwind config):**

- Typography: Inter (headings/body), JetBrains Mono (code)
- Primary: Indigo-600 (#4F46E5), Neutral: Slate 50–950
- Spacing: 4px base unit, Radii: sm/md/lg/xl
- Shadows: sm/md/lg/xl elevation + glow-primary
- Motion: 150ms fast, 250ms normal, 400ms slow, Framer Motion spring
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px

---

## 1. Purpose

### Business Objective

The Dashboard is the user's command center — the first screen after authentication and the primary surface for navigation, awareness, and action initiation. Its business objectives are:

1. **Maximize time-to-value**: Surface relevant information immediately so users resume work within 3 seconds of landing
2. **Drive feature adoption**: Expose AI tools, pipeline steps, and collaboration features through contextual suggestions and quick actions
3. **Reduce churn**: Show progress, activity, and value generated — reinforcing the platform's ROI
4. **Support upgrade conversion**: Surface usage metrics and quota indicators that naturally lead to plan upgrades
5. **Enable efficient navigation**: Minimize clicks to reach any workspace, project, or document — targeting <2 clicks from dashboard to any destination

### User Objective

Users arrive at the dashboard to:

1. **Resume work**: Jump back into the last project or conversation they were working on
2. **Create new work**: Start a new project, generate a PRD, or begin an AI conversation
3. **Monitor activity**: See what's happened since last visit — AI generations completed, team activity, notifications
4. **Assess status**: Understand project health, document staleness, and pipeline completion
5. **Navigate efficiently**: Reach any workspace, project, document, or tool in minimum clicks

### Primary Use Cases

| Use Case                     | Persona                | Dashboard Widget                               |
| ---------------------------- | ---------------------- | ---------------------------------------------- |
| Resume last project          | Developer, PM, Founder | Continue Working, Recent Projects              |
| Start new specification      | PM, Founder            | Quick Actions: New Project, Generate PRD       |
| Check AI generation status   | Developer, PM          | AI Activity Feed, Notifications                |
| Review team activity         | Team Lead, Admin       | Activity Timeline, Workspace Overview          |
| Navigate to specific project | Power user             | Global Search (⌘K), Recent Projects, Favorites |
| Monitor usage and costs      | Admin, Pro user        | Usage Analytics, AI Credits widget             |
| Handle invitations           | New team member        | Notifications, Pending Invitations             |
| Explore templates            | New user               | AI Recommendations, Template Suggestions       |

### Success Metrics

```
Primary:
  - Time-to-action: <3 seconds from page load to first click on a project/action
  - Dashboard return rate: % of sessions that start at dashboard (should be >70%)
  - Click-through rate: % of dashboard visits that result in navigation to a project/workspace

Secondary:
  - Quick Action usage: % of new projects created via dashboard Quick Actions
  - AI feature discovery: % of users who click "AI Chat" or "Generate PRD" from dashboard within first week
  - Notification engagement: % of notifications clicked from dashboard
  - Search usage: % of sessions using ⌘K / global search
```

---

## 2. Information Architecture

### Complete Hierarchy

```
Dashboard Page
│
├── App Shell (layout.tsx)
│   ├── Sidebar (left, 240px expanded / 64px collapsed, h-full)
│   │   ├── Logo + Collapse Toggle
│   │   ├── Main Navigation
│   │   │   ├── 🏠 Dashboard
│   │   │   ├── 🏢 Workspaces
│   │   │   └── 📁 Projects
│   │   ├── Context Navigation (conditional)
│   │   │   ├── Workspace Section (visible when workspace active)
│   │   │   │   ├── Overview
│   │   │   │   ├── Projects
│   │   │   │   ├── Members
│   │   │   │   └── Settings
│   │   │   └── Project Section (visible when project active)
│   │   │       ├── Overview
│   │   │       ├── Documents
│   │   │       ├── AI Conversations
│   │   │       ├── Exports
│   │   │       └── Settings
│   │   ├── AI Workspace
│   │   │   ├── 📝 Prompt Templates
│   │   │   ├── 💬 AI Conversations
│   │   │   └── 📜 Generation History
│   │   └── Bottom Navigation
│   │       ├── 🔔 Activity
│   │       ├── ⚙️ Settings
│   │       └── ❓ Help
│   │
│   ├── Navbar (top, 56px, sticky, bg-white, border-b)
│   │   ├── Left
│   │   │   ├── Mobile Sidebar Toggle (hidden on desktop)
│   │   │   └── Breadcrumbs (🏠 > Dashboard)
│   │   ├── Right
│   │   │   ├── Global Search Trigger (⌘K badge)
│   │   │   ├── Notifications Bell (with unread badge)
│   │   │   ├── Theme Toggle (☀️/🌙)
│   │   │   ├── Help Menu (?)
│   │   │   └── User Profile Menu (avatar + name ▾)
│   │
│   └── CommandPalette (⌘K overlay, modal)
│       ├── Search Input
│       ├── Command Categories
│       │   ├── Navigation (G D, G W, G P, G S...)
│       │   ├── AI (Prompt Templates, AI Chat...)
│       │   ├── Actions (New Project, New Workspace...)
│       │   └── Recent (last 5 actions)
│       └── No Results State
│
├── Dashboard Content (main area, overflow-y-auto, p-8)
│   ├── Welcome Hero (gradient banner, full-width)
│   │   ├── Personalized Greeting + Time-of-day
│   │   ├── Quick Context (last workspace / project)
│   │   └── Primary CTAs: New Project, Open Workspace
│   │
│   ├── Quick Actions Grid (6 items, auto-fit grid)
│   │   ├── Generate PRD
│   │   ├── Generate SRS
│   │   ├── Architecture Design
│   │   ├── Database Schema
│   │   ├── New Document
│   │   └── More Actions (opens ⌘K)
│   │
│   ├── Main Content Grid (2-column on desktop, 1-column below)
│   │   ├── Left Column (2/3 width)
│   │   │   ├── Continue Working (carousel of recently accessed items)
│   │   │   ├── Recent Projects (list/cards with status)
│   │   │   └── AI Activity Feed (timeline of generations)
│   │   │
│   │   └── Right Column (1/3 width)
│   │       ├── Workspace Summary (stat boxes)
│   │       ├── AI Recommendations (contextual suggestions)
│   │       ├── Favorites (starred items)
│   │       └── Usage Overview (mini analytics)
│   │
│   ├── Tasks Section (full-width, optional)
│   │   ├── Task Input + Add Button
│   │   └── Task List (checkbox + label + delete)
│   │
│   └── Notifications Panel (right drawer or inline section)
│       ├── Notification List (grouped by date)
│       │   ├── System Notifications
│       │   ├── AI Generation Complete
│       │   ├── Workspace Invitations
│       │   └── Activity Alerts
│       └── Mark All Read / View All
│
└── Toast Container (fixed, bottom-right, z-1800)
```

### Section Rationale — Why Each Exists

| Section                | Rationale                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Welcome Hero**       | Reduces cognitive load by personalizing the experience. Shows users they're in the right place. Drives primary action (new project). |
| **Quick Actions**      | Reduces friction for common tasks. Eliminates "where do I start?" confusion. Single-click to high-value actions.                     |
| **Continue Working**   | Optimizes for the most common use case: resuming existing work. Reduces time-to-action to near-zero.                                 |
| **Recent Projects**    | Provides spatial memory — users recognize their projects by name and status. Primary navigation surface for returning users.         |
| **AI Activity Feed**   | Builds trust by showing AI work product. Surfaces generation status. Creates awareness of pipeline progress.                         |
| **Workspace Summary**  | Gives at-a-glance metrics. Answers "how much have I done?" — reinforcing value.                                                      |
| **AI Recommendations** | Drives feature discovery. Suggests next actions based on context. Personalizes the experience.                                       |
| **Favorites**          | User-curated quick-access. Respects user preferences. Improves navigation efficiency for power users.                                |
| **Usage Overview**     | Transparency on usage. Drives upgrade awareness naturally. Prevents surprise limits.                                                 |
| **Tasks**              | Lightweight task management. Keeps users in the platform. Replaces need for external to-do tools.                                    |
| **Notifications**      | Centralizes awareness. Drives re-engagement. Surfaces time-sensitive actions (invitations, generation complete).                     |

---

## 3. Complete Layout

### Desktop Layout (≥1280px) — Pixel-Level

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  0,0                                                                          │
│  ┌──────────┐ ┌────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │ │  NAVBAR (56px, bg-white, border-b border-neutral-200)       │ │
│  │          │ │  ┌──────────────────────────┐  ┌──────────────────────────┐ │ │
│  │ 240px    │ │  │ 🏠 Home > Dashboard       │  │ ⌘K Search   🔔 ⚙️ 👤 ▾ │ │ │
│  │          │ │  │ (Breadcrumbs)             │  │                          │ │ │
│  │ ┌──────┐ │ │  └──────────────────────────┘  └──────────────────────────┘ │ │
│  │ │Logo  │ │ ├─────────────────────────────────────────────────────────────┤ │
│  │ │PPilot│ │ │                                                              │ │
│  │ └──────┘ │ │  CONTENT AREA (flex-1, overflow-y-auto)                      │ │
│  │          │ │  padding: 32px (p-8)                                         │ │
│  │ 🏠 Dash  │ │  max-width: 1200px, margin: 0 auto                           │ │
│  │ 🏢 Works │ │                                                              │ │
│  │ 📁 Proj  │ │  ┌──────────────────────────────────────────────────────────┐│ │
│  │          │ │  │  WELCOME HERO (mb-8)                                     ││ │
│  │ ──────── │ │  │  Linear gradient: #EEF2FF → #E0E7FF → #F8FAFC           ││ │
│  │ 📝 Temp  │ │  │  border-radius: 16px, padding: 32px                      ││ │
│  │ 💬 Conv  │ │  │  ┌────────────────────────────────────────────────────┐ ││ │
│  │ 📜 Gen   │ │  │  │ 👋 Welcome back, Jane                               │ ││ │
│  │          │ │  │  │ Ready to build something great today?              │ ││ │
│  │ ──────── │ │  │  │                                                    │ ││ │
│  │ 🔔 Act   │ │  │  │ [+ New Project]  [Open Workspace]  [Continue →]  │ ││ │
│  │ ⚙️ Sett  │ │  │  └────────────────────────────────────────────────────┘ ││ │
│  │ ❓ Help  │ │  └──────────────────────────────────────────────────────────┘│ │
│  └──────────┘ │                                                              │ │
│               │  ┌──────────────────────────────────────────────────────────┐│ │
│               │  │  QUICK ACTIONS (mb-8)                                     ││ │
│               │  │  grid: auto-fit, minmax(150px, 1fr), gap: 12px           ││ │
│               │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ││ │
│               │  │  │📋PRD │ │📐SRS │ │🏗️Arch│ │🗄️DB  │ │📄Doc │ │⌘KMore│ ││ │
│               │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ ││ │
│               │  └──────────────────────────────────────────────────────────┘│ │
│               │                                                              │ │
│               │  ┌────────────────────────────┐ ┌──────────────────────────┐│ │
│               │  │  CONTINUE WORKING          │ │  WORKSPACE SUMMARY       ││ │
│               │  │  (horizontal carousel)     │ │  (stat boxes, 2x2 grid) ││ │
│               │  │  mb-6                      │ │  ┌────┐ ┌────┐         ││ │
│               │  │  ┌────────┐┌────────┐      │ │  │ 3  │ │ 12 │ Projects││ │
│               │  │  │Project ││ AI Chat│      │ │  │WS  │ │Docs│ Documents││ │
│               │  │  │PRD v3  ││ "What  │      │ │  └────┘ └────┘         ││ │
│               │  │  │2h ago  ││ about  │      │ │  ┌────┐ ┌────┐         ││ │
│               │  │  └────────┘└────────┘      │ │  │ 8  │ │ 2  │ Gen  Exp││ │
│               │  └────────────────────────────┘ │  └────┘ └────┘         ││ │
│               │                                 └──────────────────────────┘│ │
│               │  ┌────────────────────────────┐ ┌──────────────────────────┐│ │
│               │  │  RECENT PROJECTS           │ │  FAVORITES               ││ │
│               │  │  (list with status, meta)  │ │  (starred items)         ││ │
│               │  │  mb-6                      │ │                          ││ │
│               │  │  ┌──────────────────────┐  │ │  ⭐ Mobile App PRD       ││ │
│               │  │  │ 📋 API Gateway v2    │  │ │  ⭐ Architecture v2      ││ │
│               │  │  │ Draft · 3 docs · 2h  │  │ │  ⭐ SRS Template         ││ │
│               │  │  └──────────────────────┘  │ │                          ││ │
│               │  └────────────────────────────┘ └──────────────────────────┘│ │
│               │                                                              │ │
│               │  ┌────────────────────────────┐ ┌──────────────────────────┐│ │
│               │  │  AI ACTIVITY FEED          │ │  AI RECOMMENDATIONS      ││ │
│               │  │  (timeline, mb-6)          │ │  (contextual suggestions)││ │
│               │  │  ┌──────────────────────┐  │ │                          ││ │
│               │  │  │ ⟳ Generating SRS...  │  │ │  💡 Resume PRD for      ││ │
│               │  │  │   Project: Mobile App │  │ │     Mobile App          ││ │
│               │  │  │   30% · 1.2k tokens  │  │ │                         ││ │
│               │  │  └──────────────────────┘  │ │  💡 Try Architecture    ││ │
│               │  └────────────────────────────┘ │     generation next      ││ │
│               │                                 │                         ││ │
│               │                                 │  💡 Explore Prompt       ││ │
│               │                                 │     Templates            ││ │
│               │                                 └──────────────────────────┘│ │
│               │                                                              │ │
│               │  ┌──────────────────────────────────────────────────────────┐│ │
│               │  │  TASKS (full-width, mb-8)                                 ││ │
│               │  │  [+ Add task_____________] [Add]                         ││ │
│               │  │  ☐ Write project description for new app                 ││ │
│               │  │  ☑ Review generated PRD                                  ││ │
│               │  │  ☐ Export final specification suite                      ││ │
│               │  └──────────────────────────────────────────────────────────┘│ │
│               └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768–1023px)

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (collapsed, 64px, icons only)               │
│  ┌────┐ ┌──────────────────────────────────────────┐ │
│  │ 🏠 │ │  NAVBAR (56px)                           │ │
│  │ 🏢 │ │  ☰ 🏠 > Dashboard    ⌘K  🔔  👤 ▾       │ │
│  │ 📁 │ ├──────────────────────────────────────────┤ │
│  │ 📝 │ │  CONTENT AREA (p-6)                      │ │
│  │ 💬 │ │  max-width: 100%, full-width              │ │
│  │ 📜 │ │                                           │ │
│  │ 🔔 │ │  WELCOME HERO (stacked CTAs)              │ │
│  │ ⚙️ │ │                                           │ │
│  │ ❓ │ │  QUICK ACTIONS (3×2 grid)                 │ │
│  └────┘ │                                           │ │
│         │  CONTINUE WORKING (horizontal scroll)     │ │
│         │                                           │ │
│         │  RECENT PROJECTS (full-width)             │ │
│         │                                           │ │
│         │  WORKSPACE SUMMARY (below projects)       │ │
│         │                                           │ │
│         │  AI ACTIVITY (full-width)                 │ │
│         │                                           │ │
│         │  FAVORITES (below activity)               │ │
│         │                                           │ │
│         │  TASKS (full-width)                       │ │
│         └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌────────────────────────────────────────────┐
│  NAVBAR (full-width, hamburger menu)       │
│  ☰  PromptPilot        ⌘K  🔔  👤 ▾      │
├────────────────────────────────────────────┤
│  CONTENT AREA (p-4, single column)        │
│                                            │
│  WELCOME HERO (compact, no gradient bg)   │
│  "Welcome back, Jane 👋"                  │
│  [+ New Project] [Open Workspace]         │
│  (CTAs stacked, full-width)               │
│                                            │
│  QUICK ACTIONS (3×2 grid, compact)        │
│                                            │
│  CONTINUE WORKING (horizontal scroll)     │
│                                            │
│  RECENT PROJECTS (full-width cards)       │
│                                            │
│  WORKSPACE SUMMARY (2×2 grid)             │
│                                            │
│  AI ACTIVITY (stacked timeline)           │
│                                            │
│  FAVORITES (inline list)                  │
│                                            │
│  TASKS (simple list)                      │
│                                            │
├────────────────────────────────────────────┤
│  BOTTOM NAVIGATION BAR (h-14, fixed)      │
│  🏠 Home  📁 Works  🤖 AI  👤 Profile     │
└────────────────────────────────────────────┘
```

### Sticky Elements

```
SIDEBAR:      position: fixed? No — flex child. h-full. Scrolls independently.
NAVBAR:       position: sticky, top: 0, z-index: 100
WELCOME HERO: Not sticky — scrolls with content
BOTTOM NAV:   position: fixed, bottom: 0 (mobile only)
TOASTS:       position: fixed, bottom: 24px, right: 24px, z-index: 1800
COMMAND PALETTE: position: fixed, centered overlay, z-index: 1500
```

### Resizable Panels

```
SIDEBAR:      Not resizable by user. Two states: expanded (240px) or collapsed (64px).
              Toggle via button in sidebar header or keyboard shortcut (⌘\)
RIGHT PANEL:  Not present on dashboard by default. Future: expandable notifications panel
              or AI assistant that slides from right (future feature).
```

---

## 4. Navigation System

### Global Navigation

```
TIER 1 — Persistent (always visible):
  Sidebar (main links)
  Navbar (breadcrumbs + global actions)
  Bottom Nav (mobile only)

TIER 2 — Contextual (visible based on workspace/project state):
  Workspace sub-navigation (sidebar section)
  Project sub-navigation (sidebar section)

TIER 3 — Overlay (triggered):
  Command Palette (⌘K)
  User Profile Dropdown
  Notifications Dropdown/Panel
  Help/Support Panel
```

### Workspace Switcher

```
LOCATION:  Sidebar, above context navigation
VISUAL:    Dropdown or list of workspaces with active indicator
BEHAVIOR:  Click to switch active workspace context
           Updates sidebar sections to show workspace-specific links
           Updates breadcrumbs
           Preserves current page where possible (if switching to workspace with same route)

FUTURE:    ⌘1, ⌘2, ⌘3... to switch to 1st/2nd/3rd workspace
           Searchable workspace switcher in ⌘K

COMPONENT:
  WorkspaceSwitcher
    Props: workspaces[], activeSlug, onSwitch
    Renders: Compact dropdown (sidebar) or full list (⌘K)
```

### Project Switcher

```
LOCATION:  Within project context, sidebar shows project navigation
BEHAVIOR:  ⌘K search can find and navigate to any project
           "Recent Projects" widget on dashboard is the primary project switcher
           Breadcrumbs show current project path

FUTURE:    Quick switcher (⌘P) — type project name to jump
           Open recent: ⌘⇧T (like browser "reopen closed tab")
```

### Breadcrumbs

```
CURRENT IMPLEMENTATION: ✅ Built — dynamic from pathname
  Home > Dashboard
  Home > Workspaces > Acme Corp
  Home > Workspaces > Acme Corp > Projects > Mobile App

BEHAVIOR:
  - Generated from URL path segments
  - Intermediate segments are links (clickable)
  - Last segment is current page (bold, not linked)
  - Long workspace/project names truncated with ellipsis
  - On mobile: only show last 2 segments (or just current page)
```

### Command Palette (⌘K / Ctrl+K)

```
CURRENT IMPLEMENTATION: ✅ Built — modal overlay with search, categories, keyboard nav

TRIGGER:      ⌘K / Ctrl+K. Also clickable button in navbar "⌘K Search"
DISMISS:      Esc, click outside, ⌘K again, execute command

COMMANDS:
  Navigation:
    Go to Dashboard         G D
    Go to Workspaces        G W
    Go to Projects          G P
    Go to Settings          G S
    Go to Activity          G A
    Go to Templates         —
    Go to Conversations     —

  Actions:
    New Project             ⌘N
    New Workspace           —
    Generate PRD            —
    Open AI Chat            —
    Export Project          —

  Search:
    Search projects...      (free text — searches project names)
    Search documents...     (free text)
    Search templates...     (free text)

  Recent:
    Last 5 visited pages/projects
    (auto-populated from navigation history)

ENHANCEMENTS (not yet built):
  - Full-text search across projects, documents, conversations
  - Fuzzy matching for typos
  - Recent searches history
  - "Quick math" / calculator
  - "Go to line/heading" within documents
  - Custom user-defined shortcuts
  - Theme toggle command
```

### Quick Navigation

```
PINNED ITEMS:
  Users can pin projects, workspaces, or documents
  Pinned items appear in sidebar "Pinned" section (future)
  Or as first items in Favorites widget

FAVORITES:
  Star toggle on any project, document, conversation
  Favorites widget on dashboard shows starred items
  Accessible from sidebar link or ⌘K search filter

RECENT HISTORY:
  Continue Working carousel (dashboard)
  "Recent" section in ⌘K
  Recently viewed projects/documents stored in localStorage/API
  Max 10 items, LRU eviction
```

---

## 5. Header

### Complete Header Specification

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  NAVBAR (h-14 / 56px, bg-white dark:bg-neutral-900,                          │
│          border-b border-neutral-200 dark:border-neutral-700,                │
│          px-5, flex items-center justify-between)                             │
│                                                                               │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │  LEFT SIDE                       │  │  RIGHT SIDE                       │ │
│  │                                  │  │                                    │ │
│  │  ┌──────┐ ┌────────────────────┐ │  │  ┌──────────┐ ┌──┐ ┌──┐ ┌──────┐│ │
│  │  │  ☰   │ │ 🏠 > Dashboard     │ │  │  │ ⌘K Search │ │🔔│ │🌙│ │ 👤 ▾ ││ │
│  │  │(mob) │ │ (Breadcrumbs)      │ │  │  └──────────┘ └──┘ └──┘ └──────┘│ │
│  │  └──────┘ └────────────────────┘ │  │    ↑            ↑    ↑      ↑     │ │
│  │    ↑ only visible on mobile     │  │  Search       Notif Theme  User   │ │
│  │    toggles sidebar overlay      │  │  Trigger      Bell  Toggle Menu   │ │
│  └─────────────────────────────────┘  └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Header Components

**1. Global Search Trigger**

```
VISUAL:    Button: "⌘K Search" with keyboard badge
           bg-white, border border-neutral-200, rounded-lg
           px-3 py-1.5, text-sm, text-neutral-500
           ⌘K in a small badge (bg-neutral-100, rounded, px-1)

BEHAVIOR:  Click → opens CommandPalette
           Shows keyboard shortcut hint
           Width: ~160px

MOBILE:    Icon-only (🔍 magnifying glass). Tap opens search.
```

**2. Notifications Bell**

```
VISUAL:    Bell icon (🔔 Lucide: Bell)
           Position: right of search trigger
           Badge: red dot with unread count (if >0)
           Badge positioned: top-right of icon, -4px offset

STATES:
  No notifications:  Plain bell icon (neutral-400)
  Unread (1-9):      Bell icon + red badge with number (bg-red-500, text-white, text-[10px])
  Unread (10+):      Bell icon + "9+" badge
  Dropdown open:     Bell icon highlighted (bg-neutral-100, rounded-full)

CLICK:  Opens notifications dropdown panel (right-aligned, below navbar)
        ┌────────────────────────────────────────┐
        │  Notifications              Mark all read│
        │  ────────────────────────────────────── │
        │  ● Jane invited you to Acme Corp       │
        │    2 hours ago                         │
        │  ────────────────────────────────────── │
        │  ● PRD generation complete             │
        │    Project: Mobile App · 3 hours ago   │
        │  ────────────────────────────────────── │
        │  ○ Architecture generation complete    │
        │    1 day ago                           │
        │  ────────────────────────────────────── │
        │         View All Notifications →       │
        └────────────────────────────────────────┘
        Width: 360px, max-height: 480px, overflow-y: auto

DISMISS: Click outside, press Esc, click bell again
```

**3. AI Status Indicator**

```
LOCATION:  Between search and notifications (future)
VISUAL:    Small pulsing dot + label
STATES:
  Idle:       ○ "AI Ready" (neutral-400 dot)
  Generating: ● "Generating PRD..." (indigo-500 dot, pulsing, text-indigo-600)
  Error:      ● "Generation failed" (red-500 dot)

CLICK:  Navigate to active generation (project page) or show quick status dropdown
```

**4. Theme Toggle**

```
VISUAL:    ☀️ Sun icon (light mode) / 🌙 Moon icon (dark mode)
           Button: 32×32px, rounded-full
           Hover: bg-neutral-100 dark:bg-neutral-800

BEHAVIOR:  Click toggles between light/dark/system
           System mode: reads prefers-color-scheme
           Persisted to localStorage
           Animates: icon rotates 180° with scale on toggle (250ms spring)

ACCESSIBILITY: aria-label="Toggle dark mode" / "Toggle light mode"
```

**5. Help Menu**

```
VISUAL:    ? icon button
           Click: opens help dropdown
           ┌──────────────────────────────┐
           │  📖 Documentation            │
           │  ⌨️  Keyboard Shortcuts       │
           │  💬 Contact Support          │
           │  🐛 Report a Bug             │
           │  💡 Feature Request          │
           │  ─────────────────────────── │
           │  🔄 What's New (changelog)   │
           └──────────────────────────────┘
```

**6. User Profile Menu**

```
VISUAL:    Avatar (32×32px, rounded-full) + Name + ▾ chevron
           If no avatar: initials in colored circle

CLICK:     Opens dropdown (right-aligned)
           ┌────────────────────────────────────┐
           │  👤 Jane Smith                     │
           │     jane@acme.com                  │
           │  ────────────────────────────────  │
           │  ⚙️  Account Settings               │
           │  🏢  Manage Workspaces              │
           │  💳  Billing & Plans               │
           │  🔑  API Keys                       │
           │  📊  Usage & Analytics              │
           │  🌙  Theme: System ▾               │
           │  ────────────────────────────────  │
           │  🚪  Sign Out                       │
           └────────────────────────────────────┘

LOGOUT:    Clears auth state, redirects to /login
           POST /api/v1/auth/logout
```

---

## 6. Sidebar

### Complete Sidebar Specification

```
┌────────────────────────────────────┐
│  SIDEBAR                            │
│  w-[240px] (expanded) / w-[64px] (collapsed) │
│  h-full, bg-white dark:bg-neutral-900        │
│  border-r border-neutral-200                 │
│  flex flex-col                                │
│  transition: width 200ms ease                 │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  HEADER (p-4, flex items-center)         │ │
│  │  ┌──────────────┐        ┌────────────┐ │ │
│  │  │ PromptPilot   │        │     ⟪      │ │ │
│  │  │ (or PP when   │        │ (collapse   │ │ │
│  │  │  collapsed)   │        │  toggle)    │ │ │
│  │  └──────────────┘        └────────────┘ │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  MAIN NAVIGATION (flex-1, overflow-auto) │ │
│  │  p-2                                      │ │
│  │                                           │ │
│  │  🏠  Dashboard                     G D   │ │
│  │  🏢  Workspaces                    G W   │ │
│  │  📁  Projects                      G P   │ │
│  │                                           │ │
│  │  ─── WORKSPACE ────────────────────────  │ │
│  │  (visible when workspace active)         │ │
│  │  🏠  Overview                            │ │
│  │  📁  Projects                  3         │ │
│  │  👥  Members                   5         │ │
│  │  ⚙️  Settings                            │ │
│  │                                           │ │
│  │  ─── PROJECT ──────────────────────────  │ │
│  │  (visible when project active)           │ │
│  │  📋  Overview                             │ │
│  │  📄  Documents                 9         │ │
│  │  🤖  AI Conversations          3         │ │
│  │  📦  Exports                   2         │ │
│  │  ⚙️  Settings                             │ │
│  │                                           │ │
│  │  ─── AI WORKSPACE ─────────────────────  │ │
│  │  📝  Prompt Templates                     │ │
│  │  💬  AI Conversations                     │ │
│  │  📜  Generation History                   │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  BOTTOM NAVIGATION (border-t)            │ │
│  │  p-2                                      │ │
│  │  🔔  Activity                      G A   │ │
│  │  ⚙️  Settings                       G S   │ │
│  │  ❓  Help                                  │ │
│  └─────────────────────────────────────────┘ │
└────────────────────────────────────┘
```

### Sidebar Item States

```
DEFAULT:      text-neutral-500, bg-transparent
HOVER:        bg-neutral-100, text-neutral-700
ACTIVE:       bg-primary-50, text-primary-700, font-semibold
              Left border: 2px solid primary-600 (or just background)
DISABLED:     text-neutral-300, cursor-not-allowed

BADGE:        Count badge on right side (e.g., "3" next to Projects)
              bg-neutral-100, text-neutral-500, text-xs, rounded-full, px-1.5

SHORTCUT:     Keyboard shortcut label on far right (e.g., "G D")
              text-[10px], text-neutral-400, hidden on collapsed

SECTION LABEL: Uppercase, text-[10px], tracking-wider, text-neutral-400
              px-3, pt-4, pb-1
```

### Collapsed State Behavior

```
EXPANDED (240px):   Icons + labels + shortcuts + badges visible
COLLAPSED (64px):   Icons only. Labels, shortcuts hidden.
                    Tooltip on hover shows label + shortcut.
                    Section labels become thin dividers.
                    Badge becomes small dot on icon.
                    Logo becomes "PP" monogram.

TRANSITION:         width: 200ms ease
                    Labels fade in/out (opacity, 150ms)
                    Collapse button ⟪ rotates 180° to ⟫
```

---

## 7. Dashboard Widgets

### Widget 1: Welcome Hero

```
PURPOSE:       Personalized greeting + primary CTAs. Reduces "cold start" feeling.
PRIORITY:      P0 — always visible at top of dashboard
DATA SOURCE:   AuthProvider (user.name), time-of-day calculation

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  gradient-bg (linear: #EEF2FF → #E0E7FF → #F8FAFC)          │
  │  rounded-2xl, p-8, relative                                  │
  │                                                               │
  │  👋 Good morning, Jane                                        │
  │  (text-2xl, font-bold, neutral-900)                           │
  │                                                               │
  │  Ready to build something great today?                        │
  │  (text-base, neutral-600)                                     │
  │                                                               │
  │  You're working on Mobile App Redesign in Acme Corp.          │
  │  (text-sm, neutral-500 — shows last active context)           │
  │                                                               │
  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐  │
  │  │ + New Project     │  │ Open Workspace   │  │ Resume →   │  │
  │  │ (primary, glow)   │  │ (secondary)      │  │ (ghost)    │  │
  │  └──────────────────┘  └──────────────────┘  └────────────┘  │
  └──────────────────────────────────────────────────────────────┘

TIME-OF-DAY GREETING:
  5am-11:59am:   "Good morning, {name} 👋"
  12pm-4:59pm:   "Good afternoon, {name} 👋"
  5pm-9:59pm:    "Good evening, {name} 👋"
  10pm-4:59am:   "Working late, {name}? 🌙"

FIRST-TIME USER:
  "Welcome to PromptPilot, {name}! 🚀"
  "Let's create your first project."
  CTAs: "Create Your First Project" (primary), "Explore Templates" (secondary)
  No "Resume" button.

ACTIVE CONTEXT:
  Shows last accessed workspace + project (stored in localStorage + API)
  Click workspace/project name → navigate directly
  If no recent activity: "Start by creating a project or opening a workspace."
```

### Widget 2: Quick Actions

```
PURPOSE:       Single-click access to common creation flows. Reduces menu diving.
PRIORITY:      P0 — always visible
DATA SOURCE:   Static (hardcoded actions)

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  grid: auto-fit, minmax(150px, 1fr), gap-3                   │
  │                                                               │
  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
  │  │    📋        │ │    📐        │ │    🏗️        │         │
  │  │  Generate    │ │  Generate    │ │  Architecture│         │
  │  │  PRD         │ │  SRS         │ │  Design      │         │
  │  └──────────────┘ └──────────────┘ └──────────────┘         │
  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
  │  │    🗄️        │ │    📄        │ │    ⌘K        │         │
  │  │  Database    │ │  New         │ │  More        │         │
  │  │  Schema      │ │  Document    │ │  Actions     │         │
  │  └──────────────┘ └──────────────┘ └──────────────┘         │
  └──────────────────────────────────────────────────────────────┘

EACH CARD:
  display: flex, flex-col, items-center, gap-2
  padding: 20px 16px
  border-radius: 12px
  background: color-coded (each has unique bg color from palette)
  border: 1px solid transparent
  cursor: pointer
  text-decoration: none
  transition: transform 150ms, box-shadow 150ms

COLOR CODING:
  PRD:    bg-[#EEF2FF] (indigo-50)
  SRS:    bg-[#ECFDF5] (emerald-50)
  Arch:   bg-[#FFF7ED] (orange-50)
  DB:     bg-[#EFF6FF] (blue-50)
  Doc:    bg-[#F5F3FF] (violet-50)
  More:   bg-[#F8FAFC] (neutral-50), border-2 border-dashed border-neutral-200

HOVER:    transform: translateY(-2px), box-shadow: md
CLICK:    Each navigates to project creation or document generation
          "More Actions" opens Command Palette (⌘K)
```

### Widget 3: Continue Working

```
PURPOSE:       Immediate access to recently active items. "Resume where you left off."
PRIORITY:      P1 — shown when user has recent activity
DATA SOURCE:   GET /api/v1/dashboard/recent (future) or localStorage + projects API

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  CONTINUE WORKING                              [View All →]  │
  │  (Card header: title + link)                                  │
  │                                                               │
  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
  │  │ 📋 Mobile App    │  │ 💬 Architecture  │  │ 📄 API Spec  │ │
  │  │    Redesign      │  │    Discussion    │  │    Edit      │ │
  │  │ PRD · v3         │  │ 12 messages      │  │ In progress  │ │
  │  │ 2 hours ago      │  │ 1 day ago        │  │ 3 days ago   │ │
  │  │ [Continue →]     │  │ [Continue →]     │  │ [Continue →] │ │
  │  └─────────────────┘  └─────────────────┘  └──────────────┘ │
  └──────────────────────────────────────────────────────────────┘

HORIZONTAL CAROUSEL:
  Overflow-x: auto
  Scroll snap: mandatory
  Cards min-width: 240px
  Gap: 16px
  Shows max 6 items
  Scroll buttons (← →) on edges if overflow (desktop)
  Swipe gesture on mobile

CARD INFO:
  Icon:      Document type icon (📋 PRD, 📐 SRS, 💬 Chat, 📄 Doc)
  Title:     Project name or conversation name
  Subtitle:  Document type + version OR message count OR status
  Timestamp: Relative time (2 hours ago, 1 day ago)
  Action:    "Continue →" link (or entire card is clickable)

EMPTY STATE:
  Hidden when no recent activity.
  Not replaced with empty state — widget is simply not rendered.
```

### Widget 4: Recent Projects

```
PURPOSE:       Primary navigation surface for returning users. Shows project status at a glance.
PRIORITY:      P0 — always visible
DATA SOURCE:   GET /api/v1/projects?sort=recent&limit=5 (aggregated across workspaces)

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  RECENT PROJECTS                               [View All →]  │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐ │
  │  │ 📋  Mobile App Redesign                                  │ │
  │  │     Acme Corp · Active · 9 documents · Modified 2h ago  │ │
  │  │     ████████░░░░░░░░  4/9 pipeline complete             │ │
  │  │                                    [Open]  [•••]         │ │
  │  └─────────────────────────────────────────────────────────┘ │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐ │
  │  │ 📋  API Gateway v2                                       │ │
  │  │     Personal · Draft · 3 documents · Modified 1d ago    │ │
  │  │     ██░░░░░░░░░░░░░░  1/9 pipeline complete             │ │
  │  │                                    [Open]  [•••]         │ │
  │  └─────────────────────────────────────────────────────────┘ │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐ │
  │  │ 📋  Analytics Dashboard                                   │ │
  │  │     Acme Corp · Completed · 9 documents · Modified 3d ago│ │
  │  │     ████████████████  9/9 pipeline complete              │ │
  │  │                                    [Open]  [•••]         │ │
  │  └─────────────────────────────────────────────────────────┘ │
  │                                                               │
  │  (max 5 shown, "View All" opens /projects)                   │
  └──────────────────────────────────────────────────────────────┘

EACH ROW:
  bg-white, border border-neutral-100, rounded-xl
  p-4, mb-2
  Status badge: Draft (neutral), Active (primary), Generating (amber with spinner), Completed (emerald)
  Pipeline progress: mini progress bar (h-1, bg-neutral-100, fill primary-600)
  Actions: "Open" (primary link) + context menu (•••) with: Duplicate, Archive, Export, Settings

EMPTY STATE:
  "No projects yet"
  "Create your first project to start generating engineering specifications."
  [+ Create Project] CTA button
```

### Widget 5: AI Activity Feed

```
PURPOSE:       Show AI generation history and active generations.
               Builds trust and awareness of AI work product.
PRIORITY:      P0 — always visible
DATA SOURCE:   GET /api/v1/conversations?sort=recent&limit=10 (future endpoint)

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  🤖 AI ACTIVITY                                [View All →]  │
  │                                                               │
  │  ● Generating SRS...                          Just now       │
  │    Project: Mobile App Redesign                               │
  │    34% · 1.2k/16k tokens · GPT-4o            [View]          │
  │  ──────────────────────────────────────────────────────────  │
  │  ✓ Architecture generated                     2 hours ago    │
  │    Project: Mobile App Redesign                               │
  │    12.4k tokens · $0.31 · GPT-4o              [View]         │
  │  ──────────────────────────────────────────────────────────  │
  │  ✓ PRD generated                             1 day ago       │
  │    Project: API Gateway v2                                    │
  │    8.2k tokens · $0.21 · Claude 3.5 Sonnet   [View]          │
  │  ──────────────────────────────────────────────────────────  │
  │  ✕ SRS generation failed                     1 day ago       │
  │    Project: API Gateway v2                    [Retry]         │
  └──────────────────────────────────────────────────────────────┘

TIMELINE:
  Left border line connecting items
  Icons on the line:
    ● Pulsing indigo dot = generation in progress
    ✓ Green checkmark = completed
    ✕ Red X = failed

EACH ITEM:
  Padding: py-3
  Click navigates to project page at that step/document
  "View" link or whole row clickable
  Active generation: shows live progress bar + token counter
  Failed: shows "Retry" button

LIVE UPDATES:
  Polling every 3s for active generations (SSE preferred but polling fallback)
  New completions animate in from top
  Active generation progress bar animates smoothly
```

### Widget 6: Workspace Summary

```
PURPOSE:       At-a-glance statistics. Shows "how much you've accomplished."
PRIORITY:      P1
DATA SOURCE:   GET /api/v1/dashboard/stats

LAYOUT:
  ┌──────────────────────────────────────────┐
  │  📊 WORKSPACE SUMMARY                     │
  │                                           │
  │  ┌────────────────┐ ┌────────────────┐   │
  │  │        3       │ │       12       │   │
  │  │   Workspaces   │ │   Documents    │   │
  │  └────────────────┘ └────────────────┘   │
  │  ┌────────────────┐ ┌────────────────┐   │
  │  │        8       │ │        2       │   │
  │  │   Generations  │ │   Exports      │   │
  │  └────────────────┘ └────────────────┘   │
  └──────────────────────────────────────────┘

EACH STAT BOX:
  bg-neutral-50 dark:bg-neutral-800
  border border-neutral-100 dark:border-neutral-700
  rounded-lg, p-4
  Number: text-2xl, font-bold, primary-600
  Label: text-xs, text-neutral-500, uppercase tracking-wider

ANIMATION:
  Numbers count up from 0 on first load (IntersectionObserver trigger)
  Duration: 800ms, ease-out
  Only animates once
```

### Widget 7: AI Recommendations

```
PURPOSE:       Contextual suggestions to drive feature discovery and next actions.
PRIORITY:      P1 — shown when recommendations available
DATA SOURCE:   AI-generated based on user activity + project state

LAYOUT:
  ┌──────────────────────────────────────────┐
  │  💡 RECOMMENDED FOR YOU                   │
  │                                           │
  │  ┌────────────────────────────────────┐  │
  │  │ 📋 Resume PRD                      │  │
  │  │ You were editing the PRD for       │  │
  │  │ Mobile App Redesign. Continue?     │  │
  │  │                         [Resume →] │  │
  │  └────────────────────────────────────┘  │
  │                                           │
  │  ┌────────────────────────────────────┐  │
  │  │ 🏗️ Generate Architecture           │  │
  │  │ Your SRS is complete. The next     │  │
  │  │ step is system architecture.       │  │
  │  │                       [Generate →] │  │
  │  └────────────────────────────────────┘  │
  │                                           │
  │  ┌────────────────────────────────────┐  │
  │  │ 📝 Explore Templates               │  │
  │  │ Save time with pre-built document  │  │
  │  │ and prompt templates.              │  │
  │  │                       [Browse →]   │  │
  │  └────────────────────────────────────┘  │
  └──────────────────────────────────────────┘

RULES-BASED (Phase 4):
  - If project has PRD but no SRS → suggest SRS generation
  - If last action was editing a document → suggest resume
  - If new user (no projects) → suggest templates
  - If free tier approaching limit → suggest upgrade (soft)

AI-POWERED (Phase 5+):
  - Analyze document staleness → suggest regeneration
  - Analyze project completion → suggest export
  - Analyze user behavior patterns → suggest shortcuts/workflows
  - Recommend community templates based on project domain
```

### Widget 8: Favorites

```
PURPOSE:       User-curated quick-access. Prioritizes user preferences.
PRIORITY:      P1
DATA SOURCE:   User preferences (favorites stored in user.preferences JSON or separate table)

LAYOUT:
  ┌──────────────────────────────────────────┐
  │  ⭐ FAVORITES                             │
  │                                           │
  │  ⭐ Mobile App PRD               [Open →] │
  │  ⭐ Architecture v2              [Open →] │
  │  ⭐ SRS Template                 [Open →] │
  │  ⭐ API Chat: "Auth discussion"  [Open →] │
  │                                           │
  │  ─────────────────────────────────────── │
  │  No favorites yet. Star projects and     │
  │  documents to access them quickly.        │
  │  (empty state — shown when no favorites) │
  └──────────────────────────────────────────┘

EACH ITEM:
  Icon (type-specific) + name + "Open →" link
  Hover: bg-neutral-50, rounded
  Click: navigate to item
  Unfavorite: star icon toggle (⭐ → ☆) on hover

EMPTY STATE:
  Shown inline within widget (not replacing the whole card)
  "No favorites yet. Star projects and documents to access them quickly."
```

### Widget 9: Usage Overview

```
PURPOSE:       Transparency on plan usage. Drives upgrade awareness.
PRIORITY:      P2 — shown for paid plans. Hidden for enterprise.
DATA SOURCE:   GET /api/v1/dashboard/stats (tokensUsed, totalCost) + plan info

LAYOUT:
  ┌──────────────────────────────────────────┐
  │  📊 USAGE OVERVIEW                        │
  │  Free Plan · 3/3 projects used            │
  │                                           │
  │  Projects                                │
  │  ████████████████████  3/3               │
  │                                           │
  │  AI Generations                          │
  │  ████████████████░░░░  45/100            │
  │                                           │
  │  Tokens Used                             │
  │  ████████░░░░░░░░░░░░  125K/500K         │
  │                                           │
  │  ┌────────────────────────────────────┐  │
  │  │  ⚡ Upgrade to Pro                 │  │
  │  │  Unlimited projects & generations  │  │
  │  └────────────────────────────────────┘  │
  └──────────────────────────────────────────┘

PROGRESS BARS:
  height: 6px, bg-neutral-100, rounded-full
  Fill: primary-600 (or warning-500 at 80%+, error-500 at 95%+)
  Label: "3/3" to the right
  Width transition: 500ms ease-out

UPGRADE PROMPT:
  Shown when any metric exceeds 80% of limit
  bg-primary-50, border border-primary-100, rounded-lg, p-3
  "Upgrade to Pro" button → /pricing or billing page
```

### Widget 10: Tasks

```
PURPOSE:       Lightweight personal task tracking. Keeps users in the platform.
PRIORITY:      P2 — optional, collapsible
DATA SOURCE:   Local state (useState), future: persisted to user preferences

LAYOUT:
  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ TASKS                                        [Clear Done] │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐ │
  │  │ [Add a new task...___________________________] [Add]    │ │
  │  └─────────────────────────────────────────────────────────┘ │
  │                                                               │
  │  ☐ Write project description for new mobile banking app      │
  │  ☑ Review generated PRD for completeness                     │
  │  ☐ Export final specification suite for stakeholder review   │
  │  ☐ Set up API Gateway v2 project                             │
  │                                                               │
  │  EMPTY: "No tasks yet. Add one above to track your progress." │
  └──────────────────────────────────────────────────────────────┘

TASK ITEM:
  display: flex, items-center, justify-between
  padding: 10px 0, border-b border-neutral-50
  checkbox + label (strikethrough + muted when checked)
  Delete button (✕) appears on hover
  Check animation: scale bounce + strikethrough slide

ADD TASK:
  Input + "Add" button
  Enter key submits
  Validation: min 1 character, max 500 characters
  New tasks animate: slide down + fade in

DATA PERSISTENCE:
  Currently localStorage only (built)
  Future: POST /api/v1/user/tasks → stored in user.preferences JSON
```

---

## 8. Quick Actions

### Complete Quick Action Registry

```
CREATE WORKSPACE:
  Trigger:     "+ New Workspace" (sidebar or ⌘K)
  Flow:        Dialog with name + slug fields → POST /workspaces → navigate to workspace
  Shortcut:    ⌘⇧N

CREATE PROJECT:
  Trigger:     "+ New Project" (Welcome Hero, Quick Actions, ⌘K)
  Flow:        Dialog: name, description, workspace select → POST /projects → navigate to project
  Shortcut:    ⌘N

OPEN AI CHAT:
  Trigger:     Quick Action card or ⌘K
  Flow:        Navigate to /conversations or open chat within current project context
  Shortcut:    ⌘⇧C

GENERATE PRD:
  Trigger:     Quick Action card (📋 Generate PRD)
  Flow:        Navigate to project → PRD Generator
               If no active project: prompt to create one first

IMPORT PROMPT (future):
  Trigger:     Quick Action or ⌘K
  Flow:        File upload dialog → parse prompt file → add to library

UPLOAD FILES (future):
  Trigger:     Quick Action or drag-and-drop zone on dashboard
  Flow:        File upload → attach to project or document

OPEN TEMPLATES:
  Trigger:     Quick Action or sidebar link
  Flow:        Navigate to /templates

INVITE MEMBERS:
  Trigger:     Workspace Members page or ⌘K
  Flow:        Dialog: email + role → POST invitation
  Shortcut:    ⌘I (within workspace context)
```

---

## 9. Search Experience

### Global Search Specification

```
TRIGGER:      ⌘K / Ctrl+K, or click "⌘K Search" in navbar
OVERLAY:      Modal, centered, 560px max-width, z-1500
BACKDROP:     rgba(0,0,0,0.4), click to dismiss

SEARCH INPUT:
  Auto-focused on open
  Placeholder: "Type a command or search..."
  No search icon (minimal — just input)
  Clear button (✕) appears when query is non-empty
  Debounce: 150ms before filtering results

SEARCH SCOPE:
  Projects (name, description)
  Documents (title, type)
  AI Conversations (title — first message)
  Workspaces (name)
  Templates (name, tags)
  Commands (actions like "New Project", "Generate PRD")
  Navigation (sidebar links)

RANKING:
  1. Exact matches in names (highest priority)
  2. Prefix matches (typing "mob" matches "Mobile App")
  3. Fuzzy matches (typo tolerance — 1-2 character differences)
  4. Content matches (within descriptions, document content)
  5. Recent items boosted (recently accessed ranks higher)

RESULTS DISPLAY:
  Grouped by category with section headers:
    ┌──────────────────────────────────────────┐
    │  NAVIGATION                              │
    │  🏠 Dashboard                     G D    │
    │  🏢 Workspaces                    G W    │
    │  ─────────────────────────────────────── │
    │  PROJECTS                                │
    │  📋 Mobile App Redesign                  │
    │     Acme Corp · 4/9 complete             │
    │  📋 API Gateway v2                       │
    │     Personal · 1/9 complete              │
    │  ─────────────────────────────────────── │
    │  ACTIONS                                 │
    │  + New Project                    ⌘N    │
    │  📋 Generate PRD                         │
    │  ─────────────────────────────────────── │
    │  DOCUMENTS                               │
    │  📄 Architecture — Mobile App Redesign   │
    │  📄 SRS — API Gateway v2                 │
    └──────────────────────────────────────────┘

MAX RESULTS:    8 per category, "Show all X results →" expander if more
NO RESULTS:     "No results found" with suggestion to try different terms
MAX HEIGHT:     400px, overflow-y: auto

KEYBOARD NAVIGATION:
  ↑/↓:         Navigate between results
  Enter:       Execute selected command / navigate to selected item
  Esc:         Close palette
  ⌘K:          Toggle close
  Tab:         (not used — Esc + arrows only)

RECENT SEARCHES:
  Shown when query is empty
  Last 5 searches persisted to localStorage
  Each with clock icon + click to re-execute
  "Clear recent searches" link at bottom
```

---

## 10. Empty States

### First-Time User Onboarding

```
SCENARIO: User just registered, no projects, no workspaces beyond auto-created one.

DASHBOARD STATE:
  Welcome Hero:   "Welcome to PromptPilot! 🚀"
                   "Let's create your first project."
                   [Create Your First Project →]  [Explore Templates →]

  Quick Actions:  Shown (always visible — allows creation even when empty)

  Continue Working: Hidden (no history)

  Recent Projects: Empty state:
                   ┌──────────────────────────────────────────┐
                   │              📁                           │
                   │       No projects yet                    │
                   │  Create your first project to start      │
                   │  generating engineering specifications.  │
                   │        [+ Create Project]                │
                   └──────────────────────────────────────────┘

  AI Activity:    Empty state:
                   ┌──────────────────────────────────────────┐
                   │              💬                           │
                   │       No AI activity yet                 │
                   │  Generate your first document to see     │
                   │  AI generation history here.             │
                   └──────────────────────────────────────────┘

  Favorites:      Empty state (inline): "Star projects and documents to access them quickly."

  Workspace Summary: Shows zeros. Still renders — shows user there are metrics to track.

ONBOARDING OVERLAY (future Phase 4):
  Optional 3-step guided tour:
    1. "This is your dashboard — your command center"
    2. "Create a project here to start generating specs"
    3. "Use ⌘K to search and navigate anywhere"
  Dismissible. Shown once. Stored in user preferences.

SECOND-VISIT (still no projects):
  Slightly more urgent empty state messaging:
  "Still exploring? Here are some ideas:"
  [Templates] [Sample Project] [Watch Demo]
```

### Empty States for Each Widget

```
NO PROJECTS:
  Icon: 📁
  Title: "No projects yet"
  Description: "Create your first project to start generating specifications."
  Action: [+ Create Project] (primary button)

NO WORKSPACES:
  Icon: 🏢
  Title: "No workspaces yet"
  Description: "Workspaces help you organize projects and collaborate with your team."
  Action: [+ Create Workspace]

NO ACTIVITY:
  Icon: 📊
  Title: "No recent activity"
  Description: "Your activity feed will show AI generations, team actions, and updates."

NO NOTIFICATIONS:
  Icon: 🔔
  Title: "All caught up!"
  Description: "You have no unread notifications."
  (shown in notification dropdown)

NO FAVORITES:
  Inline text: "Star projects and documents to access them quickly."
  (no icon — inline within widget to keep card compact)

NO TASKS:
  Inline text: "Add tasks above to track your progress."
```

---

## 11. Functional Requirements

### CRUD Operations

```
CREATE:
  Project:      Dialog (name, description, workspace select) → POST /projects → navigate
  Workspace:    Dialog (name, slug auto-gen, type select) → POST /workspaces → navigate
  Task:         Input + Enter → local state add
  Conversation: Navigate to AI Chat → auto-create on first message
  Document:     Navigate to project → click Generate on pipeline step

EDIT:
  Project name: Inline edit or settings page → PATCH /projects/:id
  Task text:    Double-click to edit inline (future) — currently delete + re-add
  User profile: Settings page → PATCH /auth/profile

DELETE:
  Project:      Context menu → "Archive" → confirmation dialog → DELETE /projects/:id
  Task:         Click ✕ on task → instant removal
  Workspace:    Settings → Danger Zone → Archive → PATCH /workspaces/:id (soft delete)
  Notification: Click ✕ on notification → dismiss (mark read)

RENAME:
  Project:      ••• → Rename → inline edit or dialog → PATCH /projects/:id
  Workspace:    Settings tab → edit name → PATCH /workspaces/:id

ARCHIVE:
  Project:      DELETE /projects/:id (soft — sets deletedAt)
  Workspace:    DELETE /workspaces/:id (soft)
  Both:         Confirmation dialog required. "This will hide the {resource}. You can restore it within 30 days from Settings."

RESTORE:
  Archived items shown in "Archived" filter on projects/workspaces page
  ••• → Restore → PATCH /projects/:id { deletedAt: null }

DUPLICATE:
  Project:      ••• → Duplicate → dialog (enter new name) → POST /projects with copied settings
  Options:      "Copy with documents" (toggle) — duplicates all generated documents too.

FAVORITE:
  Toggle:       Click ⭐/☆ icon on project card or document
  API:          PATCH /user/preferences { favorites: [...] }
  Optimistic:   Star updates instantly. Reverts on API failure.
  Displayed in: Favorites widget, ⌘K "Favorites" category

PIN:
  Toggle:       ••• → Pin to Top
  Pinned items: Appear first in Recent Projects, above unpinned items
  Persisted in: User preferences

SEARCH:
  Global:       ⌘K palette (described in Section 9)
  Local:        Filter/Search inputs on list pages (workspaces, projects) — future

FILTER:
  Projects:     By status (All, Draft, Active, Generating, Completed, Archived)
  Workspaces:   By type (All, Personal, Team)
  Activity:     By type (Generations, Edits, Comments, Exports)

SORT:
  Projects:     By name, last modified, created date, status
  Workspaces:   By name, last modified, project count
  Default:      Last modified (descending)

DRAG & DROP:
  Tasks:        Reorder tasks by dragging (future)
  Widgets:      Reorder dashboard widgets (future customization)
  Not current:  Needs implementation

BULK ACTIONS:
  Projects:     Select multiple → Batch Archive, Batch Export (future)
  Notifications: "Mark all as read" button
  Not current:  Needs multi-select UI pattern

INFINITE SCROLL:
  Projects list:     Not needed on dashboard (shows max 5)
  Activity feed:     "Load more" button (not infinite — paginated, 10 per page)
  Notifications:     Scroll to load older notifications

PAGINATION:
  Projects list:     Offset-based (page/limit), 20 per page
  Activity feed:     "View All" navigates to full activity page with pagination
  API:               meta: { total, page, limit } in all list responses
```

---

## 12. AI Features

### AI-Powered Dashboard Features

```
AI RECOMMENDATIONS:
  "Resume your PRD for Mobile App" — based on last accessed document
  "Generate Architecture for API Gateway" — next logical pipeline step
  "Explore prompt templates for e-commerce projects" — domain-based suggestions
  "Your SRS has been stale for 7 days — regenerate?" — staleness detection

RESUME PREVIOUS WORK:
  Continue Working widget — ranked by AI relevance, not just recency
  "You spent 2 hours editing this. Want to continue?" — engagement-weighted ranking

SUGGESTED PROMPTS:
  Based on project context: "Try asking: 'What are the trade-offs between monolith and microservices?'"
  Based on document type: "Common Architecture prompts: ..."

SUGGESTED TEMPLATES:
  "3 templates match your project domain (FinTech)"
  "Popular with teams your size (1-5 members)"
  Context-aware template recommendations

CONTEXT-AWARE SUGGESTIONS:
  Morning: "Good morning! Start with reviewing yesterday's PRD generation."
  After generation: "Your SRS is ready. Next: generate the Architecture."
  Project milestone: "All 9 documents generated! Ready to export?"

AI PRODUCTIVITY INSIGHTS (Phase 5+):
  "You generate documents fastest on Tuesday mornings"
  "Your average PRD takes 2.3 generations to finalize"
  "Consider using Templates — they save 40% generation time"

PROMPT QUALITY SCORE (Phase 5+):
  Rate prompt quality based on output consistency
  Show score in Prompt Library
  Suggest improvements for low-scoring prompts

PROJECT HEALTH SCORE (Phase 5+):
  Score based on: document completeness, staleness, review status
  Color-coded: Green (Healthy), Yellow (Needs attention), Red (Stale/Incomplete)
  Shown on project cards and project overview
```

---

## 13. Notifications

### Notification Types

```
SYSTEM NOTIFICATIONS:
  - Account created: "Welcome to PromptPilot!"
  - Email verified: "Email verified successfully"
  - Plan upgraded: "You're now on the Pro plan"
  - Plan expiring: "Your Pro plan expires in 7 days"

AI NOTIFICATIONS:
  - Generation complete: "PRD generated for Mobile App Redesign"
  - Generation failed: "SRS generation failed for API Gateway v2"
  - Full pipeline complete: "All 9 documents generated for Analytics Dashboard"
  - Regeneration suggested: "Architecture document is stale — upstream PRD changed"

WORKSPACE INVITES:
  - Invitation received: "Jane Smith invited you to Acme Corp"
  - Invitation accepted: "Bob Johnson accepted your invitation"
  - Role changed: "Your role in Acme Corp changed to Editor"
  - Removed: "You've been removed from Acme Corp"

MENTIONS (future):
  - "@jane mentioned you in a comment on Architecture"
  - "@jane assigned you to review the PRD"

COMMENTS (future):
  - "New comment on API Spec by Bob Johnson"
  - "Comment thread resolved on Database Schema"

EXPORTS:
  - "Export complete: Mobile_App_Specification_Suite.pdf"
  - "Export failed: Retry?"

VERSION UPDATES:
  - "Jane restored Architecture v2"
  - "New version of PRD: v5"
```

### Notification Display

```
IN-APP (Bell icon dropdown):
  Max 20 notifications shown
  Grouped by: Today, Yesterday, This Week, Older
  Unread: bold title + colored dot indicator
  Read: normal weight, no dot
  Each item: icon + title + body + relative timestamp + click action
  Click: Navigate to relevant resource + mark as read
  ✕:    Dismiss (mark as read, don't navigate)

  "Mark all as read" button at top
  "View all notifications →" link at bottom → /activity page

TOAST (for real-time events):
  Auto-dismiss after 5 seconds
  Position: bottom-right, stacked
  Examples:
    "✅ PRD generated successfully"  (success, 5s)
    "❌ Generation failed"            (error, 10s, with Retry action)
    "📬 New invitation from Jane"     (info, persists until dismissed)

EMAIL (for offline/async):
  Sent for: invitations, generation complete (opt-in),
            security alerts, billing events, account changes
  Configurable in Settings → Notifications

PUSH (future):
  Browser notifications via Service Worker
  Opt-in prompt on first AI generation
  "PRD generated! Click to view."
```

### Notification States

```
LOADING:       Skeleton items (avatar circle + two text lines)
EMPTY:         Bell icon + "All caught up! No unread notifications."
ERROR:         "Couldn't load notifications. [Retry]"
UNREAD:        Bold text + indigo dot indicator. Slightly different bg.
READ:          Normal text. No dot.
DISMISSING:    Slide right + fade out (200ms ease-in)
```

---

## 14. Analytics

### Dashboard-Level Analytics

```
PROJECTS CREATED:
  Total count + trend (↑ 20% this month)
  Shown in Workspace Summary widget
  API: GET /dashboard/stats → projects count

PROMPT GENERATIONS:
  Total AI generations across all projects
  Trend line (future: chart)
  API: GET /dashboard/stats → generations count

AI USAGE:
  Tokens consumed, cost incurred
  Model breakdown (GPT-4o: 60%, Claude: 40%)
  Shown in Usage Overview widget
  API: GET /dashboard/stats → tokensUsed, totalCost

WORKSPACE ACTIVITY:
  Active workspaces count
  Team members count
  Recent activity timeline

STORAGE USAGE:
  Total documents size (future)
  Export files size
  Shown in Usage Overview (Pro/Team plans)

API USAGE (future — for API key users):
  API calls this month
  Rate limit usage %

TOKEN CONSUMPTION:
  Daily/weekly/monthly breakdown
  Per-project breakdown
  Cost estimates

DAILY PRODUCTIVITY:
  Documents generated today
  Edits made today
  Time spent in editor

WEEKLY SUMMARY (future email):
  "This week in PromptPilot: 3 documents generated, 12 edits, 2 exports"
```

---

## 15. State Management

### Complete State Map

```
GLOBAL STATES (AuthProvider):
  isAuthenticated: boolean
  user: { id, email, name, role, emailVerified, avatarUrl, preferences }
  loading: boolean (initial auth check)

LAYOUT STATES (LayoutContext):
  sidebarOpen: boolean      (mobile: overlay toggle)
  sidebarCollapsed: boolean  (desktop: width toggle)

NAVIGATION STATES (NavigationContext):
  activeWorkspace: string | null    (slug)
  activeProject: string | null      (slug)
  commandPaletteOpen: boolean
  searchQuery: string

DASHBOARD DATA STATES (local component state):
  stats:            { workspaces, projects, documents, generations, tokensUsed, totalCost, unreadNotifications }
  statsLoading:     boolean
  statsError:       string | null

  recentProjects:   Project[]
  projectsLoading:  boolean
  projectsError:    string | null

  aiActivity:       ActivityItem[]
  activityLoading:  boolean
  activityError:    string | null

  tasks:            Task[]
  favorites:        Favorite[]
  recommendations:  Recommendation[]

NOTIFICATION STATES (ToastProvider):
  toasts: Toast[]

THEME STATE (localStorage + class on <html>):
  theme: 'light' | 'dark' | 'system'
```

### Loading States

```
FULL PAGE LOAD (first visit after auth):
  - Sidebar + Navbar render immediately (from layout)
  - Dashboard content shows skeleton UI:
    ┌──────────────────────────────────────────┐
    │  [skeleton: hero banner, h-32, w-full]   │
    │  [skeleton: 6 small squares in grid]     │
    │  ┌────────────────┐ ┌────────────────┐  │
    │  │ [skeleton card] │ │ [skeleton card] │  │
    │  │ [3 lines]      │ │ [4 boxes]       │  │
    │  └────────────────┘ └────────────────┘  │
    │  ┌────────────────┐ ┌────────────────┐  │
    │  │ [skeleton card] │ │ [skeleton card] │  │
    │  └────────────────┘ └────────────────┘  │
    │  [skeleton: task list, 3 rows]           │
    └──────────────────────────────────────────┘

PARTIAL LOAD (returning visit, cached data):
  - Stale data shown immediately (from SWR cache)
  - Subtle skeleton overlay on widgets that are refetching
  - No full-page skeleton

SKELETON DURATION:
  Initial load: shown for minimum 300ms (avoids flash)
  Data fetch: skeleton replaced when data arrives
  Timeout: 10s → show error state if no response

SKELETON COMPONENTS (existing, from @promptpilot/ui):
  CardSkeleton:     Card outline + 3 shimmer lines
  TableSkeleton:    5 rows × 4 columns shimmer
  Skeleton:         Generic: text, circular, rectangular variants
```

### Offline Mode

```
DETECTION:      navigator.onLine + failed fetch detection

VISUAL:         Fixed banner at top of content area (below navbar):
                ┌──────────────────────────────────────────────────┐
                │  ⚠️ You're offline. Some features unavailable.   │
                │  (bg-warning-50, border-warning-200,             │
                │   text-warning-800, h-10)                        │
                └──────────────────────────────────────────────────┘

BEHAVIOR:
  - SWR serves cached data from previous successful fetches
  - Dashboard widgets show stale data with "Last updated X ago" indicator
  - Create/Edit actions queued (future: IndexedDB offine queue)
  - AI features disabled (API-dependent)
  - ⌘K search falls back to client-side only (no full-text search)
  - Banner auto-dismisses on 'online' event
  - Toast: "Back online. Syncing changes..."

DATA PERSISTENCE:
  SWR cache: In-memory (survives tab navigation, not page refresh)
  localStorage: User preferences, theme, recent searches, tasks
  IndexedDB (future): Offline queue for mutations, full data cache
```

### Streaming Updates

```
AI GENERATION STATUS:
  Active generations polled every 3 seconds (SSE preferred)
  AI Activity widget updates live:
    - Progress bar animates
    - Token counter increments
    - Status changes from "Generating..." to "✓ Complete" with animation

IMPLEMENTATION:
  EventSource or fetch with ReadableStream
  Fallback: polling GET /api/v1/conversations/active every 3s
  Update only changed items (React.memo + shallow comparison)
```

### Optimistic UI

```
APPLIED TO:
  Task add:         New task appears instantly. Reverts on API failure.
  Task complete:    Checkbox toggles instantly.
  Task delete:      Task disappears instantly.
  Favorite toggle:  Star updates instantly.
  Project archive:  Project hides from list instantly.
  Notification dismiss: Item fades out instantly.

ROLLBACK:
  On API failure: item reappears with shake animation
  Error toast: "Failed to {action}. Please try again."
  Original state restored from previous value

NOT APPLIED TO:
  AI generation (critical path — no optimistic)
  Authentication (critical path — no optimistic)
  Payments/billing (critical path — no optimistic)
```

### Error Handling

```
API ERROR:
  Widget-level: error state with message + retry button
    "Couldn't load projects. [Retry]"
  Full-page: only if sidebar/navbar fails (rare)
  Toast: for action failures (create, delete, update)

PERMISSION DENIED (403):
  Redirect to /dashboard if trying to access unauthorized resource
  Toast: "You don't have permission to access this."

RATE LIMITED (429):
  Toast: "Rate limit reached. Try again in X seconds."
  Countdown timer in toast
  Actions disabled during rate limit window

NETWORK ERROR:
  Offline banner
  Retry with exponential backoff (SWR default)
```

---

## 16. Permissions

### Dashboard Access Matrix

```
FEATURE                         OWNER  ADMIN  EDITOR  VIEWER
─────────────────────────────────────────────────────────────
View dashboard                  ✅     ✅     ✅      ✅
View own stats                  ✅     ✅     ✅      ✅
View workspace stats            ✅     ✅     ✅      ✅ (own workspaces)
Create project                  ✅     ✅     ✅      ❌
Create workspace                ✅     ✅     ✅      ❌
Open AI Chat                    ✅     ✅     ✅      ✅
View recent projects (own)      ✅     ✅     ✅      ✅
View AI activity feed           ✅     ✅     ✅      ✅ (own projects)
View favorites                  ✅     ✅     ✅      ✅
Manage tasks                    ✅     ✅     ✅      ✅
View workspace summary          ✅     ✅     ✅      ✅ (aggregated)
View usage overview             ✅     ✅     ✅      ❌ (or own only)
Receive notifications           ✅     ✅     ✅      ✅
Use global search               ✅     ✅     ✅      ✅ (scoped to permissions)
Access command palette          ✅     ✅     ✅      ✅
Access settings                 ✅     ✅     ✅      ✅ (own settings)
View team activity (future)     ✅     ✅     ❌      ❌
Manage team (future)            ✅     ✅     ❌      ❌

PLATFORM ADMIN:
  View all workspaces           ✅
  View all projects             ✅
  View system analytics         ✅
  Manage users                  ✅

VIEWER:
  Can view: dashboard, projects they have access to, documents
  Cannot: create, edit, delete, generate
  Widgets adapt: "Generate" buttons hidden. "Create" buttons hidden.
  Quick Actions: limited to view-only actions (Browse Templates, View Activity)
```

### Context-Dependent UI

```
WIDGET ADAPTATION:
  Quick Actions:        "Generate" buttons hidden for Viewer
  Continue Working:     Shown — viewer can resume viewing
  Recent Projects:      Shown — filtered to accessible projects
  AI Activity:           Shown — filtered to accessible projects
  Workspace Summary:    Shown — aggregated for accessible workspaces
  Favorites:            Shown — personal favorites
  AI Recommendations:   Shown — limited to view recommendations (not "Generate")
  Usage Overview:        Hidden for Viewer (irrelevant)
  Tasks:                 Shown — personal tasks (not project-tied)

BUTTON STATES:
  Disabled:   greyed out with tooltip "You need Editor access or higher"
  Hidden:     Not rendered at all (cleaner UI)
  Choice:     Hidden for Viewer (less clutter). Disabled for Editor with upgrade prompt.
```

---

## 17. API Design

### Dashboard Stats API

```
GET /api/v1/dashboard/stats
Authorization: Bearer {accessToken}
Cookie: accessToken={token}

Response 200:
{
  "success": true,
  "data": {
    "workspaces": 2,
    "projects": 8,
    "documents": 32,
    "generations": 45,
    "tokensUsed": 125000,
    "totalCost": 0.42,
    "unreadNotifications": 3
  }
}

Error 401: { success: false, error: { code: "UNAUTHORIZED", message: "..." } }

CACHING:
  SWR stale-while-revalidate
  Stale: 30 seconds
  Revalidate on: focus, reconnect, mount
  Deduplication: same request within 2 seconds → single API call

OPTIMISTIC UPDATES: None (read-only data)
RETRY: Exponential backoff: 1s, 2s, 4s, 8s, max 30s
```

### Recent Projects API

```
GET /api/v1/projects?sort=recent&limit=5
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mobile App Redesign",
      "slug": "mobile-app-redesign",
      "description": "...",
      "workspaceId": "uuid",
      "workspaceName": "Acme Corp",
      "status": "ACTIVE",
      "documentCount": 9,
      "completedSteps": 4,
      "totalSteps": 9,
      "updatedAt": "2026-07-21T12:00:00Z"
    }
  ],
  "meta": { "total": 8, "page": 1, "limit": 5 }
}

CACHING: SWR, 30s stale time
OPTIMISTIC: Archive action optimistic (hide from list)
RETRY: SWR automatic retry, 3 attempts
```

### AI Activity API

```
GET /api/v1/conversations?sort=recent&limit=10
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "projectName": "Mobile App Redesign",
      "stepId": "srs",
      "stepName": "SRS",
      "status": "ACTIVE",
      "model": "gpt-4o",
      "totalInputTokens": 1500,
      "totalOutputTokens": 3400,
      "totalCost": 0.12,
      "startedAt": "2026-07-21T11:58:00Z",
      "completedAt": null
    }
  ],
  "meta": { "total": 45, "page": 1, "limit": 10 }
}

POLLING: Every 3 seconds for ACTIVE conversations
         SWR revalidate on focus
STREAMING (future SSE): EventSource for real-time token updates
```

### User Preferences API

```
GET /api/v1/auth/me (already built — includes preferences)
PATCH /api/v1/auth/profile
{
  "preferences": {
    "favorites": ["project-uuid-1", "document-uuid-2"],
    "pinnedProjects": ["project-uuid-3"],
    "dashboardWidgets": ["recent", "activity", "tasks", "stats"],
    "sidebarCollapsed": false
  }
}

Response 200:
{ "success": true, "data": { "user": { ... } } }

OPTIMISTIC: Yes — UI updates instantly
RETRY: Once on failure, then revert
```

### Tasks API (future)

```
GET /api/v1/user/tasks
POST /api/v1/user/tasks
PATCH /api/v1/user/tasks/:id
DELETE /api/v1/user/tasks/:id

(Stored in user.preferences JSON for MVP)
```

### Notifications API

```
GET /api/v1/notifications?page=1&limit=20
Authorization: Bearer {accessToken}

Response 200:
{
  "success": true,
  "data": [Notification[]],
  "meta": { "total": 15, "unread": 3, "page": 1, "limit": 20 }
}

PATCH /api/v1/notifications/:id/read
Response: { "success": true }

POST /api/v1/notifications/mark-all-read
Response: { "success": true }

POLLING: Every 30 seconds for new notification count
         Bell badge updates optimistically on dismiss
```

---

## 18. Database Mapping

### Dashboard Widgets → Database

```
WELCOME HERO:
  user.name, user.email                            → User table (via /auth/me)
  lastAccessedWorkspace, lastAccessedProject       → localStorage + User preferences
  time-of-day greeting                             → Client-side calculation

QUICK ACTIONS:
  No DB — static actions. Navigation targets only.

CONTINUE WORKING:
  recentProjects + recentConversations             → Project + AIConversation tables
  ordered by last accessed (updatedAt or accessedAt)
  Query: SELECT * FROM projects WHERE ownerId = :userId AND deletedAt IS NULL
         ORDER BY updatedAt DESC LIMIT 6

RECENT PROJECTS:
  Project table                                     → projects
  Workspace name                                    → workspaces (JOIN)
  Document count                                    → documents (COUNT subquery)
  Pipeline progress                                 → documents.status aggregation
  Query: same as Continue Working, limited to 5

AI ACTIVITY:
  AIConversation table                              → ai_conversations
  Project name                                      → projects (JOIN)
  Live status updates                               → Poll conversation status
  Query: SELECT * FROM ai_conversations
         WHERE project.ownerId = :userId
         ORDER BY startedAt DESC LIMIT 10

WORKSPACE SUMMARY:
  Aggregated counts across all user's workspaces:
    - workspaceCount:   COUNT workspaces WHERE ownerId
    - projectCount:     COUNT projects WHERE ownerId
    - documentCount:    COUNT documents WHERE project.ownerId
    - generationCount:  COUNT generations WHERE conversation.project.ownerId
    - tokensUsed:       SUM(generations.totalTokens)
    - totalCost:        SUM(generations.cost)

FAVORITES:
  User.preferences JSON field                       → users.preferences
  Or separate table: user_favorites (future for scalability)
  Stored as array of { type: 'project'|'document', id: string }

USAGE OVERVIEW:
  Plan limits from config or subscription table     → subscriptions (future)
  Usage counts from dashboard stats aggregation

TASKS:
  User.preferences JSON field (tasks array)         → users.preferences
  Schema: { id: string, title: string, completed: boolean, createdAt: ISO string }

NOTIFICATIONS:
  Notification table                                → notifications
  Index: (userId, read), (createdAt)
  Query: SELECT * FROM notifications
         WHERE userId = :userId
         ORDER BY createdAt DESC LIMIT 20
```

### Key Database Relationships

```
User ─── owns ───▶ Workspace[] ─── contains ───▶ Project[] ─── has ───▶ Document[]
                                                                          │
User ─── owns ───▶ Project[] (direct)                                    │
                                                                          ▼
User ─── has ───▶ Notification[]                                DocumentVersion[]
                                                                          │
User ─── has ───▶ Session[] (future)                                      ▼
                                                                   AIConversation
User ─── has ───▶ OAuthAccount[] (future)                               │
                                                                          ▼
                                                                   Message[]
                                                                          │
                                                                          ▼
                                                                   Generation[]
```

### Indexes Used by Dashboard Queries

```
users:              id (PK), email (unique)
workspaces:         ownerId, (ownerId, slug) unique
projects:           ownerId, workspaceId, (workspaceId, slug) unique, status
documents:          projectId, (projectId, stepId) unique, status
ai_conversations:   projectId, (projectId, status)
generations:        conversationId, createdAt
notifications:      (userId, read), createdAt
```

### Caching Strategy

```
SWR (client-side):
  Dashboard stats:      stale 30s, revalidate on focus/mount
  Recent projects:      stale 30s
  AI activity:          stale 10s (active), stale 60s (completed)
  Notifications:        stale 60s, poll unread count every 30s
  User preferences:     stale 5min

SERVER-SIDE (future Redis):
  Dashboard stats aggregated per user → cached 60s
  Invalidate on: project.create, project.delete, document.generate, generation.complete

OPTIMISTIC UPDATES:
  Local state updated before API confirmation
  On API success: cache reconciled
  On API failure: state reverted, error toast shown
```

### Pagination

```
ALL LIST ENDPOINTS:
  Query params:     ?page=1&limit=20
  Response meta:    { total, page, limit, totalPages }
  Default limit:    20
  Max limit:        100

DASHBOARD-SPECIFIC:
  Recent projects:     limit 5 (no pagination — "View All" links to /projects)
  AI activity:         limit 10 (no pagination — "View All" links to /activity)
  Notifications panel: limit 20 (scroll to load more — offset-based)
```

---

## 19. Accessibility

### WCAG 2.2 AA Compliance

```
COLOR CONTRAST:
  Body text (#334155 on #F8FAFC):               9.1:1 ✅
  Welcome hero text (#111827 on #EEF2FF):       13.2:1 ✅
  Stat numbers (#4F46E5 on #F8FAFC):            5.2:1 ✅
  Widget titles (#111827 on #FFFFFF):           15.4:1 ✅
  Sidebar active item (#4338CA on #EEF2FF):     7.3:1 ✅
  Badge text (#4338CA on #EEF2FF):              7.3:1 ✅
  Muted text (#6B7280 on #F8FAFC):              5.2:1 ✅
  All interactive elements:                     ≥ 3:1 for icons/controls ✅

KEYBOARD NAVIGATION:
  Tab order:          Sidebar → Navbar breadcrumbs → Search → Notifications →
                      Theme → User → Dashboard content (left→right, top→bottom)
  Skip link:          "Skip to dashboard content" (visually hidden, first focusable)
  Command Palette:    ⌘K opens. Arrow keys navigate. Enter selects. Esc closes.
                      Focus trapped within palette when open.
  Sidebar:            Tab between items. Enter to navigate.
  Quick Actions:      Tab between cards. Enter to activate.
  Task list:          Tab between checkboxes. Space to toggle. Enter to edit.
                      Delete button reachable via Tab.
  Notifications:      Tab between items. Enter to open. Delete with Delete key.
  Widgets:            All interactive elements reachable via Tab.
  Drag & Drop:        Not keyboard-accessible (future: provide cut/paste alternative)

FOCUS INDICATION:
  Global:             focus-visible: outline-2 outline-primary-500 outline-offset-2
  Cards:              Ring appears around entire card on focus-visible
  Sidebar items:      Ring on individual items
  Buttons:            Ring + subtle glow
  Inputs:             Ring + primary border
  No focus trap:      Except Command Palette modal (intentional)

ARIA:
  Sidebar:            <nav aria-label="Main navigation">
  Widget cards:       <section aria-labelledby="widget-title">
  Command Palette:    role="dialog", aria-modal="true", aria-label="Command palette"
  Search results:     role="listbox", role="option" on items, aria-selected
  Notifications:      role="list", aria-label="Notifications"
  Progress bars:      role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
  Stat boxes:         (no special role — they're static numbers)
  Task list:          role="list" with role="listitem"
  Toast:              role="alert", aria-live="assertive"
  Loading:            aria-busy="true" on loading containers
  Empty states:       role="status"

SCREEN READERS:
  Page title:         <h1> from Welcome Hero (announced first)
  Section hierarchy:  <h2> for widget titles, <h3> for card titles
  Live regions:       AI Activity uses aria-live="polite" for new items
  Status updates:     "Generating PRD... 34% complete" announced at intervals
  Actions:            All buttons have descriptive labels
  Icons:              aria-hidden="true" on decorative. aria-label on icon-only buttons.
  Navigation:         Current page indicated with aria-current="page"

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce):
    - No count-up animation on stat numbers (show final value)
    - No progress bar fill animation (show final width)
    - No card hover transform (show color change only)
    - No skeleton shimmer (show static grey)
    - No toast slide-in (show static)
    - No AI generating pulse (show static dot)
    - No page transition fades
```

---

## 20. Responsive Design

### Desktop (≥1280px)

```
LAYOUT:       Sidebar 240px + Content max-w-1200px centered
GRID:         2-column (2/3 + 1/3) for main widgets
QUICK ACTIONS: 6-column auto-fit (6 across or wrap)
WELCOME:      Full-width gradient banner
NAVBAR:       Full horizontal, all elements visible
SIDEBAR:      Expanded (240px), labels + shortcuts visible
TOASTS:       Bottom-right, max-w-400px
COMMAND PALETTE: Centered modal, max-w-560px
```

### Laptop (1024–1279px)

```
LAYOUT:       Sidebar 240px + Content full-width
GRID:         2-column for widgets
QUICK ACTIONS: 4-5 across
WELCOME:      Same as desktop
NAVBAR:       Same as desktop
SIDEBAR:      Expanded (240px) — still fits at 1024px
```

### Tablet (768–1023px)

```
LAYOUT:       Collapsed sidebar (64px, icons only) + Content full-width
GRID:         1-column stacked for all widgets
QUICK ACTIONS: 3-4 across
WELCOME:      Smaller padding (p-6), stacked CTAs
NAVBAR:       Full navigation. Hamburger hidden (enough space).
SIDEBAR:      Collapsed. Icons only. Tooltip on hover reveals label.
              Toggle button to expand (temporary overlay).
CONTINUE:     Horizontal scroll with snap points. Scroll buttons visible.
```

### Mobile (<768px)

```
LAYOUT:       No sidebar. Full-width content, p-4.
              Sidebar becomes overlay (hamburger toggle in navbar).
GRID:         1-column for ALL content.
QUICK ACTIONS: 2-column grid (3 rows). Compact cards.
WELCOME:      Minimal. "Welcome back, Jane 👋" + primary CTA only.
              No gradient background. Flat bg.
NAVBAR:       Simplified. Logo + hamburger + search icon + user.
              Breadcrumbs: hidden (only show on detail pages, not dashboard).
SIDEBAR:      Overlay. Slide from left. Backdrop. Dismiss on tap outside or navigation.
CONTINUE:     Horizontal scroll. No scroll buttons (swipe gesture).
STATS:        2×2 grid. Compact stat boxes.
ACTIVITY:     Stacked list items.
FAVORITES:    Stacked list.
AI RECS:      Stacked cards.
TASKS:        Compact list.

BOTTOM NAV:   Fixed at bottom. 4 tabs:
              🏠 Home  📁 Workspaces  🤖 AI  👤 Profile
              h-14, bg-white, border-t. Safe area padding on iOS.
              Current tab: primary-600 icon + label
              Other tabs: neutral-400 icon + label
              Hides on scroll down, shows on scroll up (like mobile Safari).
```

### Ultra-Wide (≥1920px)

```
LAYOUT:       Sidebar 240px + Content max-w-1400px centered
GRID:         3-column for widgets possible (2/3 + 1/3 still works)
              Or: card grid becomes wider — 4-column for features
WELCOME:      Wider gradient banner. Larger padding.
FONT:         Same font sizes (capped at desktop sizes for readability).
```

---

## 21. Animations

### Page Load Animations

```
TIMELINE (first load):
  0ms:      Sidebar + Navbar render (part of layout, always present)
  100ms:    Welcome Hero fades in (opacity 0 → 1, 400ms ease)
  300ms:    Quick Actions stagger in (6 cards, 50ms stagger each, fade + slideUp 8px)
  600ms:    Continue Working carousel fades in
  700ms:    Recent Projects fades in
  800ms:    Workspace Summary stat boxes stagger in
  900ms:    AI Activity fades in
  1000ms:   Favorites fades in
  1100ms:   Tasks section fades in

SUBSEQUENT VISITS:
  All content appears immediately (SWR cache)
  Only refetching widgets show subtle skeleton overlay
  No entrance animations (avoids visual noise on repeat visits)
```

### Widget Animations

```
WELCOME HERO:
  Load:           Fade in (opacity 0→1, 400ms)
  Greeting:       Word-by-word stagger if first visit (future)
  CTA buttons:    Scale 0.95→1 with spring (200ms, 100ms stagger)

QUICK ACTIONS:
  Load:           Staggered fade + slideUp (50ms per card)
  Hover:          translateY(-2px), box-shadow md (150ms ease)
  Click:          scale(0.97) on mousedown, spring back (100ms)

RECENT PROJECTS:
  New item:       Slide down + fade in (300ms, [0.4, 0, 0.2, 1])
  Archive:        Slide left + fade out (250ms ease-in)
  Hover:          bg shift (150ms)
  Pipeline bar:   Width transition on progress change (600ms ease-out)

AI ACTIVITY:
  New item:       Slide down + fade in (300ms)
  Generating:     Pulsing dot (scale 1→1.3→1, 2s infinite)
  Complete:       Dot color green + checkmark spring (300ms)
  Failed:         Dot color red + subtle shake (400ms)

STAT BOXES:
  Load:           Numbers count up from 0 (IntersectionObserver, 800ms ease-out)
  Update:         Number changes with crossfade (300ms)

FAVORITES:
  Star toggle:    Scale bounce (0→1.2→1, 200ms spring)
  Remove:         Fade out + collapse height (250ms)

TASKS:
  Add:            Slide down + fade in (200ms)
  Complete:       Strikethrough animation (line draws left→right, 300ms)
  Delete:         Slide left + fade out + collapse (250ms)

AI RECOMMENDATIONS:
  Card hover:     translateY(-2px), shadow (150ms)
  New card:       Fade in + slide up (300ms stagger)
```

### Notification & Toast Animations

```
TOAST:
  Enter:          Slide in from right + fade (300ms, spring)
  Exit:           Slide right + fade out (250ms, ease-in)
  Stack:          Existing toasts slide up to make room (200ms)

NOTIFICATION DROPDOWN:
  Open:           Scale 0.95→1 + fade in (200ms, spring)
                  Transform origin: top-right
  Close:          Scale 1→0.95 + fade out (150ms, ease-in)
  Item dismiss:   Slide right + fade (200ms)

COMMAND PALETTE:
  Open:           Scale 0.95→1 + fade in backdrop (200ms, spring)
  Close:          Scale 1→0.95 + fade out backdrop (150ms, ease-in)
  Result hover:   bg shift (100ms)
  No results:     Fade in with delay (300ms)
```

### Hover & Micro-Interactions

```
ALL BUTTONS:
  Hover:   bg darken + shadow strengthen (150ms)
  Active:  scale(0.98) (100ms)

ALL CARDS:
  Hover:   border-color shift + box-shadow appear (150ms)
  Click:   scale(0.99) (50ms)

SIDEBAR ITEMS:
  Hover:   bg-neutral-100 (150ms)
  Active:  bg-primary-50 + left border (150ms)
  Badge:   Scale pulse on count change

NAVBAR ITEMS:
  Notification bell: Subtle swing on new notification (rotate ±5deg, 300ms)
  Theme toggle:      Icon rotate 180° + scale (250ms spring)
  User avatar:       Scale 1.05 on hover (150ms)

PROGRESS BARS:
  Fill:    Width transition (600ms ease-out)
  Color:   Interpolates from primary-600 → warning-500 → error-500 as it fills

LOADING SKELETON:
  Shimmer: Gradient position moves (200% to -200%, 1.5s infinite)
```

---

## 22. Performance

### Lazy Loading

```
SPLIT POINTS:
  Below-fold widgets:     Lazy-loaded via dynamic import + IntersectionObserver
    - AI Activity         (loaded when scrolled into view)
    - Tasks               (loaded when scrolled into view)
    - Usage Overview      (loaded when scrolled into view)
  Command Palette:        Dynamic import (only loaded on ⌘K trigger)
  Notifications dropdown: Lazy-load content on bell click
  Modals/Dialogs:         Dynamic import per dialog type

ABOVE-FOLD (loaded immediately):
  - Sidebar + Navbar      (layout — required)
  - Welcome Hero          (first visible content)
  - Quick Actions         (above fold on most screens)
  - Recent Projects       (above fold)
  - Workspace Summary     (above fold on desktop)
  - Favorites             (above fold on desktop)
```

### Code Splitting

```
NEXT.JS DYNAMIC IMPORTS:
  const AIActivity = dynamic(() => import('@/components/dashboard/AIActivity'), {
    loading: () => <CardSkeleton lines={3} />,
    ssr: true  // SSR for initial render, client hydration
  })

  const TasksSection = dynamic(() => import('@/components/dashboard/TasksSection'))
  const UsageOverview = dynamic(() => import('@/components/dashboard/UsageOverview'))

BUNDLE ANALYSIS:
  Dashboard page initial JS: < 40KB gzipped
  Lazy-loaded chunks:        < 20KB each
  Shared UI components:      < 30KB (cached across pages)
```

### Virtualization

```
VIRTUAL SCROLLING:
  Not needed for dashboard widgets (bounded items):
    - Recent projects: max 5
    - AI activity: max 10
    - Favorites: variable but typically < 20
    - Tasks: variable but typically < 50

  Needed for:
    - Full projects page (100+ items) → react-virtuoso or @tanstack/virtual
    - Full activity page (100+ items)
    - Document list (if 50+ documents per project)
```

### Caching

```
SWR CONFIGURATION:
  const { data, error } = useSWR('/api/v1/dashboard/stats', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,     // 2s dedup window
    errorRetryCount: 3,
    errorRetryInterval: 5000,   // 5s between retries
    focusThrottleInterval: 5000 // 5s throttle on focus
  })

MEMOIZATION:
  React.memo on all cards: StatBox, ProjectCard, ActivityItem, QuickActionCard
  useMemo for filtered/sorted lists
  useCallback for event handlers passed to children

PREFETCHING:
  <Link prefetch> on sidebar items (preloads next page)
  Hover prefetch on project links (future: instant navigation)
```

### Real-Time Updates

```
AI GENERATION STATUS:
  Polling: GET /api/v1/conversations/active every 3s (only if active generations exist)
  SSE (future): EventSource for live token streaming, progress updates
  WebSocket (future): Bidirectional real-time for collaboration features

NOTIFICATIONS:
  Polling: GET /api/v1/notifications/count every 30s
  SSE (future): Push new notifications in real-time

OPTIMIZATION:
  Poll only when tab is visible (document.visibilityState check)
  Reduce poll frequency when tab is hidden (3s → 30s)
  Stop polling completely after 5 minutes of inactivity
```

### Image Optimization

```
AVATARS:
  next/image with width/height
  Format: WebP with PNG fallback
  Size: 32×32 (navbar), 40×40 (sidebar user), 96×96 (settings)
  Placeholder: blur (generated at build) or initials fallback

ICONS:
  Lucide React — inline SVG, no additional requests
  Emoji icons — native rendering, no downloads

ILLUSTRATIONS:
  Empty states: inline SVG or lightweight PNG
  Loading states: CSS-only skeleton (no images)
```

---

## 23. Future Scalability

### Organizations

```
MULTI-WORKSPACE ENTERPRISE:
  Organization model (Phase 5):
    Organization ──owns──▶ Workspace[] ──contains──▶ Project[]

  DASHBOARD CHANGES:
    Organization Overview widget: aggregate stats across all org workspaces
    Workspace selector: filter dashboard by workspace or "All Workspaces"
    Team Activity: cross-workspace activity feed
    Member Overview: all members across org workspaces
    Usage: aggregated billing/usage across organization

  NAVIGATION:
    Sidebar: "🏢 My Org" with collapsible workspace list underneath
    Workspace Switcher: dropdown with search + org grouping
    Breadcrumbs: include org context (Org > Workspace > Project)
```

### Multiple Workspaces

```
WORKSPACE SWITCHER:
  Dropdown in sidebar header
  ⌘1, ⌘2, ⌘3 shortcuts for first 3 workspaces
  Searchable in ⌘K

DASHBOARD FILTERING:
  "Showing data for: [All Workspaces ▼]"
  Filter all widgets by selected workspace(s)
  Stats re-aggregate based on filter
  Recent Projects filtered by selected workspace
```

### AI Agents (Phase 6+)

```
DASHBOARD INTEGRATION:
  Agent Activity widget: status of running AI agents
  Agent Recommendations: "Deploy the Code Review agent for your API Spec"
  Agent Marketplace suggestions: "3 new agents for architecture review"

QUICK ACTIONS:
  "Run Agent" action
  "Configure Agent" shortcut
```

### Marketplace (Phase 5+)

```
DASHBOARD INTEGRATION:
  Marketplace Suggestions widget: "Popular templates for FinTech"
  "Trending this week" section
  "New plugins for your workflow"

QUICK ACTIONS:
  "Browse Marketplace" action
```

### Plugin Ecosystem (Phase 5+)

```
DASHBOARD INTEGRATION:
  Installed Plugins widget (sidebar or dashboard section)
  Plugin notifications: "Plugin X has an update"
  Plugin status indicators

SIDEBAR:
  Plugin-specific navigation items (registered by plugins)
```

### Enterprise Analytics (Phase 5+)

```
DEDICATED ANALYTICS PAGE:
  /analytics — full analytics dashboard
  Charts: token usage over time, generation velocity, team productivity
  Exportable reports
  Drill-down: Organization → Workspace → Project → Document

DASHBOARD WIDGET:
  Mini analytics: "Token Usage This Week" sparkline chart
  "Team Velocity" metric
```

### Billing Dashboard (Phase 4+)

```
DEDICATED BILLING PAGE:
  /settings/billing
  Current plan, usage, invoices, payment methods
  Upgrade/downgrade flow
  Usage alerts configuration

DASHBOARD WIDGET:
  Usage Overview widget (already designed — see Widget 9)
  Upgrade prompt when approaching limits
```

### Admin Console (Phase 5+)

```
PLATFORM ADMIN:
  /admin — separate admin interface
  User management: list, search, suspend, delete
  Workspace management: view all, transfer ownership
  System health: API metrics, error rates, AI provider status
  Audit log viewer

DASHBOARD (for admins):
  Admin-specific widgets: "Pending Approvals", "System Alerts", "User Growth"
  Accessible via sidebar or separate admin navigation
```

---

## 24. React Component Hierarchy

```
Dashboard
│
├── AppLayout (apps/frontend/app/(app)/layout.tsx) ✅ Built
│   ├── AuthProvider ✅ Built
│   ├── ToastProvider ✅ Built
│   ├── LayoutProvider ✅ Built
│   ├── NavigationProvider ✅ Built
│   ├── Sidebar ✅ Built
│   │   ├── Logo + CollapseToggle
│   │   ├── MainNavItems (Dashboard, Workspaces, Projects)
│   │   ├── ContextNavItems (conditional — Workspace/Project sub-nav)
│   │   ├── AIWorkspaceNavItems (Templates, Conversations, History)
│   │   └── BottomNavItems (Activity, Settings, Help)
│   ├── Navbar ✅ Built
│   │   ├── MobileToggle (hamburger)
│   │   ├── Breadcrumbs ✅ Built
│   │   ├── CommandPaletteTrigger (⌘K Search button)
│   │   ├── AIStatusIndicator (future)
│   │   ├── NotificationsBell
│   │   │   └── NotificationsDropdown
│   │   │       ├── NotificationItem[]
│   │   │       ├── MarkAllReadButton
│   │   │       └── ViewAllLink
│   │   ├── ThemeToggle
│   │   ├── HelpMenu
│   │   │   └── HelpDropdown
│   │   └── UserMenu
│   │       └── UserDropdown
│   │           ├── UserInfo
│   │           ├── MenuItem[] (Settings, Workspaces, Billing, API Keys, Theme)
│   │           └── SignOutButton
│   └── CommandPalette ✅ Built
│       ├── SearchInput
│       ├── CommandGroup[] (Navigation, Actions, Search, Recent)
│       │   └── CommandItem[]
│       └── NoResultsState
│
├── DashboardPage (apps/frontend/app/(app)/dashboard/page.tsx) ✅ Built — Extension
│   │
│   ├── WelcomeHero ✅ Built
│   │   Props: user, lastContext
│   │   ├── Greeting (time-of-day + name)
│   │   ├── ContextLine (last workspace/project)
│   │   └── CTAGroup
│   │       ├── NewProjectButton (primary)
│   │       ├── OpenWorkspaceButton (secondary)
│   │       └── ResumeButton (ghost, conditional)
│   │
│   ├── QuickActions ✅ Built
│   │   Props: (static)
│   │   └── QuickActionCard[]
│   │       Props: icon, label, href, color
│   │
│   ├── DashboardGrid (2-column responsive grid)
│   │   │
│   │   ├── ContinueWorking (P1 — NEW)
│   │   │   Props: recentItems[]
│   │   │   └── ContinueCard[]
│   │   │       Props: icon, title, subtitle, timestamp, href
│   │   │
│   │   ├── RecentProjects ✅ Built
│   │   │   Props: projects[], loading, error
│   │   │   ├── CardHeader (title + "View All" link)
│   │   │   ├── ProjectCard[]
│   │   │   │   Props: project, onArchive, onDuplicate, onFavorite
│   │   │   │   ├── StatusBadge
│   │   │   │   ├── PipelineProgress (mini bar)
│   │   │   │   ├── Metadata (workspace, docs count, timestamp)
│   │   │   │   └── ActionButtons (Open, ContextMenu)
│   │   │   └── EmptyState (conditional)
│   │   │
│   │   ├── WorkspaceSummary ✅ Built
│   │   │   Props: stats, loading
│   │   │   ├── CardHeader (title)
│   │   │   └── StatBox[]
│   │   │       Props: label, value, icon?
│   │   │
│   │   ├── AIActivity ✅ Built
│   │   │   Props: activity[], loading
│   │   │   ├── CardHeader (title + "View All" link)
│   │   │   ├── ActivityTimeline
│   │   │   │   └── ActivityItem[]
│   │   │   │       Props: type, project, step, status, tokens, model, timestamp
│   │   │   │       ├── StatusIndicator (pulsing dot / checkmark / X)
│   │   │   │       ├── ItemDetails
│   │   │   │       └── ActionLink (View / Retry)
│   │   │   └── EmptyState (conditional)
│   │   │
│   │   ├── Favorites ✅ Built
│   │   │   Props: favorites[], loading
│   │   │   ├── CardHeader (title)
│   │   │   ├── FavoriteItem[]
│   │   │   │   Props: item, onUnfavorite
│   │   │   └── EmptyState (inline)
│   │   │
│   │   ├── AIRecommendations (P1 — NEW)
│   │   │   Props: recommendations[]
│   │   │   └── RecommendationCard[]
│   │   │       Props: icon, title, description, action
│   │   │
│   │   └── UsageOverview (P2 — NEW)
│   │       Props: plan, usage, limits
│   │       ├── UsageBar[]
│   │       │   Props: label, used, limit, unit
│   │       └── UpgradePrompt (conditional)
│   │           Props: plan, features
│   │
│   └── TasksSection ✅ Built
│       Props: tasks, onAdd, onToggle, onDelete
│       ├── CardHeader (title + "Clear Done")
│       ├── TaskInput
│       │   Props: value, onChange, onSubmit, error
│       ├── TaskList
│       │   └── TaskItem[]
│       │       Props: task, onToggle, onDelete
│       │       ├── Checkbox
│       │       ├── TaskLabel (strikethrough when complete)
│       │       └── DeleteButton
│       └── EmptyState (conditional)
│
└── ToastContainer ✅ Built
    Props: (from ToastContext)
    └── ToastItem[]
        Props: type, title, description, action, onDismiss
```

### File Map (What Exists vs. What's New)

```
apps/frontend/
├── app/(app)/
│   ├── layout.tsx                         ✅ Built (App Shell)
│   └── dashboard/
│       └── page.tsx                       ✅ Built (Dashboard Content)
│
├── components/
│   ├── sidebar/
│   │   └── Sidebar.tsx                    ✅ Built (needs Tailwind + workspace switcher)
│   ├── nav/
│   │   ├── Navbar.tsx                     ✅ Built
│   │   ├── Breadcrumbs.tsx                ✅ Built
│   │   └── CommandPalette.tsx             ✅ Built
│   ├── feedback/
│   │   ├── EmptyState.tsx                 ✅ Built
│   │   ├── Skeleton.tsx                   ✅ Built
│   │   ├── ToastProvider.tsx              ✅ Built
│   │   └── ProgressBar.tsx                ✅ Built
│   ├── LayoutContext.tsx                  ✅ Built
│   ├── NavigationContext.tsx              ✅ Built
│   │
│   └── dashboard/                         🔜 NEW DIRECTORY
│       ├── WelcomeHero.tsx                🔜 Extract from page.tsx
│       ├── QuickActions.tsx               🔜 Extract from page.tsx
│       ├── ContinueWorking.tsx            🔜 New
│       ├── ContinueCard.tsx               🔜 New
│       ├── RecentProjects.tsx             🔜 Extract from page.tsx
│       ├── ProjectCard.tsx               🔜 New
│       ├── WorkspaceSummary.tsx           🔜 Extract from page.tsx
│       ├── StatBox.tsx                    🔜 Extract from page.tsx
│       ├── AIActivity.tsx                 🔜 Extract from page.tsx
│       ├── ActivityItem.tsx              🔜 New
│       ├── Favorites.tsx                  🔜 Extract from page.tsx
│       ├── AIRecommendations.tsx          🔜 New
│       ├── UsageOverview.tsx              🔜 New
│       ├── TasksSection.tsx               🔜 Extract from page.tsx
│       ├── AIStatusIndicator.tsx          🔜 New
│       ├── NotificationsBell.tsx          🔜 New
│       ├── NotificationsDropdown.tsx      🔜 New
│       ├── WorkspaceSwitcher.tsx          🔜 New
│       ├── ThemeToggle.tsx                🔜 New
│       ├── UserMenu.tsx                   🔜 New
│       ├── HelpMenu.tsx                   🔜 New
│       └── BottomNav.tsx                  🔜 New (mobile)
│
├── hooks/
│   ├── useDashboardStats.ts              🔜 New (SWR wrapper)
│   ├── useRecentProjects.ts              🔜 New
│   ├── useAIActivity.ts                  🔜 New
│   ├── useNotifications.ts               🔜 New
│   └── useTimeOfDay.ts                   🔜 New
│
└── lib/
    └── navigation/
        └── routes.ts                      ✅ Built
```

---

## 25. UX Best Practices

### Why Every Section Exists

```
The dashboard is NOT a dumping ground for all possible data. Each widget justifies
its presence through a specific user need and business objective.

WELCOME HERO:
  Need: "Am I in the right place? What should I do first?"
  Solution: Personalized greeting confirms identity. Primary CTAs answer "what now?"

QUICK ACTIONS:
  Need: "I want to start something new but don't want to navigate menus."
  Solution: Single-click creation. All high-value actions within thumb reach.

CONTINUE WORKING:
  Need: "I was working on something. Where did I leave off?"
  Solution: Immediate resume of last activity. Zero navigation required.

RECENT PROJECTS:
  Need: "What projects do I have? What's their status?"
  Solution: Spatial memory. Users recognize projects by name, not ID. Status at a glance.

AI ACTIVITY:
  Need: "Is my AI generation done? What's been happening?"
  Solution: Builds trust by showing AI work product. Real-time status reduces anxiety.

WORKSPACE SUMMARY:
  Need: "How much have I accomplished?"
  Solution: Quantified value. Numbers create satisfaction and reinforce ROI.

FAVORITES:
  Need: "I have specific things I access often. Don't make me search."
  Solution: User-curated shortcuts. Respects user agency.

AI RECOMMENDATIONS:
  Need: "What should I do next? What features haven't I tried?"
  Solution: Guided discovery. Reduces paralysis. Drives feature adoption.

USAGE OVERVIEW:
  Need: "Am I close to my limit? Should I upgrade?"
  Solution: Transparent usage. Natural upgrade path. No surprise limits.

TASKS:
  Need: "I need to track what I still need to do."
  Solution: Lightweight task tracking. Keeps users in-platform instead of switching tools.
```

### Navigation Flow & Cognitive Load

```
PRINCIPLE 1: Recognition over Recall
  - Users recognize their projects by name (Recent Projects widget)
  - Users recognize their recent work (Continue Working carousel)
  - They don't need to recall URLs, project IDs, or navigation paths

PRINCIPLE 2: Fitts's Law — Bigger + Closer = Faster
  - Primary CTAs are large and near top-left (natural eye path)
  - Quick Actions are large tappable targets (150px min width)
  - ⌘K is accessible from anywhere without leaving keyboard

PRINCIPLE 3: Hick's Law — Fewer Choices = Faster Decisions
  - Quick Actions: 6 options (not 20). Manageable cognitive load.
  - Recent Projects: top 5. Not an infinite list.
  - "View All" links for users who want exhaustive lists

PRINCIPLE 4: Progressive Disclosure
  - Dashboard shows summaries, not details
  - Clicking navigates to detail pages (project, document, conversation)
  - Complex features (settings, billing) are one click away, not on dashboard

PRINCIPLE 5: Consistency
  - Same layout as all app pages (sidebar + navbar + content)
  - Same card patterns across widgets
  - Same interaction patterns (click to navigate, hover for tooltip)
  - Users build a mental model once and reuse it

PRINCIPLE 6: Feedback
  - Every action has immediate visual feedback
  - AI generations show live progress
  - Errors show immediately with recovery options
  - Toasts confirm successful actions
```

### Solo User to Enterprise Scaling

```
SOLO USER (1 person, 1-3 projects):
  Dashboard focus:
    - Continue Working (primary)
    - AI Activity (show AI working for them)
    - Tasks (personal tracking)
  Sidebar: Simple. No workspace context needed.
  Stats: Personal productivity metrics.
  AI Recs: Feature discovery focused.

SMALL TEAM (2-10 people, 5-20 projects):
  Dashboard focus:
    - Recent Projects (shared workspace context)
    - Team Activity (who did what)
    - Notifications (invitations, comments)
    - Workspace Summary (team-level stats)
  Sidebar: Workspace switcher appears.
  Stats: Team-aggregated metrics.

ENTERPRISE (50+ people, 100+ projects, multiple workspaces):
  Dashboard focus:
    - Organization Overview (cross-workspace)
    - Usage Analytics (cost management)
    - Admin alerts (security, compliance)
    - Team Productivity (velocity metrics)
  Sidebar: Organization hierarchy. Role-based visibility.
  Stats: Enterprise-level aggregation. Exportable.
  Permissions: Role-based widget visibility.
  Customization: Admin-configurable default widgets.

SCALING MECHANISM:
  The dashboard layout is fixed (grid system).
  Widgets appear/disappear based on:
    - User role (Viewer sees fewer widgets than Admin)
    - Plan tier (Free hides Usage Overview limits, Pro shows them)
    - Team size (Team/Enterprise shows team widgets)
    - User preferences (can hide/show individual widgets)
  This means the SAME component architecture serves all tiers.
  No code fork needed — just conditional rendering based on context.
```

---

_Document Version: 1.0 — PromptPilot Enterprise Dashboard Specification_
_Last Updated: 2026-07-21_
_Status: Foundation built. Dashboard widgets ready for extraction + new widget implementation._
