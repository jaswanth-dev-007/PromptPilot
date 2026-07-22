# PromptPilot — Observations

## Architecture Notes

### Monorepo Structure

- **18 workspace packages** managed by pnpm + TurboRepo
- Full-stack: Next.js 15 frontend, Express backend, Mongoose + Prisma databases
- Build pipeline: Turbo orchestrates dependency-aware `tsc` builds across all packages

### Authentication Flow

- Backend: JWT + bcrypt in `packages/auth` with `AuthService` class
- Frontend: `AuthProvider` context wraps the app; `useAuth` hook for state
- Tokens stored in `localStorage`; API client auto-attaches `Authorization: Bearer` header
- Express middleware (`createAuthMiddleware`) provides `authenticate`, `optionalAuth`, `authorize`

### Component Architecture

- `packages/ui` contains reusable components: `Button`, `Input`, `PasswordField`
- Components use inline styles for zero-dependency rendering (no Tailwind at runtime)
- `PasswordField` wraps `Input` with a show/hide toggle button

### State Management

- Auth state: React Context via `AuthProvider` (from `providers/AuthProvider.tsx`)
- Task management: local `useState` in dashboard page with `addTask`, `toggleTask`, `deleteTask` callbacks
- No external state library (Redux/Zustand) — kept simple for MVP

### Routing Strategy

- Next.js App Router with file-based routing
- Protected routes (`/dashboard`, `/editor`) checked by Next.js middleware (`middleware.ts`)
- Middleware redirects unauthenticated users to `/login` based on `accessToken` cookie

### API Integration

- `lib/utils/api.ts` provides typed `api.get`, `api.post`, `api.put`, `api.delete` helpers
- All responses conform to `ApiResponse<T>` from `@promptpilot/types`
- Error handling via `ApiRequestError` class

### Testing Strategy

- Backend tests (71/71 passing): Vitest with `node` environment, MongoMemoryServer for DB
- Frontend: Next.js build serves as integration test; component tests pending Vite 8 + Rolldown JSX compatibility
- UI component tests deferred — Vite 8's Rolldown bundler doesn't yet support JSX in vitest environments

### CI/CD

- GitHub Actions: `ci.yml` (matrix ubuntu/macos/windows), `prompt-validate.yml`, `release.yml`
- Pre-commit: Husky → lint-staged → ESLint + Prettier
- Commit messages: Conventional Commits enforced by Commitlint

## Known Limitations

1. **Frontend tests** — Vite 8 uses Rolldown which doesn't support JSX in vitest's SSR transform. Use `next build` as integration test. Component tests will work once Vite 8/Vitest 4 JSX support stabilizes.
2. **Tailwind CSS** — PostCSS config is ready but inline styles are used for prod reliability. Tailwind can be activated by adding `@tailwind` directives back.
3. **Prisma** — Schema is defined but no models/migrations yet. Ready for Phase 3.
