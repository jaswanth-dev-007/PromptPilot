# Frontend Development Guide · PromptPilot

**Version:** 1.0.0
**Status:** Approved
**Author:** Chief Software Architect & Principal UX Designer
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0, `docs-output/09_Implementation_Plan.md` v1.0.0

---

## Important: Frontend Is Post-MVP (P3)

PromptPilot is **CLI-first**. The CLI is the product for MVP through v1.0 (Phases 0-5). All frontend work — web dashboard, VS Code extension — begins in **Phase 6 (Growth, Months 7-18)** per PRD §30.1.

This guide exists so frontend engineers understand the architecture before they're hired and have a complete blueprint when Phase 6 begins.

**Reference:** Master Context §8, PRD §5.1, §15.4, §30.1

---

## 1. Frontend Architecture Overview

The PromptPilot web dashboard is a React 19 single-page application (SPA) that communicates with the hosted backend API. It is deployed as a static site (Vercel or Cloudflare Pages) with no server-side rendering required for v1.

### 1.1 Technology Stack

| Layer                 | Technology                     | Version   | Rationale                                           | Reference              |
| --------------------- | ------------------------------ | --------- | --------------------------------------------------- | ---------------------- |
| **Framework**         | React                          | 19.x      | Server Components optional, wide ecosystem          | Industry standard      |
| **Language**          | TypeScript                     | 5.x       | Type safety, shared types with backend              | Master Context §12     |
| **Routing**           | React Router                   | 7.x       | Declarative routing, layout routes, loaders         | Web standard           |
| **Data Fetching**     | TanStack Query                 | 5.x       | Caching, refetching, optimistic updates             | Industry standard      |
| **State Management**  | Zustand                        | 5.x       | Lightweight, no boilerplate, TypeScript-first       | —                      |
| **Styling**           | Tailwind CSS                   | 4.x       | Utility-first, rapid prototyping, consistent design | PRD §10 (UI Standards) |
| **Component Library** | shadcn/ui                      | —         | Accessible, customizable, copy-paste components     | —                      |
| **Forms**             | React Hook Form + Zod          | 7.x / 3.x | Type-safe forms, shared validation with backend     | PRD §19                |
| **HTTP Client**       | Fetch API (native)             | —         | No additional dependency for simple API calls       | Master Context §15.5   |
| **Icons**             | Lucide React                   | —         | Consistent icon set, tree-shakeable                 | —                      |
| **Charts**            | Recharts                       | 2.x       | Simple, React-native charts for analytics           | PRD §24                |
| **Testing**           | Vitest + React Testing Library | —         | Same test runner as backend                         | PRD §16                |
| **E2E Testing**       | Playwright                     | —         | Cross-browser E2E for critical flows                | PRD §16                |

### 1.2 Design Tokens

All design tokens are defined in `tailwind.config.ts` and enforced by Tailwind.

| Token             | Value                          | Usage                                 |
| ----------------- | ------------------------------ | ------------------------------------- |
| **Primary**       | `#3B82F6` (blue-500)           | Primary buttons, links, active states |
| **Secondary**     | `#6B7280` (gray-500)           | Secondary buttons, muted text         |
| **Success**       | `#10B981` (emerald-500)        | Success states, confirmations         |
| **Warning**       | `#F59E0B` (amber-500)          | Warnings, stale artifact indicators   |
| **Error**         | `#EF4444` (red-500)            | Errors, destructive actions           |
| **Background**    | `#F9FAFB` (gray-50)            | Page background                       |
| **Surface**       | `#FFFFFF`                      | Cards, modals, inputs                 |
| **Border**        | `#E5E7EB` (gray-200)           | Dividers, input borders               |
| **Font Family**   | `Inter, system-ui, sans-serif` | All text                              |
| **Border Radius** | `0.5rem` (rounded-lg)          | Cards, buttons, inputs                |
| **Spacing Scale** | Tailwind default (4px base)    | All spacing                           |

---

## 2. Project Structure (Frontend)

```
promptpilot-dashboard/
├── src/
│   ├── app/                     # Route definitions and page layouts
│   │   ├── root.tsx             # Root layout (sidebar + header + outlet)
│   │   ├── auth/                # Auth pages (login, register, forgot password)
│   │   ├── dashboard/           # Dashboard home
│   │   ├── workspaces/          # Workspace list, detail, members
│   │   ├── projects/            # Project list, detail, artifacts
│   │   ├── artifacts/           # Artifact viewer, diff view
│   │   ├── reviews/             # Review queue, review detail
│   │   ├── marketplace/         # Browse, search, pack detail
│   │   ├── analytics/           # Usage, cost, quality dashboards
│   │   ├── billing/             # Plans, subscription, invoices
│   │   ├── admin/               # Workspace settings, audit logs (Enterprise)
│   │   └── settings/            # Profile, notifications, API keys
│   │
│   ├── components/              # Shared UI components
│   │   ├── ui/                  # shadcn/ui primitives (button, input, card, etc.)
│   │   ├── layout/              # Sidebar, Header, Breadcrumbs, Footer
│   │   ├── artifacts/           # ArtifactCard, ArtifactViewer, DiffViewer
│   │   ├── pipeline/            # PipelineStatus, StepCard, ProgressIndicator
│   │   ├── analytics/           # Chart components, MetricCard
│   │   └── shared/              # LoadingSpinner, ErrorBoundary, EmptyState
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Auth state, login/logout, session management
│   │   ├── use-workspace.ts     # Current workspace context
│   │   ├── use-artifacts.ts     # Artifact fetching, generation trigger
│   │   └── use-analytics.ts     # Analytics data fetching
│   │
│   ├── lib/                     # Utilities and API client
│   │   ├── api.ts               # API client (fetch wrapper with auth)
│   │   ├── auth.ts              # Token management, refresh logic
│   │   ├── utils.ts             # Formatting, date helpers, etc.
│   │   └── constants.ts         # API URLs, route paths, config
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── workspace-store.ts
│   │   └── ui-store.ts
│   │
│   └── types/                   # Shared TypeScript types
│       ├── api.ts               # API request/response types
│       ├── workspace.ts
│       ├── artifact.ts
│       └── analytics.ts
│
├── public/
│   └── favicon.svg
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 3. Route Structure

```
/                               → Landing page (unauthenticated)
/auth/login                     → Login page
/auth/register                  → Registration page
/auth/forgot-password           → Password reset request
/auth/reset-password/:token     → Password reset form
/auth/sso/callback              → SSO callback (Enterprise)

/dashboard                      → Dashboard home (authenticated)
/workspaces                     → Workspace list
/workspaces/:id                 → Workspace detail
/workspaces/:id/members         → Member management
/workspaces/:id/settings        → Workspace settings

/projects/:id                   → Project detail
/projects/:id/artifacts         → Artifact list
/artifacts/:id                  → Artifact viewer
/artifacts/:id/diff             → Diff view (compare versions)

/reviews                        → Review queue
/reviews/:id                    → Review detail

/marketplace                    → Browse prompt packs
/marketplace/search?q=          → Search results
/marketplace/:packName          → Pack detail

/analytics                      → Usage dashboard
/analytics/costs                → Cost breakdown

/settings/profile               → Profile settings
/settings/notifications         → Notification preferences
/settings/api-keys              → API key management

/billing/plans                  → Plan comparison
/billing/manage                 → Subscription management
/billing/invoices               → Invoice history

/admin                          → Admin dashboard (Enterprise)
/admin/audit-log                → Audit log viewer
/admin/sso                      → SSO configuration
```

### 3.1 Route Configuration (React Router v7)

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './app/root'
import { AuthLayout } from './app/auth/layout'
import { DashboardLayout } from './app/dashboard/layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      {
        element: <AuthLayout />,
        children: [
          { path: 'auth/login', lazy: () => import('./app/auth/login') },
          { path: 'auth/register', lazy: () => import('./app/auth/register') },
          { path: 'auth/forgot-password', lazy: () => import('./app/auth/forgot-password') },
        ]
      },
      // Authenticated routes
      {
        element: <DashboardLayout />,
        loader: requireAuth,
        children: [
          { index: true, lazy: () => import('./app/dashboard/home') },
          { path: 'workspaces', lazy: () => import('./app/workspaces/list') },
          { path: 'workspaces/:id', lazy: () => import('./app/workspaces/detail') },
          { path: 'projects/:id', lazy: () => import('./app/projects/detail') },
          { path: 'artifacts/:id', lazy: () => import('./app/artifacts/viewer') },
          { path: 'marketplace', lazy: () => import('./app/marketplace/browse') },
          { path: 'analytics', lazy: () => import('./app/analytics/dashboard') },
          { path: 'settings/*', lazy: () => import('./app/settings/layout') },
          { path: 'billing/*', lazy: () => import('./app/billing/layout') },
        ]
      }
    ]
  }
])
```

---

## 4. Core Components

### 4.1 API Client (`src/lib/api.ts`)

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.promptpilot.dev'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

class ApiClient {
  private accessToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  setToken(token: string | null) {
    this.accessToken = token
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    // Handle 401 — try token refresh
    if (response.status === 401 && this.accessToken) {
      const newToken = await this.refreshAccessToken()
      headers['Authorization'] = `Bearer ${newToken}`
      response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      })
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new ApiError(response.status, error.message, error.code)
    }

    if (response.status === 204) return undefined as T
    return response.json()
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise

    this.refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        this.accessToken = data.accessToken
        return data.accessToken
      })
      .finally(() => {
        this.refreshPromise = null
      })

    return this.refreshPromise
  }
}

export const api = new ApiClient()
```

### 4.2 Auth Flow

```typescript
// src/hooks/use-auth.ts
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): AuthState {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.request<User>('/api/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const login = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      }),
    onSuccess: data => {
      api.setToken(data.accessToken)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // ...
}
```

### 4.3 Pipeline Status Component

```typescript
// src/components/pipeline/PipelineStatus.tsx
interface PipelineStep {
  id: string
  name: string
  status: 'completed' | 'in_progress' | 'pending' | 'stale' | 'failed'
  durationMs?: number
  tokensUsed?: number
}

interface PipelineStatusProps {
  steps: PipelineStep[]
  projectId: string
}

export function PipelineStatus({ steps, projectId }: PipelineStatusProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <StatusIcon status={step.status} />
              {!isLast && <div className="w-px h-6 bg-gray-200" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{step.name}</span>
                {step.status === 'stale' && (
                  <Badge variant="warning">Stale</Badge>
                )}
              </div>
              {step.tokensUsed && (
                <p className="text-xs text-gray-500">
                  {step.tokensUsed.toLocaleString()} tokens · {step.durationMs}ms
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatusIcon({ status }: { status: PipelineStep['status'] }) {
  const icons: Record<string, React.ReactNode> = {
    completed: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    in_progress: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
    pending: <Circle className="w-5 h-5 text-gray-300" />,
    stale: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    failed: <XCircle className="w-5 h-5 text-red-500" />
  }
  return icons[status] || icons.pending
}
```

### 4.4 Artifact Viewer

```typescript
// src/components/artifacts/ArtifactViewer.tsx
interface ArtifactViewerProps {
  artifact: Artifact
  onRegenerate?: () => void
  onReview?: () => void
}

export function ArtifactViewer({ artifact, onRegenerate, onReview }: ArtifactViewerProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'source'>('rendered')

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{artifact.name}</h2>
          <Badge>{artifact.type}</Badge>
          {artifact.validationScore && (
            <Badge variant={artifact.validationScore >= 80 ? 'success' : 'warning'}>
              Score: {artifact.validationScore}%
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="rendered">Preview</ToggleGroupItem>
            <ToggleGroupItem value="source">Source</ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={onReview}>
            <MessageSquare className="w-4 h-4 mr-1" /> Review
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'rendered' ? (
          <MarkdownRenderer content={artifact.content} />
        ) : (
          <pre className="text-sm font-mono whitespace-pre-wrap">{artifact.content}</pre>
        )}
      </div>
    </div>
  )
}
```

### 4.5 Markdown Renderer

```typescript
// src/components/ui/markdown-renderer.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom table rendering with horizontal scroll for mobile
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-200">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-4 py-2">{children}</td>
          ),
          // Add IDs to headings for anchor links
          h1: ({ children, ...props }) => {
            const id = generateHeadingId(children)
            return <h1 id={id} className="text-2xl font-bold mt-8 mb-4" {...props}>{children}</h1>
          },
          h2: ({ children, ...props }) => {
            const id = generateHeadingId(children)
            return <h2 id={id} className="text-xl font-semibold mt-6 mb-3" {...props}>{children}</h2>
          },
          h3: ({ children, ...props }) => {
            const id = generateHeadingId(children)
            return <h3 id={id} className="text-lg font-medium mt-4 mb-2" {...props}>{children}</h3>
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className={className} {...props}>{children}</code>
              </pre>
            )
          }
        }}
      />
    </div>
  )
}

function generateHeadingId(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  return ''
}
```

---

## 5. Key Pages

### 5.1 Dashboard Home

The dashboard home shows:

- **Pipeline Status Widget:** Visual pipeline progress for the active project.
- **Recent Artifacts:** Last 5 generated or modified artifacts with quick-links.
- **Quick Actions:** "New Project", "Generate PRD", "Browse Marketplace".
- **Usage Summary:** This month's token usage and cost.

### 5.2 Workspace Detail

- Workspace name, description, member count.
- Project list with pipeline status indicators.
- Member list with role badges (Admin, Editor, Viewer).
- Invite member button with email + role selector.

### 5.3 Artifact Viewer

- Markdown preview with rendered tables, code blocks, and headings.
- Source / Preview toggle.
- Validation score badge.
- Regenerate button (triggers pipeline step).
- Review button (opens review panel).
- Copy link, download, and export actions.

### 5.4 Marketplace Browse

- Search bar with autocomplete.
- Category filters (Healthcare, Fintech, Gaming, IoT, Productivity).
- Pack cards with: name, author, description, downloads, rating stars.
- Click to view pack detail: full readme, version history, install button.

### 5.5 Analytics Dashboard

- **Usage Chart:** Pipeline runs per week (line chart).
- **Cost Chart:** LLM spend by provider (stacked bar chart).
- **Quality Chart:** Average validation score over time (line chart).
- **Team Breakdown:** Per-member generation count (bar chart).
- **Top Models:** Most used models (pie chart).

### 5.6 Diff View

```typescript
// src/components/artifacts/DiffViewer.tsx
export function DiffViewer({ previous, current }: DiffViewerProps) {
  const diff = computeDiff(previous.content, current.content)

  return (
    <div className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-r">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Previous ({formatDate(previous.generatedAt)})
        </h3>
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {diff.map((change, i) => (
            <span
              key={i}
              className={
                change.type === 'removed' ? 'bg-red-100 text-red-800 line-through' :
                change.type === 'unchanged' ? '' : ''
              }
            >
              {change.value}
            </span>
          ))}
        </pre>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Current ({formatDate(current.generatedAt)})
        </h3>
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {diff.map((change, i) => (
            <span
              key={i}
              className={
                change.type === 'added' ? 'bg-green-100 text-green-800' :
                change.type === 'unchanged' ? '' : ''
              }
            >
              {change.value}
            </span>
          ))}
        </pre>
      </div>
    </div>
  )
}
```

---

## 6. State Management

### 6.1 Zustand Stores

```typescript
// src/stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  currentView: 'rendered' | 'source'
  setCurrentView: (view: 'rendered' | 'source') => void
}

export const useUIStore = create<UIState>(set => ({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  currentView: 'rendered',
  setCurrentView: view => set({ currentView: view }),
}))
```

### 6.2 TanStack Query Patterns

```typescript
// src/hooks/use-artifacts.ts
export function useArtifacts(projectId: string) {
  return useQuery({
    queryKey: ['artifacts', projectId],
    queryFn: () => api.request<Artifact[]>(`/api/projects/${projectId}/artifacts`),
    staleTime: 30_000, // 30 seconds
  })
}

export function useGenerateArtifact(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (stepId: string) =>
      api.request<Artifact>(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        body: { stepId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts', projectId] })
      queryClient.invalidateQueries({ queryKey: ['pipeline', projectId] })
    },
  })
}

export function usePipelineStatus(projectId: string) {
  return useQuery({
    queryKey: ['pipeline', projectId],
    queryFn: () => api.request<PipelineStep[]>(`/api/projects/${projectId}/pipeline`),
    refetchInterval: 5_000, // Poll every 5 seconds while generating
    enabled: true,
  })
}
```

---

## 7. Accessibility Implementation

### 7.1 Requirements

Per Master Context §17 and PRD NFR-U01 through U03:

- **WCAG 2.1 AA compliance** for all web UI.
- **Keyboard navigation:** All interactive elements reachable and operable via Tab, Enter, Escape, arrow keys.
- **Screen reader compatibility:** ARIA labels on all interactive elements. Live regions for dynamic content.
- **Color independence:** Color is never the sole differentiator. Text labels always accompany colored indicators.
- **Focus management:** Focus is trapped in modals. Focus returns to trigger element on modal close. Focus moves to new content on route change.
- **Reduced motion:** `prefers-reduced-motion` media query respected for animations.

### 7.2 Accessibility Checklist per Component

| Component  | Keyboard                 | Screen Reader                               | Focus                     | Color                             |
| ---------- | ------------------------ | ------------------------------------------- | ------------------------- | --------------------------------- |
| **Button** | Enter/Space activates    | `aria-label` or visible text                | Visible focus ring        | Text + icon, not color alone      |
| **Input**  | Tab to focus             | `aria-label`, `aria-describedby` for errors | Border highlight on focus | Error text, not just red border   |
| **Modal**  | Escape closes            | `role="dialog"`, `aria-modal`               | Trapped in modal          | —                                 |
| **Table**  | Arrow keys (if sortable) | Caption, scope on headers                   | —                         | —                                 |
| **Chart**  | —                        | `aria-label` with text summary of data      | —                         | Patterns + colors for distinction |
| **Toast**  | —                        | `role="alert"`, `aria-live="polite"`        | —                         | Icon + text for status            |

---

## 8. VS Code Extension (P3)

### 8.1 Extension Features

Per PRD FR-253:

- **Sidebar Panel:** Pipeline status for the current project.
- **Inline Preview:** Preview generated artifacts in a webview panel.
- **Command Palette:** `PromptPilot: Run`, `PromptPilot: Validate`, `PromptPilot: Status`.
- **Status Bar:** Current pipeline state indicator.
- **Diff View:** Compare artifact versions using VS Code's native diff editor.

### 8.2 Extension Architecture

```
extension.ts (entry point)
├── activate() → registers commands, sidebar, status bar
├── commands/
│   ├── run.ts      → executes promptpilot CLI
│   ├── validate.ts → runs validation
│   └── status.ts   → shows pipeline status
├── views/
│   ├── sidebar.ts  → TreeViewProvider for pipeline steps
│   └── preview.ts  → WebviewPanel for artifact preview
└── utils/
    └── cli.ts      → spawns promptpilot CLI process
```

---

## 9. Development Workflow (Frontend)

### 9.1 Local Setup

```bash
git clone https://github.com/promptpilot/promptpilot-dashboard.git
cd promptpilot-dashboard
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:3001
npm run dev
# Opens at http://localhost:5173
```

### 9.2 Development Loop

```bash
# Terminal 1: Backend API (if working on hosted tier)
cd promptpilot-api && npm run dev

# Terminal 2: Frontend dev server
cd promptpilot-dashboard && npm run dev

# Terminal 3: Tests in watch mode
npm run test:watch
```

### 9.3 Adding a New Page

1. Create the page component in `src/app/<section>/<page>.tsx`.
2. Add the route in `src/app/router.tsx`.
3. Add navigation link in the sidebar or wherever appropriate.
4. Write a Playwright E2E test for the page.
5. Write unit tests for any new components.
6. Update the accessibility checklist.

### 9.4 Adding a New Component

1. Create the component in `src/components/<category>/<name>.tsx`.
2. If it's a UI primitive, place it in `src/components/ui/`.
3. Export from `src/components/<category>/index.ts`.
4. Write unit tests covering all states (default, loading, error, empty, disabled).
5. Run accessibility audit with axe DevTools or similar.

---

**End of Frontend Development Guide**
