# PromptPilot — Product UX Specification

## Complete End-to-End User Journey
### Version 1.0 — GA Launch Spec

---

## Design System Reference

All visual specifications below reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`):

- **Typography:** Inter (headings) + Geist Sans (body), scale 12-72px, weights 400/500/600/700
- **Color:** Primary Indigo-600 (#4F46E5), Neutral Slate 50-950, Success Emerald-500, Warning Amber-500, Error Red-500, Info Sky-500
- **Spacing:** 4px base unit, scale 4-96px
- **Radii:** sm 4px, md 8px, lg 12px, xl 16px, full 9999px
- **Shadows:** sm/md/lg/xl elevation system
- **Motion:** 150ms fast, 250ms normal, 400ms slow, Framer Motion spring presets
- **Breakpoints:** sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px
- **Database:** PostgreSQL via Prisma — 12 models (User, Workspace, WorkspaceMember, Project, Document, DocumentVersion, AIConversation, Message, Generation, Export, Notification, APIKey)
- **API:** Express REST at `/api/v1/*`, JWT auth via cookies, SSE streaming for AI responses

---

## 1. Landing Page

### 1.1 Purpose

**Primary Goal:** Convert visitors into registered users by clearly communicating PromptPilot's value proposition — transforming product ideas into complete engineering specifications in minutes.

**User Intent:** Understand what PromptPilot does, evaluate if it solves their software planning problem, and start a free trial with minimal friction.

**Business Goal:** Maximize signup conversion rate through clear messaging, social proof, interactive demos, and a frictionless CTA flow. Establish brand credibility as the definitive AI-powered software planning platform.

### 1.2 User Journey

**Entry Points:**
- Direct URL (`promptpilot.dev`)
- Organic search (Google: "AI PRD generator", "software specification tool")
- Social media links (Twitter/X, LinkedIn, Reddit, Hacker News)
- Referral links from existing users
- Blog posts and content marketing

**Previous Page:** None (entry point)

**Next Pages:**
- `/register` — Primary CTA "Start Free"
- `/login` — "Sign In" for returning users
- `/pricing` — "View Pricing" link
- `/about` — "About" in footer
- `/features` — "Features" in nav
- `/privacy` — Legal link in footer

**User Actions:**
1. Scroll through hero, value proposition, and social proof
2. View "How It Works" animated pipeline visualization
3. Browse artifact examples (PRD, SRS, Architecture samples)
4. Compare PromptPilot against manual processes (comparison table)
5. Review pricing plans
6. Read FAQ for objections
7. Click "Start Free" → register
8. Click "Sign In" → login for returning users
9. Click "See how it works" → smooth scroll to HowItWorks section

**Exit Points:**
- Browser back button
- External links (documentation, GitHub)
- Footer legal links

### 1.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky, h-16, bg-white/80 backdrop-blur, border-b border-neutral-200) │
│  ┌──────────┐                              ┌──────────┬──────────┬─────┐ │
│  │ LOGO     │  Features  HowItWorks  Pricing│  Sign In │ Start Free│     │ │
│  │ PromptPilot│                            │ (ghost)  │(primary) │     │ │
│  └──────────┘                              └──────────┴──────────┴─────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  HERO SECTION (min-h-screen, flex-center, bg-neutral-50)                 │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  [Radial gradient background, indigo-600 at 8% opacity]             │ │
│  │                                                                      │ │
│  │  ┌──────────────────────────────────────┐                           │ │
│  │  │ 🔵 Now powered by GPT-4o and Claude   │  (badge, indigo-100 bg)  │ │
│  │  └──────────────────────────────────────┘                           │ │
│  │                                                                      │ │
│  │  Your Idea → Complete Engineering Specification                      │ │
│  │  (h1, 4.5rem, weight 700, letter-spacing -0.03em, neutral-900)      │ │
│  │                                                                      │ │
│  │  PromptPilot transforms a simple product description into a         │ │
│  │  complete suite of software engineering documents — PRD, SRS,       │ │
│  │  architecture, database schema, API spec, and roadmap — all         │ │
│  │  consistent, all generated in minutes.                               │ │
│  │  (p, 1.25rem, neutral-600, max-w-640px)                              │ │
│  │                                                                      │ │
│  │  ┌──────────────┐  ┌──────────────────┐                             │ │
│  │  │  Start Free   │  │ See how it works ↓│                             │ │
│  │  │ (primary btn) │  │ (secondary btn)  │                             │ │
│  │  └──────────────┘  └──────────────────┘                             │ │
│  │                                                                      │ │
│  │  Free to start · No credit card · Cancel anytime                     │ │
│  │  (text-xs, neutral-400)                                              │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  HOW IT WORKS (py-24, bg-white)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Section heading: "How It Works" (h2, 2.25rem, neutral-900)        │ │
│  │  Subtitle: "Three steps from idea to complete specification"       │ │
│  │                                                                      │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐                      │ │
│  │  │ 1. Describe│ → │ 2. Generate│ → │ 3. Export │                      │ │
│  │  │ Your Idea  │    │ Pipeline  │    │ & Ship   │                      │ │
│  │  │ [icon]    │    │ [icon]    │    │ [icon]   │                      │ │
│  │  │ Describe  │    │ AI runs   │    │ Download │                      │ │
│  │  │ product in│    │ 9-step    │    │ PDF/HTML/│                      │ │
│  │  │ plain text│    │ pipeline  │    │ Markdown │                      │ │
│  │  └──────────┘    └──────────┘    └──────────┘                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  PIPELINE SHOWCASE (py-24, bg-neutral-50)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  "The 9-Step Specification Pipeline"                                │ │
│  │                                                                      │ │
│  │  [Interactive step visualization — hover to preview each artifact]  │ │
│  │                                                                      │ │
│  │  Master Context → PRD → SRS → Architecture → DB Schema →            │ │
│  │  API Spec → User Flows → Wireframes → Roadmap                       │ │
│  │                                                                      │ │
│  │  Each step: icon + name + description + preview on hover            │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ARTIFACT GRID (py-24, bg-white)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  "What You Get" — grid of 9 artifact cards with sample previews     │ │
│  │  3 columns desktop, 2 tablet, 1 mobile                              │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  COMPARISON TABLE (py-24, bg-neutral-50)                                 │ │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  "PromptPilot vs Manual Process" — feature comparison with ✓/✗     │ │
│  │  Columns: Feature | PromptPilot | Manual | ChatGPT Alone            │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  PRICING SECTION (py-24, bg-white)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  "Simple, Transparent Pricing"                                      │ │
│  │                                                                      │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │ │
│  │  │ Free       │  │ Pro        │  │ Team       │                    │ │
│  │  │ $0/mo     │  │ $29/mo     │  │ $99/mo     │                    │ │
│  │  │ 3 projects │  │ Unlimited   │  │ Unlimited   │                    │ │
│  │  │ Basic AI   │  │ Advanced AI │  │ Everything  │                    │ │
│  │  │ [Start]   │  │ [Start]    │  │ [Contact]  │                    │ │
│  │  └────────────┘  └────────────┘  └────────────┘                    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  FAQ (py-24, bg-neutral-50)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Accordion-style FAQ with common objections and answers             │ │
│  │  Categories: General, AI Quality, Security, Pricing, Integration    │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  FOOTER (py-16, bg-neutral-900, text-neutral-400)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Logo | Product links | Resources | Legal | Social                  │ │
│  │  "© 2026 PromptPilot. All rights reserved."                         │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** Navbar (top-0, z-50 with backdrop blur)

**Responsive Behavior:**
- **Desktop (≥1024px):** Full hero with radial gradient, 3-column grids, horizontal step flow
- **Tablet (768-1023px):** Stacked hero, 2-column grids, vertical step flow
- **Mobile (<768px):** Full-width cards, hamburger menu in nav, single-column layout, reduced hero typography

### 1.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `Nav` | Organism | Sticky top navigation with logo, links, auth buttons |
| `HeroSection` | Organism | Full-viewport hero with headline, subtitle, CTAs, trust bar |
| `Badge` | Atom | "Now powered by GPT-4o and Claude 3.5 Sonnet" status badge |
| `Button` (primary) | Atom | "Start Free" — indigo-600 bg, white text, lg size |
| `Button` (secondary) | Atom | "See how it works" — white bg, border, lg size |
| `Button` (ghost) | Atom | "Sign In" — transparent, neutral-600 text |
| `HowItWorks` | Organism | 3-step process visualization with numbered cards |
| `PipelineShowcase` | Organism | Interactive 9-step pipeline visualization |
| `ArtifactGrid` | Organism | 3-column grid of artifact preview cards |
| `ComparisonTable` | Organism | Feature comparison table with ✓/✗ indicators |
| `PricingSection` | Organism | 3-column pricing card grid |
| `PricingCard` | Molecule | Individual pricing tier card with features list |
| `FAQ` | Organism | Accordion-style FAQ with expandable answers |
| `FAQItem` | Molecule | Individual FAQ question/answer pair |
| `Footer` | Organism | Multi-column footer with links and copyright |

### 1.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Navigate to section | Click nav link | Smooth scroll to section |
| Start Free | Click "Start Free" | Navigate to `/register` |
| Sign In | Click "Sign In" | Navigate to `/login` |
| View Pricing | Click "Pricing" | Navigate to `/pricing` or scroll |
| Expand FAQ | Click FAQ item | Animate height expansion, collapse others |
| Preview artifact | Hover pipeline step | Show tooltip with artifact sample |
| Toggle mobile menu | Click hamburger | Slide-in mobile navigation overlay |
| Scroll animation | Scroll into view | Fade-in + slide-up sections via IntersectionObserver |

### 1.6 AI Features

None directly on the landing page. The page showcases AI capabilities through:
- Pipeline step previews (demonstrating AI generation)
- Artifact grid samples (showing AI output quality)
- "Powered by GPT-4o and Claude 3.5 Sonnet" badge

### 1.7 State Management

| State | Visual |
|-------|--------|
| Loading | Navbar visible immediately; sections skeleton-load below fold |
| Normal | Full page rendered |
| Mobile menu open | Overlay with backdrop blur, slide-in navigation |
| FAQ expanded | Single accordion item open, smooth height animation |

### 1.8 Permissions

All content is public. No authentication required.

### 1.9 API Integration

None. Landing page is fully static with Next.js ISR (Incremental Static Regeneration) for pricing/features content. Revalidates every 60 seconds.

### 1.10 Database Mapping

None. Static content. Pricing data from config/constants file.

### 1.11 Edge Cases

| Case | Handling |
|------|----------|
| JavaScript disabled | All content visible via server-rendered HTML |
| Slow connection | Static generation, minimal JS, optimized images |
| First visit | No cookies, no state — clean landing |
| Returning visitor | "Sign In" visible in nav for quick access |
| Mobile viewport | Responsive, touch-friendly targets (≥44px) |
| Dark mode preference | Honors `prefers-color-scheme` for dark landing |

### 1.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Navbar scroll | bg-white/80 backdrop-blur appears | 150ms | ease |
| Section entrance | Fade in + slide up 8px (IntersectionObserver) | 400ms | [0.4, 0, 0.2, 1] |
| Hero badge dot | Pulse animation (scale 1→1.15→1) | 2s infinite | ease-in-out |
| Button hover | Shadow increase + bg darken | 150ms | ease |
| FAQ expand | Height auto animation | 250ms | [0.4, 0, 0.2, 1] |
| Pipeline step hover | Scale 1.02 + shadow-lg | 150ms | ease |
| Pricing card hover | Scale 1.02 + shadow-lg | 150ms | ease |
| Nav link hover | Color transition | 150ms | ease |
| Hamburger → X | Rotate 90deg | 250ms | spring |

### 1.13 Mobile Experience

**Breakpoints:**
- **<640px:** Full-width single column. Hero heading scales down (clamp 2rem-4.5rem). Stacked CTAs. Hamburger menu.
- **640-768px:** Tablet layout. 2-column artifact grid. Stacked pricing cards.
- **768-1024px:** Full hero visible. 2-column grids. Horizontal nav.
- **≥1024px:** Desktop layout. 3-column grids. Full experience.

**Touch Gestures:**
- Swipe down to dismiss mobile menu
- Tap outside mobile menu to close
- Pull-to-refresh disabled (static page)

**Bottom Navigation:** None on landing page. Standard footer links.

### 1.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Skip to main content | Hidden link as first focusable element |
| Focus ring | `focus-visible:ring-2 ring-primary-500 ring-offset-2` |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, `<h1>`-`<h3>`, `<footer>` |
| Alt text | All images have descriptive `alt` attributes |
| Color contrast | All text ≥4.5:1 ratio against background |
| Reduced motion | `prefers-reduced-motion: reduce` disables all animations |
| Keyboard nav | All interactive elements in natural tab order |
| ARIA labels | `aria-expanded` on FAQ items, `aria-label` on icon buttons |
| Screen reader | Section landmarks announced, FAQ content accessible |

### 1.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Static Generation | Next.js `generateStaticParams` + ISR |
| Image optimization | `next/image` with WebP/AVIF formats, lazy loading |
| Code splitting | Dynamic imports for below-fold sections |
| Font loading | `next/font` with `display: swap` and subsetting |
| Critical CSS | Inlined in `<head>` |
| Prefetch | `<Link prefetch>` for `/register` and `/login` |
| Skeleton loading | Minimal — content rendered server-side |
| Caching | CDN cache (Vercel Edge), ISR revalidation 60s |

### 1.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Interactive demo | Embed live PromptPilot sandbox on landing page |
| Customer logos | Add "Trusted by" logo carousel from enterprise clients |
| Video walkthrough | Replace static HowItWorks with product demo video |
| A/B testing | Feature flag system for CTA copy, pricing display |
| Localization | i18n routing for multi-language landing pages |
| Analytics | Add PostHog/Plausible for conversion funnel tracking |
| Waitlist | Replace "Start Free" with waitlist during beta |
| Case studies | Add customer success section with metrics |
| ROI calculator | Interactive tool estimating time/money saved |

---

## 2. Authentication

### 2.1 Purpose

**Primary Goal:** Securely authenticate users — register new accounts, log in returning users, and manage sessions. The gateway to the PromptPilot platform.

**User Intent:** Create an account to start using PromptPilot, or log in to resume work on existing projects.

**Business Goal:** Capture new users with minimal friction while maintaining enterprise-grade security. Support both self-serve registration and future SSO/enterprise flows.

### 2.2 User Journey

**Entry Points:**
- Landing page "Start Free" CTA → `/register`
- Landing page "Sign In" → `/login`
- Direct URL access to protected routes (redirected via middleware to `/login`)
- Invitation email link → `/register?invite=TOKEN` (future Phase 4.0)

**Previous Page:**
- Landing page `/`
- Any protected page (middleware redirect)

**Next Pages:**
- `/dashboard` — On successful login/register (default post-auth destination)
- `/register` — From login page "Create one" link
- `/login` — From register page "Sign in" link
- Original protected URL — If redirected by middleware, return to intended destination

**User Actions:**
1. **Register:** Enter name, email, password → Submit → Auto-login → Redirect to dashboard
2. **Login:** Enter email, password → Submit → Redirect to dashboard
3. **Password validation:** Real-time client-side validation
4. **Toggle password visibility:** Click eye icon in password field
5. **Navigate between auth forms:** Click "Create one" / "Sign in" links
6. **Session refresh:** Automatic token refresh via `/auth/refresh` on 401

**Exit Points:**
- Landing page (back navigation, logo click)

### 2.3 Complete Layout

```
┌────────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT (min-h-screen, bg-neutral-50)                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Back to home]                                          │  │
│  │  (ghost btn, top-left, absolute)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────┐                  │
│  │  AUTH CARD (max-w-[400px], mx-auto,       │                  │
│  │  bg-white, rounded-xl, shadow-md, p-8)    │                  │
│  │                                           │                  │
│  │  ┌─────────────────────────────────────┐ │                  │
│  │  │         [Logo: PromptPilot]          │ │                  │
│  │  │         (centered, h-8)              │ │                  │
│  │  └─────────────────────────────────────┘ │                  │
│  │                                           │                  │
│  │  ┌─────────────────────────────────────┐ │                  │
│  │  │  Sign In / Create Account            │ │                  │
│  │  │  (h1, text-2xl, font-bold, centered) │ │                  │
│  │  │                                      │ │                  │
│  │  │  Welcome back to PromptPilot         │ │                  │
│  │  │  (p, text-sm, neutral-500, centered) │ │                  │
│  │  └─────────────────────────────────────┘ │                  │
│  │                                           │                  │
│  │  ┌─────────────────────────────────────┐ │                  │
│  │  │  ERROR BANNER (if error)             │ │                  │
│  │  │  bg-red-50, border-red-200, red-700 │ │                  │
│  │  └─────────────────────────────────────┘ │                  │
│  │                                           │                  │
│  │  ┌─────────────────────────────────────┐ │                  │
│  │  │  FORM                                │ │                  │
│  │  │                                      │ │                  │
│  │  │  [Name*] (register only)            │ │                  │
│  │  │  ┌────────────────────────────────┐ │ │                  │
│  │  │  │ Your full name                 │ │ │                  │
│  │  │  └────────────────────────────────┘ │ │                  │
│  │  │                                      │ │                  │
│  │  │  [Email]                             │ │                  │
│  │  │  ┌────────────────────────────────┐ │ │                  │
│  │  │  │ you@example.com                │ │ │                  │
│  │  │  └────────────────────────────────┘ │ │                  │
│  │  │                                      │ │                  │
│  │  │  [Password]                          │ │                  │
│  │  │  ┌────────────────────────────────┐ │ │                  │
│  │  │  │ ••••••••••           👁        │ │ │                  │
│  │  │  └────────────────────────────────┘ │ │                  │
│  │  │                                      │ │                  │
│  │  │  ┌────────────────────────────────┐ │ │                  │
│  │  │  │         Sign In / Create       │ │ │                  │
│  │  │  │         (primary btn, full-w)  │ │ │                  │
│  │  │  └────────────────────────────────┘ │ │                  │
│  │  └─────────────────────────────────────┘ │                  │
│  │                                           │                  │
│  │  ┌─────────────────────────────────────┐ │                  │
│  │  │  Don't have an account? Create one  │ │                  │
│  │  │  Already have an account? Sign in   │ │                  │
│  │  │  (text-sm, neutral-500, centered,   │ │                  │
│  │  │   link in primary-600)              │ │                  │
│  │  └─────────────────────────────────────┘ │                  │
│  └──────────────────────────────────────────┘                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** None

**Responsive Behavior:**
- All viewports: Centered card, max-width 400px
- Mobile (<480px): Card fills width with 16px horizontal padding, no border-radius (full-bleed feel)

### 2.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `Input` | Atom | Text input with label, placeholder, error state |
| `PasswordField` | Molecule | Password input with show/hide toggle (eye icon) |
| `Button` (primary) | Atom | Submit button, full-width, loading spinner state |
| `ErrorBanner` | Molecule | Red-tinted error message container |
| `FormField` | Molecule | Label + input + error message group |

### 2.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Register | Submit form | POST `/auth/register`, auto-login, redirect to dashboard, create default workspace |
| Login | Submit form | POST `/auth/login`, set auth cookies, redirect to dashboard |
| Validate email | Blur/Typing | Client-side regex validation: `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| Validate password | Blur/Typing | Min 8 chars, real-time feedback |
| Validate name | Blur/Typing | Required, min 2 chars (register only) |
| Toggle password | Click eye icon | Switch input type between `password` and `text` |
| Auto-focus | Page load | Focus first input field |
| Keyboard submit | Enter key | Submit form |
| Session refresh | 401 response | Silent POST `/auth/refresh`, retry original request |
| Logout | Anywhere in app | POST `/auth/logout`, clear cookies, redirect to `/login` |

**Keyboard Shortcuts:**
- `Enter` — Submit form (when any input focused)
- `Tab` — Navigate between fields
- `Escape` — Clear error banners

### 2.6 AI Features

None. Authentication is purely functional.

### 2.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Idle | Clean form, empty fields | Default state |
| Validating | None (client-side only, instant) | Real-time validation on blur/type |
| Submitting | Button shows spinner, disabled | `setLoading(true)`, disable all inputs |
| Success (Login) | Brief flash, then redirect | Set cookies, AuthProvider update, router.push |
| Success (Register) | Brief flash, then redirect | Create workspace in background, router.push |
| Error (401) | Red error banner "Invalid email or password" | Show error, re-enable form |
| Error (409) | Red error banner "Email already registered" | Show error on register form |
| Error (Network) | Red banner "Network error. Is the backend running?" | Show error, re-enable form |
| Error (Validation) | Red text below invalid field | Highlight field border red |

### 2.8 Permissions

| Role | Access |
|------|--------|
| Unauthenticated | Full access to login/register pages |
| Authenticated | Redirected away from auth pages to dashboard |

### 2.9 API Integration

#### Register

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePass123"
}

Response 201:
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "jane@example.com", "name": "Jane Smith", "role": "MEMBER" },
    "expiresIn": 3600
  }
}
// Sets cookies: accessToken, refreshToken

Error 409:
{ "success": false, "error": { "code": "CONFLICT", "message": "Email already registered" } }

Error 400:
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "details": [...] } }
```

**Loading Behavior:** Button switches to spinner, all inputs disabled. Optimistic: none (auth is critical path).

**Retry Logic:** Manual only — user clicks submit again. No auto-retry for auth.

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securePass123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "jane@example.com", "name": "Jane Smith" },
    "expiresIn": 3600
  }
}
// Sets cookies: accessToken, refreshToken

Error 401:
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "Invalid email or password" } }
```

#### Refresh Token

```
POST /api/v1/auth/refresh
Cookie: refreshToken={token}
// or body: { "refreshToken": "..." }

Response 200:
{ "success": true, "data": { "expiresIn": 3600 } }
// Sets new cookies: accessToken, refreshToken
```

#### Logout

```
POST /api/v1/auth/logout
Cookie: accessToken={token}

Response 200:
{ "success": true, "data": { "message": "Logged out" } }
// Clears cookies: accessToken, refreshToken
```

| Intervention | When | Behavior |
|------|------|----------|
| Auto-refresh | 401 on any API call | Interceptor calls `/auth/refresh`, retries original request once |
| Force logout | Refresh fails | Clear auth state, redirect to `/login` |

### 2.10 Database Mapping

**User model (Prisma):**
- `id` — UUID primary key
- `email` — unique, indexed
- `passwordHash` — bcrypt 12 rounds
- `name` — display name
- `avatarUrl` — nullable
- `role` — ADMIN | MEMBER
- `isActive` — soft delete flag
- `refreshTokenHash` — SHA-256 hashed refresh token
- `lastLoginAt` — updated on login
- `deletedAt` — soft delete timestamp

**On Registration:** Creates User + auto-creates default Workspace (PERSONAL type) and default Project via `onboarding.ts` service.

**Indexes:** `email` (unique), `id` (primary)

### 2.11 Edge Cases

| Case | Handling |
|------|----------|
| No internet | Show "Network error. Is the backend running?" banner |
| Expired token | Auto-refresh via interceptor. If refresh fails, redirect to login |
| Duplicate email | 409 response, "Email already registered" error |
| Weak password | Client-side validation: min 8 chars. Future: zxcvbn strength meter |
| Brute force | Backend rate limiting on `/auth/login` (5 attempts/min per IP) |
| Session hijack | Refresh token rotation — old refresh token invalidated on rotation |
| XSS | Cookies set with `httpOnly`, `secure`, `sameSite: 'lax'` |
| CSRF | SameSite cookies + token in Authorization header |
| First-time user | Register → auto-create workspace → dashboard with onboarding hints |
| Returning user | Login → dashboard with existing data |
| Concurrent sessions | Multiple refresh tokens supported per user |
| Password manager | `autocomplete="email"`, `autocomplete="current-password"` attributes |

### 2.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Card entrance | Fade in + slide up 12px | 400ms | [0.4, 0, 0.2, 1] |
| Error banner | Slide down + fade in | 250ms | [0.4, 0, 0.2, 1] |
| Error dismiss | Fade out + slide up | 150ms | ease-in |
| Button loading | Spinner fade in | 150ms | ease |
| Password toggle | Icon swap (eye ↔ eye-off) | 150ms | ease |
| Field focus | Border color transition indigo | 150ms | ease |
| Field error | Border color transition red + shake (subtle) | 300ms | spring |
| Page transition | Fade out → navigate → fade in | 400ms | ease |

### 2.13 Mobile Experience

- Full-width card with comfortable touch targets (≥44px)
- Inputs auto-zoom disabled via `maximum-scale=1` meta
- Keyboard-aware: form stays visible above mobile keyboard
- Password manager integration: `autocomplete` attributes for iOS Keychain / Android Autofill
- No horizontal scroll. Card padding adjusts for very small screens (320px).

### 2.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | `<form>`, `<label>`, `<input>` with proper associations |
| Error announcement | `aria-describedby` linking error to field, `role="alert"` on error banner |
| Focus management | Auto-focus first input on mount. Focus trap not needed (simple form). |
| Screen reader | All labels read. Errors announced. Loading state announced via `aria-busy`. |
| Contrast | All text ≥4.5:1. Error text #B91C1C on #FEF2F2 = 7:1. |
| Keyboard | Tab through fields, Enter to submit, Escape to clear errors |
| Reduced motion | All animations disabled |
| Disabled state | `aria-disabled="true"` on submit button during loading |

### 2.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Lazy load | Auth page is client component, but lightweight |
| No unnecessary deps | Only `@promptpilot/ui` components loaded |
| Form state | Local `useState` — no global store needed |
| API calls | Single fetch per auth action |
| Font optimization | Inherits from root layout Inter font |

### 2.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Google OAuth | Add "Continue with Google" button, OAuth 2.0 flow |
| GitHub OAuth | Add "Continue with GitHub" button for developer audience |
| Enterprise SSO | SAML/OIDC integration with Okta, Azure AD |
| MFA/2FA | TOTP-based two-factor authentication flow |
| Password reset | "Forgot password?" → email reset link flow |
| Email verification | Send verification email on register, verify before full access |
| Magic link | Passwordless login via email magic link |
| Passkeys | WebAuthn/FIDO2 biometric authentication |
| Rate limiting UI | Show countdown timer when rate limited |
| Session management | "Devices" page showing active sessions with remote logout |

---

## 3. Dashboard

### 3.1 Purpose

**Primary Goal:** Provide users with an at-a-glance overview of their work, quick access to common actions, and awareness of recent activity — serving as the command center and default landing page after authentication.

**User Intent:** Resume work quickly, see what's changed, start new projects, track generation progress, and navigate to specific workspaces or projects.

**Business Goal:** Maximize user engagement by surfacing relevant information immediately, reducing time-to-action, and providing clear pathways into core workflows. The dashboard should feel like "home" — personalized, efficient, and welcoming.

### 3.2 User Journey

**Entry Points:**
- Post-login redirect
- Post-registration redirect (with onboarding state)
- Clicking "Dashboard" in sidebar navigation
- Clicking PromptPilot logo in navbar
- `⌘K` → "Go to Dashboard"

**Previous Page:**
- `/login` or `/register` (on authentication)
- Any internal page (via sidebar navigation)

**Next Pages:**
- `/workspaces` — "Open Workspace" button, sidebar link
- `/projects` — "New Project" button, sidebar link
- `/workspace/[slug]` — Click workspace in summary
- `/project/[slug]` — Click project in recent list
- `/templates` — Quick action or sidebar link
- `/settings` — Sidebar link
- `/activity` — "View all" in AI activity section

**User Actions:**
1. View welcome message with personalized greeting
2. Start new project via Quick Actions grid
3. View and navigate to recent projects
4. Check workspace statistics (projects, documents, generations, exports)
5. Monitor AI generation activity
6. Access favorited items
7. Manage personal tasks with to-do list
8. Open command palette for quick navigation (`⌘K`)
9. Mark notifications as read

**Exit Points:**
- Logout (sidebar bottom)
- Any navigation target listed above

### 3.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  DASHBOARD LAYOUT (App Shell — sidebar + navbar + content)               │
│                                                                           │
│  ┌────────┐ ┌─────────────────────────────────────────────────────────┐  │
│  │SIDEBAR │ │  NAVBAR (h-14, bg-white, border-b)                      │  │
│  │w-60   │ │  ┌──────────────────────────────┐  ┌──────────────────┐  │  │
│  │        │ │  │ 🏠 Dashboard > [path]        │  │ ⌘K Search        │  │  │
│  │ 🏠 Dash│ │  │ (Breadcrumbs)                │  │ (command palette │  │  │
│  │ 📁 Work│ │  └──────────────────────────────┘  │  trigger)       │  │  │
│  │ 📋 Proj│ │                                     └──────────────────┘  │  │
│  │ 🤖 AI  │ ├─────────────────────────────────────────────────────────┤  │
│  │ ⭐ Temp│ │                                                          │  │
│  │ 📊 Acti│ │  CONTENT AREA (overflow-auto, p-8, max-w-[1200px])      │  │
│  │ ⚙️ Sett│ │                                                          │  │
│  │ 💡 Help│ │  ┌────────────────────────────────────────────────────┐ │  │
│  │        │ │  │  WELCOME HERO                                       │ │  │
│  │        │ │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │        │ │  │  │ Welcome back, Jane 👋                         │ │  │
│  │ ───────│ │  │  │ Ready to build something great today?        │ │  │
│  │ 👤 User│ │  │  │                                               │ │  │
│  │ ⚡ Upgr│ │  │  │ [+ New Project]  [Open Workspace]            │ │  │
│  │ 🚪 Log │ │  │  └──────────────────────────────────────────────┘  │ │  │
│  └────────┘ │  └────────────────────────────────────────────────────┘ │  │
│             │                                                          │  │
│             │  ┌────────────────────────────────────────────────────┐ │  │
│             │  │  QUICK ACTIONS (grid, auto-fit, minmax 150px)      │ │  │
│             │  │  [📋 PRD] [📐 SRS] [🏗️ Arch] [🗄️ DB] [📄 Doc]    │ │  │
│             │  │  [⌘K More]                                         │ │  │
│             │  └────────────────────────────────────────────────────┘ │  │
│             │                                                          │  │
│             │  ┌──────────────────────┐ ┌──────────────────────────┐ │  │
│             │  │  RECENT PROJECTS     │ │  WORKSPACE SUMMARY        │ │  │
│             │  │  (2/3 width)        │ │  (1/3 width)             │ │  │
│             │  │                      │ │                           │ │  │
│             │  │  Project cards with  │ │  ┌────┐ ┌────┐          │ │  │
│             │  │  name, status,       │ │  │ 3  │ │ 12 │ Projects │ │  │
│             │  │  last modified       │ │  │    │ │    │ Documents│ │  │
│             │  │                      │ │  └────┘ └────┘          │ │  │
│             │  │  Or: empty state     │ │  ┌────┐ ┌────┐          │ │  │
│             │  │  "No projects yet"   │ │  │ 8  │ │ 2  │ Gen   Exp│ │  │
│             │  │                      │ │  └────┘ └────┘          │ │  │
│             │  └──────────────────────┘ └──────────────────────────┘ │  │
│             │                                                          │  │
│             │  ┌──────────────────────┐ ┌──────────────────────────┐ │  │
│             │  │  AI ACTIVITY (2/3)  │ │  FAVORITES (1/3)         │ │  │
│             │  │                      │ │                           │ │  │
│             │  │  Timeline of recent  │ │  Starred projects/docs   │ │  │
│             │  │  AI generations      │ │  with quick-jump links   │ │  │
│             │  │  with status badges  │ │                           │ │  │
│             │  │  + streaming indicator│ │  Or: empty state         │ │  │
│             │  │                      │ │  "No favorites"          │ │  │
│             │  └──────────────────────┘ └──────────────────────────┘ │  │
│             │                                                          │  │
│             │  ┌────────────────────────────────────────────────────┐ │  │
│             │  │  TASKS SECTION (full width)                        │ │  │
│             │  │  ┌──────────────────────────────────────────────┐  │ │  │
│             │  │  │ [+ Add task input________________] [Add]      │ │  │  │
│             │  │  │                                               │ │  │  │
│             │  │  │ ☐ Write project description for new app      │ │  │  │
│             │  │  │ ☑ Review generated PRD                      │ │  │  │
│             │  │  │ ☐ Export final specification suite          │ │  │  │
│             │  │  └──────────────────────────────────────────────┘  │ │  │
│             │  └────────────────────────────────────────────────────┘ │  │
│             └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** Sidebar (left, full height, scrollable internally), Navbar (top, full width)

**Responsive Behavior:**
- **Desktop (≥1024px):** Full sidebar (240px), 2-column grid for content, all sections visible
- **Tablet (768-1023px):** Collapsed sidebar (icons only, 56px), stacked content sections
- **Mobile (<768px):** No sidebar (hamburger menu overlay), single column, all sections stacked vertically, hero simplified

### 3.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `Sidebar` | Organism | Left navigation with app sections, user info, upgrade CTA. Built. |
| `Navbar` | Organism | Top bar with breadcrumbs + command palette trigger. Built. |
| `Breadcrumbs` | Molecule | Current page path: Home > Dashboard. Built. |
| `CommandPalette` | Organism | `⌘K` global search/navigation overlay. Built. |
| `WelcomeHero` | Organism | Gradient banner with greeting, context, and primary CTAs |
| `Button` (primary) | Atom | "New Project" CTA |
| `Button` (secondary) | Atom | "Open Workspace" |
| `QuickActionCard` | Molecule | Icon + label grid item for pipeline step shortcuts |
| `Card` | Organism | Content container with header/content/footer. Built. |
| `CardHeader` | Molecule | Card title + optional action link. Built. |
| `CardTitle` | Atom | Card section heading. Built. |
| `CardContent` | Molecule | Card body content. Built. |
| `StatBox` | Molecule | Large number + label for dashboard metrics |
| `EmptyState` | Organism | "No data yet" illustration + message + CTA. Built. |
| `Badge` | Atom | Status indicator (Draft, Generating, Complete). Built. |
| `Spinner` | Atom | Loading indicator. Built. |
| `Skeleton` | Atom | Loading placeholder. Built. |
| `Input` | Atom | Task input field. Built. |
| `Checkbox` | Atom | Task completion toggle. Built. |
| `ProjectCard` | Molecule | Project preview: name, status badge, last modified, workspace |

### 3.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Create project | Click "New Project" | Navigate to `/projects` or open create dialog |
| Open workspace | Click "Open Workspace" | Navigate to `/workspaces` |
| Quick generate | Click Quick Action card | Navigate to project page with step pre-selected |
| View recent project | Click project card | Navigate to `/project/[slug]` |
| View all projects | Click "View all" | Navigate to `/projects` |
| Add task | Type + Enter/click Add | Create task item in local state |
| Toggle task | Click checkbox | Strike through text, mark complete |
| Delete task | Click delete button | Remove from list with instant feedback |
| Open command palette | `⌘K` or click trigger | Open search overlay |
| Star/favorite | Click star icon on card | Toggle favorite status, update favorites list |
| Mark notification | Click bell icon (navbar) | Toggle notification dropdown, mark as read |
| Collapse sidebar | Click toggle (tablet/mobile) | Animate sidebar width |

**Keyboard Shortcuts:**
- `⌘K` — Open command palette
- `G D` — Go to Dashboard
- `G W` — Go to Workspaces
- `G P` — Go to Projects
- `G S` — Go to Settings
- `N` — New Project (from anywhere)
- `?` — Show keyboard shortcuts help overlay
- `Esc` — Close command palette / modal

### 3.6 AI Features

| Feature | Description |
|---------|-------------|
| AI Activity Feed | Timeline of recent AI generations with status (completed/failed/in-progress), token usage, and cost |
| Streaming Indicator | Pulsing dot + "Generating..." badge when pipeline steps are actively running |
| Smart Suggestions | Based on recent activity, suggest next pipeline step: "Continue where you left off — PRD for Project X is ready for review" |
| Generation Resume | Click a running/failed generation to jump to project page at that step |
| Status Badges | AI-generated documents show status: DRAFT, GENERATED, REVIEWED, STALE |

### 3.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| First-time user (no data) | Welcome hero simplified + empty states with CTAs in all cards | Show onboarding hints |
| Normal (data populated) | Full dashboard with projects, stats, activity | All sections populated |
| Loading (initial) | Skeleton cards for projects, stats, activity | `GET /dashboard/stats` pending |
| Loading (partial) | Individual card skeletons while async data fetches | Stale-while-revalidate pattern |
| AI Streaming | Pulsing badge "Generating PRD for Project X..." in activity feed | SSE connection status |
| Error (stats fail) | Card shows error state with retry button | "Couldn't load stats. [Retry]" |
| Error (projects fail) | Empty state with error message | "Couldn't load projects. [Retry]" |
| Offline | Banner at top: "You're offline. Some data may be stale." | SWR with cached data fallback |
| No projects | "No projects yet" empty state with "Create your first project" CTA |
| No favorites | "No favorites" with "Star projects to access them quickly" hint |
| No tasks | "No tasks" with "Add tasks to track your progress" hint |

### 3.8 Permissions

| Role | Dashboard Access |
|------|-----------------|
| Owner | Full access to own dashboard with all personal data |
| Admin | Full personal dashboard + team stats (future) |
| Editor | Personal dashboard with own projects and shared workspace stats |
| Viewer | Personal dashboard, read-only stats |
| Guest | Not applicable (guests can't authenticate) |

All roles see their own personalized dashboard. Workspace-level data shown is scoped to workspaces the user belongs to.

### 3.9 API Integration

#### Dashboard Stats

```
GET /api/v1/dashboard/stats
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
```

**Loading Behavior:** Skeleton cards during fetch (250ms delay before showing skeleton to avoid flash). Stale data from cache shown immediately.

**Retry Logic:** SWR with exponential backoff (1s, 2s, 4s, max 30s).

#### Recent Projects (via Projects API)

```
GET /api/v1/projects?workspaceId={id}&page=1&limit=5
Cookie: accessToken={token}

Response 200:
{
  "success": true,
  "data": [Project[]],
  "meta": { "total": 50, "page": 1, "limit": 5 }
}
```

#### AI Activity (via Conversations API — future)

```
GET /api/v1/conversations?page=1&limit=10&sort=recent
Cookie: accessToken={token}

Response 200:
{
  "success": true,
  "data": [AIConversation[]],
  "meta": { "total": 45, "page": 1, "limit": 10 }
}
```

### 3.10 Database Mapping

**Dashboard Stats aggregation (Prisma):**
- `workspaceCount` → `prisma.workspace.count({ where: { ownerId, deletedAt: null } })`
- `projectCount` → `prisma.project.count({ where: { ownerId, deletedAt: null } })`
- `documentCount` → `prisma.document.count({ where: { project: { ownerId }, deletedAt: null } })`
- `generationStats` → `prisma.generation.aggregate({ _sum: { totalTokens, cost }, _count })`
- `notificationCount` → `prisma.notification.count({ where: { userId, read: false } })`

**Indexes used:** `ownerId` on Workspace, Project. `userId` on Notification. `userId + read` compound on Notification.

**Caching:** Stale-while-revalidate (SWR) pattern. Cache dashboard stats for 30 seconds. Invalidate on project/document change.

**Pagination:** Projects list uses cursor-based pagination (`skip/take`). AI activity uses offset pagination.

### 3.11 Edge Cases

| Case | Handling |
|------|----------|
| First-time user | All cards show empty states with CTAs. Welcome hero shows "Let's get started" instead of "Welcome back" |
| No internet | SWR returns cached data. Offline banner displayed. |
| Expired token | Auto-refresh via interceptor. If fails, redirect to login. |
| Empty workspace | Stats show zeros. Quick actions still functional (create new). |
| Very large number of projects | Recent projects limited to 5. "View all" link for full list. |
| AI generation in progress | Streaming indicator in activity feed. Polling every 3s for status updates. |
| Deleted project referenced | Filtered server-side (`deletedAt: null`). |
| Very long project names | Truncated with ellipsis at 40 chars, full name in tooltip |
| Concurrent generation | Multiple streaming indicators stack vertically in activity feed |
| Browser tab hidden | Reduce polling frequency when `document.hidden` |

### 3.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Dashboard load | Content fade in + slide up 4px | 300ms | [0.4, 0, 0.2, 1] |
| Welcome hero | Gradient shift on hover | 150ms | ease |
| StatBox load | Staggered fade in (50ms delay each) | 250ms each | [0.4, 0, 0.2, 1] |
| Project card hover | Scale 1.01 + shadow increase | 150ms | ease |
| Task add | Slide down + fade in | 200ms | spring |
| Task complete | Strikethrough + opacity + slide | 200ms | ease |
| Task delete | Fade out + collapse height | 200ms | ease |
| Quick action hover | Scale 1.02 + bg lighten | 150ms | ease |
| Streaming indicator | Pulse animation (scale + opacity) | 2s infinite | ease-in-out |
| Skeleton loading | Shimmer animation | 1.5s infinite | ease |
| Command palette | Scale 0.98→1 + fade in | 200ms | spring |
| Empty state | Fade in with delay (appears after cards) | 400ms | [0.4, 0, 0.2, 1] |

### 3.13 Mobile Experience

**Breakpoints:**
- **<768px:** Single column. Sidebar replaced by hamburger menu overlay. Navbar simplified (logo + hamburger + ⌘K). Welcome hero stacked vertically. Quick actions 2-column grid. Stats 2-column grid. All cards full-width. Tasks section full-width.
- **768-1023px:** Collapsed sidebar (56px icons only). Content 2-column. Quick actions 4-column.
- **≥1024px:** Full sidebar (240px). Content max-width 1200px centered. 2/3 + 1/3 card grid.

**Touch Gestures:**
- Swipe right on mobile to reveal sidebar
- Swipe left to close sidebar
- Pull-to-refresh to reload dashboard data
- Long press project card for context menu (future)

**Bottom Navigation (mobile only):**
```
┌──────────┬──────────┬──────────┬──────────┐
│ 🏠 Home  │ 📁 Worksp│ 🤖 AI    │ 👤 Profile│
└──────────┴──────────┴──────────┴──────────┘
```

### 3.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | `<main>`, `<section>`, `<nav>`, `<article>` for cards |
| Focus order | Sidebar → Navbar → Content (logical tab order) |
| Skip link | "Skip to dashboard content" bypasses sidebar |
| ARIA live | AI activity feed uses `aria-live="polite"` for new items |
| ARIA labels | All icon-only buttons have `aria-label` |
| Color contrast | All stat numbers ≥4.5:1. Status badges verified. |
| Screen reader | Card titles as headings. Empty states announced. Task list as `<ul>`. |
| Keyboard | Tab through all interactive cards. Enter to navigate. Space to toggle tasks. |
| Reduced motion | All animations disabled. Streaming indicator becomes static text. |

### 3.15 Performance

| Technique | Implementation |
|-----------|---------------|
| SWR | Stale-while-revalidate for dashboard stats, cached 30s |
| Code splitting | Dashboard sections lazy-loaded below fold |
| Skeleton loading | Immediate skeleton render, data fills in |
| Memoization | `React.memo` on StatBox, ProjectCard, QuickActionCard |
| Optimistic UI | Task add/toggle/delete updated optimistically |
| Virtual scrolling | Not needed (dashboard has bounded content) |
| Prefetch | `<Link prefetch>` on "View all" and sidebar links |
| Image optimization | Next.js Image for any dashboard illustrations |
| Suspense | Wrap data-dependent sections in `<Suspense>` with skeleton fallback |

### 3.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Real-time activity | WebSocket/SSE push for live AI activity updates |
| Team dashboard | Workspace-level dashboard showing team activity, shared stats |
| Organization overview | Organization-level dashboard aggregating all workspaces |
| Widget system | Drag-and-drop customizable dashboard widgets |
| Analytics charts | Token usage charts, cost trends, generation velocity graphs |
| Notification center | Dropdown panel with grouped notifications, mark-all-read |
| Onboarding wizard | Progressive onboarding overlay for first-time users |
| Quick capture | Global ⌘N shortcut to create from anywhere |
| Multi-workspace stats | Dropdown to switch workspace context on dashboard |
| Billing widget | Current plan usage meter, upgrade prompt for approaching limits |

---

## 4. Workspace

### 4.1 Purpose

**Primary Goal:** Provide a container for organizing projects, managing team members, and configuring workspace-level settings. Workspaces are the top-level organizational unit in PromptPilot.

**User Intent:** View all projects within a workspace, manage team access, configure workspace settings, and navigate into specific projects.

**Business Goal:** Enable teams to collaborate within shared workspaces. Support both personal workspaces (default for individual users) and team workspaces (for collaborative work). Drive adoption of team workspaces for enterprise sales.

### 4.2 User Journey

**Entry Points:**
- Sidebar "Workspaces" link → `/workspaces` (list view)
- Sidebar workspace item → `/workspace/[slug]` (single workspace)
- Dashboard "Open Workspace" button
- Dashboard Workspace Summary click
- Project page breadcrumb → Workspace link
- `⌘K` → "Go to Workspace..."

**Previous Page:**
- Dashboard
- Any page with workspace breadcrumb

**Next Pages:**
- `/project/[slug]` — Click project card within workspace
- `/workspace/[slug]/members` — Members tab
- `/workspace/[slug]/settings` — Settings tab
- `/project/new?workspace=[id]` — New project within workspace

**User Actions:**
1. **List view:** Browse all workspaces, create new, search, filter
2. **Detail view:** See workspace overview, projects list, members, activity
3. **Create workspace:** Name, slug, type (personal/team)
4. **Edit workspace:** Rename, change settings
5. **Archive workspace:** Soft-delete, recoverable
6. **Invite members:** Email invitation with role assignment (team workspaces)
7. **Manage members:** Change roles, remove members (team workspaces)
8. **Navigate to project:** Click project card to enter project context
9. **Filter projects:** By status (Draft, Active, Completed, Archived)

**Exit Points:**
- Project page (primary exit)
- Dashboard (sidebar link)
- Settings (sidebar link)

### 4.3 Complete Layout

#### Workspace List View (`/workspaces`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NAVBAR: 🏠 Home > Workspaces                          [⌘K Search]      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PAGE HEADER                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Workspaces                                          [+ New Workspace]│ │
│  │  Manage your workspaces and team projects            (primary btn)  │ │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  FILTERS + SEARCH BAR                                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  🔍 Search workspaces...        [All] [Personal] [Team] [Archived] │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  WORKSPACES GRID (3 columns desktop, 2 tablet, 1 mobile)                 │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │
│  │ ┌────────────────┐ │ │ ┌────────────────┐ │ │ ┌────────────────┐ │   │
│  │ │ 🏢 Acme Corp   │ │ │ │ 👤 Personal    │ │ │ │ 🏢 Startup XYZ │ │   │
│  │ │ 5 projects     │ │ │ │ 2 projects     │ │ │ │ 12 projects    │ │   │
│  │ │ 3 members      │ │ │ │ 1 member       │ │ │ │ 8 members      │ │   │
│  │ │ Last active: 2h │ │ │ │ Last active: 1d│ │ │ │ Last active: 5m│ │   │
│  │ │ [Open]  [•••]  │ │ │ │ [Open]  [•••]  │ │ │ │ [Open]  [•••]  │ │   │
│  │ └────────────────┘ │ │ └────────────────┘ │ │ └────────────────┘ │   │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘   │
│                                                                           │
│  EMPTY STATE (if no workspaces)                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                          📁                                         │  │
│  │                    No workspaces yet                                │  │
│  │          Create your first workspace to organize projects           │  │
│  │                     [+ Create Workspace]                            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  PAGINATION                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Showing 1-9 of 15              [← Previous]  [1] [2] [Next →]    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Workspace Detail View (`/workspace/[slug]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NAVBAR: 🏠 Home > Workspaces > Acme Corp             [⌘K Search]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  WORKSPACE HEADER                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ ┌──────────────────────────────────────────────────────────────┐   │  │
│  │ │ 🏢  Acme Corporation                    [TEAM] badge           │   │  │
│  │ │     acme-corp    5 projects · 3 members · Active             │   │  │
│  │ └──────────────────────────────────────────────────────────────┘   │  │
│  │                                                                     │  │
│  │ [Projects] [Members] [Settings] [Activity]    (tabs)               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  TAB: PROJECTS                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  🔍 Filter projects...     [+ New Project]                         │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ 📋  Mobile App Redesign          DRAFT       3 docs  2h ago  │  │  │
│  │  │ 📋  API Gateway v2               GENERATING   5 docs  5m ago  │  │  │
│  │  │ 📋  Analytics Dashboard          COMPLETED    9 docs  1d ago  │  │  │
│  │  │ 📋  Internal Tools Suite         DRAFT        0 docs  1w ago  │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  TAB: MEMBERS                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  [+ Invite Member]                                                 │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ 👤 Jane Smith (you)     Owner      jane@acme.com             │  │  │
│  │  │ 👤 Bob Johnson          Admin      bob@acme.com              │  │  │
│  │  │ 👤 Carol Williams       Editor     carol@acme.com            │  │  │
│  │  │ 👤 Dave Brown           Viewer     dave@acme.com             │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  PENDING INVITATIONS                                                │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ 📧 eve@acme.com     Editor     Sent 2d ago    [Resend] [✕]   │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  TAB: SETTINGS                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  General                                                            │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ Workspace Name:  [Acme Corporation_________________]         │  │  │
│  │  │ Slug:            [acme-corp_________________________]         │  │  │
│  │  │ Type:            [TEAM ▼]                                     │  │  │
│  │  │                                        [Save Changes]         │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  Danger Zone                                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │ ⚠️ Archive this workspace                                     │  │  │
│  │  │ This will hide the workspace from all members.                │  │  │
│  │  │ You can restore it within 30 days.           [Archive Workspace]│  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `PageHeader` | Organism | Title, description, primary action button |
| `Button` (primary) | Atom | "New Workspace", "New Project", "Invite Member" |
| `Button` (secondary) | Atom | "Open" workspace/project |
| `Button` (danger) | Atom | "Archive Workspace" |
| `Button` (ghost) | Atom | Context menu trigger (•••) |
| `SearchBar` | Molecule | Filter workspaces/projects by name with debounce |
| `Tabs` | Molecule | Projects, Members, Settings, Activity tabs |
| `WorkspaceCard` | Molecule | Workspace preview: icon, name, stats, actions |
| `Badge` | Atom | Workspace type (Personal, Team), project status |
| `Table` / `DataTable` | Organism | Projects list and members list with sortable columns |
| `DropdownMenu` | Molecule | Context menu per item (•••) with Edit, Archive, etc. |
| `Dialog` | Molecule | Create/Edit workspace modal, Invite member modal, Archive confirmation |
| `Input` | Atom | Form fields for workspace name, slug, member email |
| `Select` | Atom | Role dropdown (Admin, Editor, Viewer) |
| `Pagination` | Molecule | Page navigation for lists |
| `EmptyState` | Organism | No workspaces, no projects, no members |
| `Skeleton` | Atom | Loading rows for table |
| `Avatar` | Atom | Member profile images |
| `Toast` | Molecule | Success/error notifications for actions |
| `Tooltip` | Atom | Hover details on truncated names |

### 4.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Create workspace | Click "New Workspace" | Open dialog with name, slug (auto-generated), type fields |
| Edit workspace | ••• → Edit / Settings tab | Open dialog or edit inline, save on confirm |
| Archive workspace | ••• → Archive / Danger zone | Confirmation dialog, soft delete (recoverable 30 days) |
| Restore workspace | From archived filter | API call to remove `deletedAt` |
| Delete workspace | Permanent delete option | Confirmation dialog with name typing, hard delete |
| Search workspaces | Type in search bar | Debounced (300ms) filter of workspace list |
| Filter workspaces | Click filter tabs | Show All / Personal / Team / Archived |
| Create project | Click "New Project" | Open dialog or navigate to new project page with workspace context |
| Navigate to project | Click project row | Navigate to `/project/[slug]` |
| Invite member | Click "Invite Member" | Dialog: email input + role select → POST invitation |
| Resend invitation | Click "Resend" | POST re-send invite email |
| Revoke invitation | Click ✕ | DELETE invitation |
| Change member role | Role dropdown | PATCH member role with confirmation |
| Remove member | ••• → Remove | Confirmation dialog |
| Leave workspace | ••• → Leave | Confirmation dialog (non-owners only) |
| Copy invite link | ••• → Copy link | Copy token URL to clipboard, toast confirmation |
| Rename workspace | Settings tab → edit name | PATCH workspace, optimistic update |
| Change slug | Settings tab → edit slug | PATCH workspace, validate uniqueness client + server |

**Keyboard Shortcuts:**
- `N` — New Project (within workspace context)
- `I` — Invite Member
- `/` — Focus search bar
- `Esc` — Close dialog/modal
- `Enter` — Confirm dialog action

### 4.6 AI Features

| Feature | Description |
|---------|-------------|
| Workspace Activity Summary | AI-generated summary of recent activity across all projects |
| Project Health Score | AI analysis of documentation completeness and staleness |
| Smart Project Grouping | Auto-suggest group projects by domain, tech stack, or status |
| Staleness Detection | AI flags documents that may be out of date based on upstream changes |

### 4.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Loading (list) | Skeleton cards (3-6) with shimmer | Fetch workspaces list |
| Loading (detail) | Page skeleton with tab placeholders | Fetch workspace + projects |
| Empty (no workspaces) | Empty state illustration with create CTA | First-time user |
| Empty (no projects) | Empty state with "Create your first project" | New workspace |
| Empty (no members) | Only owner shown. "Invite your team" hint. | Single-user workspace |
| Error (fetch) | Error state with retry button | Network or server error |
| Error (create) | Validation errors on form fields | Duplicate slug, invalid name |
| Error (permission) | "You don't have access to this workspace" | Viewer trying admin action |
| Saving | Button shows spinner, form fields disabled | Optimistic update with rollback |
| Archiving | Loading state on archive dialog confirm | Soft delete API call |
| Read-only | Edit buttons hidden/greyed, no drag handles | Viewer role |

### 4.8 Permissions

| Action | Owner | Admin | Editor | Viewer |
|--------|-------|-------|--------|--------|
| View workspace | ✅ | ✅ | ✅ | ✅ |
| Edit workspace settings | ✅ | ✅ | ❌ | ❌ |
| Archive workspace | ✅ | ❌ | ❌ | ❌ |
| Create project | ✅ | ✅ | ✅ | ❌ |
| View projects | ✅ | ✅ | ✅ | ✅ |
| Edit any project | ✅ | ✅ | ✅ (own) | ❌ |
| Archive any project | ✅ | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ |
| Change member roles | ✅ | ✅ | ❌ | ❌ |
| Leave workspace | ✅ | ✅ | ✅ | ✅ |

### 4.9 API Integration

#### List Workspaces

```
GET /api/v1/workspaces?page=1&limit=20
Cookie: accessToken={token}

Response 200:
{
  "success": true,
  "data": [Workspace[]],
  "meta": { "total": 5, "page": 1, "limit": 20 }
}
```

#### Get Workspace

```
GET /api/v1/workspaces/:id
Cookie: accessToken={token}

Response 200:
{ "success": true, "data": { Workspace with members, projectCount } }
```

#### Create Workspace

```
POST /api/v1/workspaces
{ "name": "Acme Corp", "slug": "acme-corp" }

Response 201:
{ "success": true, "data": Workspace }
```

#### Update Workspace

```
PATCH /api/v1/workspaces/:id
{ "name": "New Name" }

Response 200:
{ "success": true, "data": Workspace }
```

#### Archive Workspace

```
DELETE /api/v1/workspaces/:id
// Soft delete — sets deletedAt

Response 200:
{ "success": true, "data": { "message": "Workspace archived" } }
```

#### List Projects in Workspace

```
GET /api/v1/projects?workspaceId={id}&page=1&limit=20
Cookie: accessToken={token}

Response 200:
{ "success": true, "data": [Project[]], "meta": { "total": 12, "page": 1, "limit": 20 } }
```

#### Future: Invitations API

```
POST /api/v1/workspaces/:id/invitations
{ "email": "bob@acme.com", "role": "EDITOR" }

Response 201:
{ "success": true, "data": Invitation }
```

#### Future: Members API

```
POST /api/v1/workspaces/:id/members
{ "userId": "...", "role": "EDITOR" }

PATCH /api/v1/workspaces/:id/members/:userId
{ "role": "ADMIN" }

DELETE /api/v1/workspaces/:id/members/:userId
```

### 4.10 Database Mapping

**Workspace model:**
- `id`, `name`, `slug`, `ownerId`, `type` (PERSONAL/TEAM), `status` (ACTIVE/ARCHIVED), `settings` (JSON), `deletedAt`
- Relations: `owner` (User), `members` (WorkspaceMember[]), `projects` (Project[]), `apiKeys` (APIKey[])

**WorkspaceMember model:**
- `id`, `workspaceId`, `userId`, `role` (ADMIN/EDITOR/VIEWER), `joinedAt`
- Unique: `[workspaceId, userId]`

**Indexes:** `ownerId + slug` (unique), `status` on Workspace. `userId` on WorkspaceMember.

**Pagination:** Offset-based via `skip/take`. List sorted by `updatedAt` desc.

### 4.11 Edge Cases

| Case | Handling |
|------|----------|
| No internet | SWR returns cached workspace data. Actions queued for retry. |
| Expired token | Auto-refresh. Redirect to login if fails. |
| Duplicate slug | 409 error, show "This slug is already taken" inline error |
| Deleted workspace access | 404 redirect with toast "Workspace not found or has been archived" |
| Empty workspace | Default personal workspace created on registration |
| Last member leaves | Prevent removal: "Workspace must have at least one member" |
| Owner leaves | Prevent: "Transfer ownership before leaving" |
| Very large workspace | Pagination (20 per page). Search instead of scroll for 50+ projects. |
| Concurrent edits | Last-write-wins for settings. Optimistic with version check. |
| Archival race condition | Check `deletedAt` before operations, return 404 if archived |

### 4.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load | Content fade in + slide up 4px | 300ms | [0.4, 0, 0.2, 1] |
| Tab switch | Content crossfade | 200ms | ease |
| Create dialog | Scale 0.95→1 + fade in | 250ms | spring |
| Project row hover | bg-color transition | 150ms | ease |
| Member add | Row slide down + fade in | 250ms | [0.4, 0, 0.2, 1] |
| Member remove | Row fade out + collapse | 200ms | ease-in |
| Invitation send | Button sparkle → spinner → check | 600ms | — |
| Archive confirm | Dialog shake if type name mismatches | 400ms | spring |
| Empty state | Delayed fade in with icon bounce | 500ms | spring |
| Search filter | Results stagger fade in (30ms each) | 200ms | ease |

### 4.13 Mobile Experience

- Single column layout. Workspace cards full-width.
- Tabs collapse to horizontal scroll on mobile.
- Member list as stacked cards instead of table.
- Create/invite buttons become FAB (floating action button) on mobile, bottom-right.
- Swipe left on project row for quick actions (archive, duplicate).
- Bottom navigation: Home, Workspaces, Projects, Settings.

### 4.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | `<table>` for data tables with `<thead>`, `<tbody>`, proper `<th scope>` |
| Focus management | Focus trapped in create/edit dialogs. Focus returns to trigger on close. |
| ARIA labels | `aria-label` on icon-only buttons. `aria-expanded` on dropdowns. |
| Screen reader | Table rows announced with row count. Role badges read. Actions described. |
| Keyboard | Tab through list items, Enter to open, Space for checkboxes, Arrow keys between tabs |
| Contrast | All status badges meet 4.5:1 text contrast or 3:1 large text |
| Error announcement | Validation errors announced via `aria-describedby` + `role="alert"` |

### 4.15 Performance

| Technique | Implementation |
|-----------|---------------|
| SWR | Workspace list + projects cached with 30s revalidation |
| Pagination | Server-side pagination, 20 items per page |
| Search debounce | 300ms debounce on workspace/project search |
| Lazy tabs | Members and Activity tabs load data on first selection |
| Memoization | `React.memo` on workspace cards, project rows |
| Optimistic UI | Workspace rename, project archive, member role change |
| Suspense | Tab content wrapped in `<Suspense>` with skeleton fallback |

### 4.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Real-time collaboration | WebSocket presence indicators showing who's viewing workspace |
| Team visibility | Organization hierarchy — multiple workspaces under one org |
| Workspace templates | Pre-configured workspace with sample projects and pipeline steps |
| Custom roles | RBAC with custom permission sets beyond Admin/Editor/Viewer |
| Audit log | Full activity feed per workspace: who did what, when |
| Billing per workspace | Workspace-level subscription with usage quotas |
| Workspace transfer | Transfer ownership to another user or organization |
| API keys management | Per-workspace API key generation, scoping, and rotation |
| Webhook integration | Workspace-level webhook subscriptions for events |
| Cross-workspace search | Global search across all workspaces with permission scoping |

---

## 5. Project

### 5.1 Purpose

**Primary Goal:** Serve as the central hub for a single software specification project — displaying all generated documents (pipeline steps), managing the AI generation pipeline, tracking document statuses, and providing entry points into document viewing, editing, and generation workflows.

**User Intent:** View all documents for a project, understand what's been generated vs what's pending, trigger AI generation for specific pipeline steps, and navigate into individual documents for detailed editing.

**Business Goal:** Demonstrate the core value proposition — the complete 9-step specification pipeline. Make the generation workflow intuitive, fast, and satisfying. Drive users to complete all pipeline steps (increasing platform stickiness).

### 5.2 User Journey

**Entry Points:**
- Workspace project list → Click project
- Dashboard recent projects → Click project
- Sidebar project list (future)
- `⌘K` → Search project by name
- Direct URL: `/project/[slug]`
- Post-project-creation redirect

**Previous Page:**
- Workspace detail
- Dashboard
- New Project dialog/form

**Next Pages:**
- `/project/[slug]/chat` — AI Chat for this project
- `/project/[slug]/prd` — View/edit specific document (PRD, SRS, etc.)
- `/project/[slug]/editor` — Full document editor
- `/project/[slug]/versions` — Version history
- `/project/[slug]/export` — Export suite
- `/project/[slug]/conversations` — AI conversation history

**User Actions:**
1. View project overview: name, description, status, workspace context
2. Run full pipeline — generate all 9 documents at once
3. Generate individual document — trigger generation for one step
4. Navigate to document — click document card to view/edit
5. Track generation progress — see which steps are running, completed, failed
6. Regenerate document — re-run AI generation for a step
7. Compare versions — access version history for a document
8. Export project — download all documents as suite
9. Edit project settings — rename, change description, archive
10. Duplicate project — copy with all documents

**Exit Points:**
- Document page (edit/view)
- AI Chat
- Export page
- Workspace (back navigation)
- Dashboard (sidebar)

### 5.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NAVBAR: 🏠 Home > Workspaces > Acme Corp > Mobile App Redesign   [⌘K]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PROJECT HEADER                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ ┌──────────────────────────────────────────────────────────────┐   │  │
│  │ │ 📋  Mobile App Redesign                                       │   │  │
│  │ │     A complete redesign of our iOS and Android applications   │   │  │
│  │ │     Status: Active  ·  Workspace: Acme Corp  ·  Created 3d   │   │  │
│  │ └──────────────────────────────────────────────────────────────┘   │  │
│  │                                                                     │  │
│  │ [Run Full Pipeline]  [AI Chat]  [Export]  [...]  (actions)        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  PIPELINE PROGRESS BAR                                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  9 step pipeline: ●━━●━━●━━◐━━○━━○━━○━━○━━○━━○    4/9 complete  │  │
│  │  [MC]→[PRD]→[SRS]→[ARCH]→[DB]→[API]→[FLOW]→[WIRE]→[MAP]         │  │
│  │   ✓    ✓     ✓    ⟳ gen  ○     ○      ○      ○      ○            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  DOCUMENTS GRID (3 columns)                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ 📋 Master Context │ │ 📋 PRD           │ │ 📋 SRS            │         │
│  │ ─────────────────│ │ ─────────────────│ │ ─────────────────│         │
│  │ ✓ Generated      │ │ ✓ Generated       │ │ ✓ Generated       │         │
│  │ v3 · 2.4k tokens │ │ v2 · 8.2k tokens │ │ v1 · 12k tokens  │         │
│  │ 2h ago           │ │ 1d ago           │ │ 1d ago           │         │
│  │ [View] [Edit]    │ │ [View] [Regen]   │ │ [View] [Regen]   │         │
│  │ [•••]            │ │ [•••]            │ │ [•••]            │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│                                                                           │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ 🏗 Architecture   │ │ 🗄️ DB Schema     │ │ 📡 API Spec      │         │
│  │ ─────────────────│ │ ─────────────────│ │ ─────────────────│         │
│  │ ⟳ Generating...  │ │ ○ Not started    │ │ ○ Not started    │         │
│  │ [Cancel]         │ │ [Generate]       │ │ [Generate]       │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│                                                                           │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ 📊 User Flows     │ │ 🎨 Wireframes    │ │ 🗺️ Roadmap       │         │
│  │ ─────────────────│ │ ─────────────────│ │ ─────────────────│         │
│  │ ○ Not started    │ │ ○ Not started    │ │ ○ Not started    │         │
│  │ [Generate]       │ │ [Generate]       │ │ [Generate]       │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│                                                                           │
│  STREAMING PANEL (visible when generation is active, right sidebar)      │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  ⟳ Generating Architecture...                                       ││
│  │  ──────────────────────────────────────────────────────────────────  ││
│  │  # System Architecture                                               ││
│  │                                                                       ││
│  │  ## Overview                                                         ││
│  │  The Mobile App Redesign follows a microservices architecture with   ││
│  │  a React Native frontend, Node.js API gateway, and PostgreSQL... █   ││
│  │                                                                       ││
│  │  Tokens: 1.2k/16k · Cost: $0.03 · Elapsed: 4.2s                     ││
│  │  [Cancel Generation]                                                 ││
│  └──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** Project header (sticky top). Pipeline progress bar (sticky below header). Streaming panel (fixed right side, collapsible).

**Responsive Behavior:**
- **Desktop (≥1280px):** 3-column document grid + optional streaming sidebar
- **Tablet (768-1279px):** 2-column grid, streaming panel as bottom drawer
- **Mobile (<768px):** Single column document cards, streaming as full-width bottom panel

### 5.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `PageHeader` | Organism | Project name, description, status badge, action buttons |
| `Button` (primary) | Atom | "Run Full Pipeline", "Generate", "View" |
| `Button` (secondary) | Atom | "AI Chat", "Export", "Edit" |
| `Button` (ghost) | Atom | Context menu trigger (•••) per document |
| `Button` (danger) | Atom | "Cancel Generation", "Archive Project" |
| `Breadcrumbs` | Molecule | Full path: Home > Workspaces > [Workspace] > [Project] |
| `Badge` | Atom | Document status: Draft, Generated, Reviewed, Stale, Generating |
| `ProgressBar` | Molecule | Pipeline completion progress (4/9) with step indicators |
| `PipelineProgress` | Organism | Visual 9-step pipeline with status indicators per step |
| `DocumentCard` | Molecule | Per-document preview: type icon, title, status, stats, actions |
| `StreamingPanel` | Organism | Live AI generation output with cancel button |
| `DropdownMenu` | Molecule | Context menu: View, Edit, Regenerate, Versions, Export, Duplicate |
| `Dialog` | Molecule | Regenerate confirmation, Archive confirmation, Run Full Pipeline confirm |
| `Skeleton` | Atom | Document card loading placeholders |
| `Spinner` | Atom | Generation in progress indicator |
| `Tooltip` | Atom | Pipeline step descriptions on hover |
| `Toast` | Molecule | Pipeline completion, generation failure notifications |

### 5.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| View project | Navigate to project | Load project data + all documents |
| Run full pipeline | Click "Run Full Pipeline" | Confirmation dialog → sequential step generation, progress tracking |
| Generate document | Click "Generate" on card | POST `/pipeline/generate` with projectId + stepId, open streaming panel |
| Regenerate document | ••• → Regenerate / "Regen" btn | Confirmation: "This will create a new version. Continue?" → POST generate |
| Cancel generation | Click "Cancel" | POST cancel endpoint, mark conversation CANCELLED, preserve partial output |
| View document | Click "View" | Navigate to document viewer page |
| Edit document | Click "Edit" | Navigate to full editor |
| View versions | ••• → Versions | Navigate to version history page |
| Open AI Chat | Click "AI Chat" | Navigate to project chat page |
| Export project | Click "Export" | Navigate to export page with project pre-selected |
| Rename project | ••• → Rename | Inline edit or dialog with name/slug fields |
| Archive project | ••• → Archive | Confirmation dialog → soft delete |
| Duplicate project | ••• → Duplicate | Dialog: enter new name → POST create with copied settings |
| Favorite project | Click star icon | Toggle favorite status |
| Search documents | Search bar (future) | Filter document cards by name/type |

**Keyboard Shortcuts:**
- `G` — Generate selected document
- `R` — Regenerate selected document
- `E` — Edit selected document
- `V` — View selected document
- `F` — Run Full Pipeline
- `Esc` — Cancel generation / close panel
- `←` `→` — Navigate between pipeline steps
- `Enter` — Open selected document

### 5.6 AI Features

| Feature | Description |
|---------|-------------|
| Pipeline Orchestration | AI runs 9-step pipeline in dependency order (Master Context → PRD → SRS → Architecture → DB Schema → API Spec → User Flows → Wireframes → Roadmap) |
| Streaming Generation | Real-time SSE streaming showing AI composing documents token-by-token |
| Context Injection | Each step receives master context + upstream artifacts as AI context |
| Dependency Awareness | Pipeline respects step dependencies (e.g., Architecture must complete before DB Schema) |
| Parallel Generation | Independent steps (DB Schema + User Flows) can run concurrently |
| Token + Cost Tracking | Per-generation token count, cost estimation, and total project cost display |
| Auto-regeneration (stale) | When upstream document changes, downstream documents marked STALE with option to auto-regenerate |
| Smart Suggestions | "Architecture changed — DB Schema and API Spec may need updates" |

### 5.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Loading | Skeleton cards for 9 documents, progress bar shimmer | Fetch project + documents |
| Empty (no docs) | All 9 cards show "Not started" with Generate button | Fresh project |
| Partial generation | Mix of Generated, Generating, Not Started cards | Mid-pipeline |
| Full generation | All 9 cards show "Generated" with version numbers | Complete project |
| Streaming | Right panel shows live AI output, stop button, token counter | SSE connection active |
| Streaming error | Panel shows error: "Generation failed. [Retry] [View Partial]" | AI timeout or error |
| Stale documents | Yellow STALE badge with "Regenerate suggested" tooltip | Upstream changed |
| Archiving | Dialog with spinner, all cards greyed out during transition | Soft delete API call |
| Read-only | Generate/Edit buttons hidden, View only | Viewer role |
| Permission denied | Toast: "You don't have permission to generate documents" | Unauthorized action |
| Rate limited | Toast: "Rate limit reached. Try again in 30s." | API rate limit |
| Offline | Cached project view. "You're offline" banner. Actions disabled. | Network loss |

### 5.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| View project + documents | ✅ | ✅ | ✅ |
| Run full pipeline | ✅ | ✅ | ❌ |
| Generate individual doc | ✅ | ✅ | ❌ |
| Regenerate document | ✅ | ✅ | ❌ |
| Cancel generation | ✅ | ✅ | ❌ |
| Edit project settings | ✅ | ✅ (own) | ❌ |
| Archive project | ✅ | ❌ | ❌ |
| Duplicate project | ✅ | ✅ | ❌ |
| Export | ✅ | ✅ | ✅ |
| Favorite project | ✅ | ✅ | ✅ |
| Add comments | ✅ | ✅ | ✅ (future) |

### 5.9 API Integration

#### Get Project

```
GET /api/v1/projects/:id

Response 200:
{ "success": true, "data": { Project with documents, conversations } }
```

#### List Project Documents

```
GET /api/v1/projects/:id/documents

Response 200:
{ "success": true, "data": { "documents": [Document[]] } }
```

#### Generate Document

```
POST /api/v1/pipeline/generate
{
  "projectId": "uuid",
  "stepId": "architecture",
  "userInput": "Use microservices with event-driven communication"
}

Response 200:
{
  "success": true,
  "data": {
    "document": { "id": "uuid", "title": "System Architecture", "status": "GENERATED", "version": 1, "content": "..." }
  }
}
```

#### Generate Document (Streaming)

```
POST /api/v1/pipeline/generate/stream
{ "projectId": "uuid", "stepId": "architecture", "userInput": "..." }

// SSE stream:
data: {"content": "# System Architecture\n\n## Overview\n..."}
data: {"content": "The system uses..."}
data: [DONE]

// Or error:
data: {"error": "API rate limit exceeded"}
```

#### Run Full Pipeline

```
POST /api/v1/pipeline/run
{ "projectId": "uuid", "userInput": "Complete specification for mobile app redesign" }

Response 200:
{
  "success": true,
  "data": {
    "results": [
      { "stepId": "master-context", "status": "completed" },
      { "stepId": "prd", "status": "completed" },
      { "stepId": "srs", "status": "failed" },
      ...
    ]
  }
}
```

#### Update Project

```
PATCH /api/v1/projects/:id
{ "name": "New Project Name", "description": "Updated description" }

Response 200:
{ "success": true, "data": Project }
```

#### Archive Project

```
DELETE /api/v1/projects/:id
// Soft delete — sets deletedAt

Response 200:
{ "success": true, "data": { "message": "Project archived" } }
```

**Loading Behavior:** Show skeleton cards during project fetch. Document cards show spinner during generation. Streaming panel shows live content.

**Optimistic Updates:** Project rename, favorite toggle, archive use optimistic UI with rollback on failure.

**Retry Logic:** Failed generation can be retried manually. Streaming uses SSE reconnect with exponential backoff.

### 5.10 Database Mapping

**Project model:**
- `id`, `name`, `slug`, `description`, `workspaceId`, `ownerId`, `status` (DRAFT/ACTIVE/COMPLETED/ARCHIVED), `settings` (JSON), `deletedAt`
- Relations: `workspace`, `owner`, `documents`, `aiConversations`, `exports`

**Document model:**
- `id`, `projectId`, `stepId`, `title`, `type` (MASTER_CONTEXT through ROADMAP), `content` (Text), `status` (DRAFT/GENERATED/REVIEWED/STALE), `version`, `conversationId`, `tokensUsed`, `modelUsed`, `stale`, `staleReason`
- Unique: `[projectId, stepId]`

**Indexes:** `workspaceId + slug` (unique), `ownerId`, `status` on Project. `projectId + type`, `conversationId`, `status` on Document.

**Pagination:** Documents fetched all at once (max 9 per project). Projects list paginated.

### 5.11 Edge Cases

| Case | Handling |
|------|----------|
| No internet | Cached project view. Generation actions disabled with offline warning. |
| Expired token | Auto-refresh. If fails, save project context to return after re-login. |
| Deleted project | 404 page: "This project has been archived or deleted" with back navigation |
| Empty project | All 9 document cards show "Not started". "Run Full Pipeline" prominent CTA. |
| AI timeout | Generation fails after 120s. Error state with partial content preserved. Retry button. |
| Concurrent generation | Only one generation per document at a time. "A generation is already running" toast. |
| Upstream dependency change | Downstream docs marked STALE. "Regenerate suggested" prompt. |
| Very large document | Content truncated in preview cards (first 200 chars). Full content in editor. |
| Generation cost warning | For projects exceeding cost threshold, show: "Estimated cost: $0.50. Continue?" |
| Failed pipeline step | Non-blocking — remaining steps continue. Failed step shows error + retry. |
| Streaming disconnection | Auto-reconnect with backoff. Preserve received content. Show "Reconnecting..." indicator. |
| Slug conflicts on rename | 409 error, show inline validation: "This name is already taken" |

### 5.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load | Document cards stagger fade in + slide up | 50ms delay each | [0.4, 0, 0.2, 1] |
| Generation start | Card border pulse indigo → spinner | 300ms | ease |
| Streaming content | Typewriter effect with cursor blink | 50ms per chunk | linear |
| Generation complete | Card border flash green → solid. Badge update. | 400ms | ease |
| Generation fail | Card border flash red. Shake animation. | 400ms | spring |
| Pipeline progress | Progress bar fill animation | 600ms | [0.4, 0, 0.2, 1] |
| Document card hover | Scale 1.01 + shadow-lg + bg shift | 150ms | ease |
| Streaming panel open | Slide in from right + fade | 250ms | [0.4, 0, 0.2, 1] |
| Cancel generation | Panel slide out right | 200ms | ease-in |
| Regenerate confirm | Dialog scale 0.95→1 | 200ms | spring |
| Stale badge appear | Badge fade in + subtle pulse | 300ms | ease |
| Archive success | Cards collapse + navigate away | 400ms | [0.4, 0, 1, 1] |

### 5.13 Mobile Experience

- Single column document cards, stacked vertically
- Streaming panel as bottom sheet (swipe up to expand, swipe down to minimize)
- Pipeline progress bar simplified to "4/9 complete" text + bar
- Run Full Pipeline button becomes prominent FAB (bottom right)
- Document cards show status icon + name only, expand on tap for details
- Pull-to-refresh to reload project and document statuses

### 5.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | Document cards as `<article>`, pipeline progress as `<progress>` element |
| Focus order | Project header → pipeline progress → document cards (left→right, top→bottom) |
| Live regions | `aria-live="polite"` on streaming panel for screen reader announcements |
| Status announcements | "Generating Architecture...", "Architecture generation complete" via live region |
| Keyboard | Tab through document cards. Enter to view. G key for generate. |
| Color | Status not only indicated by color — text badges + icons as well |
| Reduced motion | Stream typewriter replaced with instant text. Stagger removed. |

### 5.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Document card virtualization | Not needed (max 9). All rendered. |
| Streaming via SSE | EventSource with reconnect. Incremental DOM updates (append-only). |
| Optimistic UI | Favorite toggle, archive, rename all optimistic with rollback |
| SWR caching | Project data cached 30s. Auto-refresh on window focus. |
| Memoized cards | `React.memo` on DocumentCard with shallow prop comparison |
| Suspense boundaries | Each section wrapped in Suspense with skeleton fallback |
| Generation polling | Fallback polling every 3s if SSE connection drops |

### 5.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Real-time collaboration | Multiple users viewing same project with presence indicators on document cards |
| Custom pipeline steps | User-defined pipeline beyond the 9 standard steps |
| Document comparison | Side-by-side diff viewer for version comparison |
| Batch actions | Select multiple documents for batch regenerate/export/delete |
| Drag-and-drop reorder | Reorder pipeline steps (where dependency allows) |
| Kanban view | Alternative project view as Kanban board by status |
| Timeline view | Gantt-style project timeline with generation history |
| Templates | Project templates with pre-configured pipeline and settings |
| Marketplace integration | Install community pipeline steps and document templates |
| Analytics dashboard | Per-project analytics: tokens, cost, time spent, completion rate |

---

## 6. AI Chat

### 6.1 Purpose

**Primary Goal:** Provide a ChatGPT-like conversational interface within the project context for discussing, refining, brainstorming, and iterating on specification documents. Unlike the structured pipeline, AI Chat offers free-form, multi-turn conversation with full project context.

**User Intent:** Discuss project ideas, ask the AI to clarify or expand on generated documents, brainstorm alternative approaches, refine requirements before regenerating documents, and explore "what-if" scenarios.

**Business Goal:** Increase user engagement through conversational AI. Create stickiness by making the AI an active collaborator throughout the specification process. Differentiate from simple "prompt → output" tools by offering ongoing dialogue.

### 6.2 User Journey

**Entry Points:**
- Project page "AI Chat" button
- Sidebar "Conversations" link
- Document page "Ask AI about this document" button
- `⌘K` → "Open AI Chat"
- Direct URL: `/project/[slug]/chat`

**Previous Page:**
- Project page (primary)
- Document page (contextual entry)

**Next Pages:**
- Back to project page
- Document page (if AI suggests specific document edits)
- Generate from chat: "Apply this to the PRD" → navigate to document

**User Actions:**
1. Send free-form messages to discuss the project
2. Reference generated documents in conversation
3. Ask AI to explain, expand, summarize, or critique documents
4. Request alternative approaches or suggestions
5. Start new conversation threads for different topics
6. Browse conversation history
7. Copy AI responses to clipboard
8. Apply AI suggestions directly to documents
9. Regenerate last AI response
10. Switch between conversation threads

**Exit Points:**
- Project page
- Document page (via "Apply to Document")
- Back to conversation list

### 6.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  PROJECT CHAT LAYOUT                                              │
│                                                                   │
│  ┌──────────┐ ┌────────────────────────────────────────────────┐ │
│  │CONV      │ │  CHAT HEADER                                    │ │
│  │LIST      │ │  ┌────────────────────────────────────────────┐ │ │
│  │(sidebar) │ │  │ 💬  Architecture Discussion     [•••] [✕] │ │ │
│  │          │ │  │     Project: Mobile App Redesign           │ │ │
│  │ [+ New]  │ │  │     Model: GPT-4o  ·  Context: Full project│ │ │
│  │          │ │  └────────────────────────────────────────────┘ │ │
│  │ 📝 PRD   │ │                                                 │ │
│  │   Discuss│ │  ┌────────────────────────────────────────────┐ │ │
│  │   scope  │ │  │  MESSAGES AREA (flex-1, overflow-y-auto)    │ │ │
│  │   2h ago │ │  │                                            │ │ │
│  │          │ │  │  ┌──────────────────────────────────────┐ │ │ │
│  │ 🏗 Arch  │ │  │  │ 👤 You                    2:45 PM   │ │ │ │
│  │   discuss│ │  │  │ ┌──────────────────────────────────┐ │ │ │ │
│  │   ion ▶ │ │  │  │ │ Should we use microservices or   │ │ │ │
│  │   now    │ │  │  │ │ a modular monolith for the API?  │ │ │ │
│  │          │ │  │  └──────────────────────────────────┘ │ │ │ │
│  │ 🗄️ DB    │ │  │  └──────────────────────────────────────┘ │ │ │
│  │   schema │ │  │                                            │ │ │
│  │   1d ago │ │  │  ┌──────────────────────────────────────┐ │ │ │
│  │          │ │  │  │ 🤖 PromptPilot AI          2:45 PM  │ │ │ │
│  │          │ │  │  │ ┌──────────────────────────────────┐ │ │ │ │
│  │          │ │  │  │ │ Given your project's requirements│ │ │ │ │
│  │          │ │  │  │ │ for the Mobile App Redesign, I   │ │ │ │ │
│  │          │ │  │  │ │ recommend a modular monolith     │ │ │ │ │
│  │          │ │  │  │ │ approach initially because:      │ │ │ │ │
│  │          │ │  │  │ │                                  │ │ │ │ │
│  │          │ │  │  │ │ 1. Your team size (3 engineers)  │ │ │ │ │
│  │          │ │  │  │ │ 2. Early stage (pre-PMF)         │ │ │ │ │
│  │          │ │  │  │ │ 3. Tight launch timeline (6 wks) │ │ │ │ │
│  │          │ │  │  │ │                                  │ │ │ │ │
│  │          │ │  │  │ │ You can extract microservices   │ │ │ │ │
│  │          │ │  │  │ │ later as the app scales.        │ │ │ │ │
│  │          │ │  │  └──────────────────────────────────┘ │ │ │ │
│  │          │ │  │  ┌──────────────────────────────────┐ │ │ │ │
│  │          │ │  │  │ [📋 Copy] [👍] [👎] [🔄 Regen]    │ │ │ │ │
│  │          │ │  │  │ [Apply to Architecture Document] │ │ │ │ │
│  │          │ │  │  └──────────────────────────────────┘ │ │ │ │
│  │          │ │  │  └──────────────────────────────────────┘ │ │ │
│  │          │ │  └────────────────────────────────────────────┘ │ │
│  │          │ │                                                 │ │
│  │          │ │  ┌────────────────────────────────────────────┐ │ │
│  │          │ │  │  CHAT INPUT                                 │ │ │
│  │          │ │  │  ┌────────────────────────────────────────┐ │ │ │
│  │          │ │  │  │ Type a message about your project...  █│ │ │ │
│  │          │ │  │  │                              [📎] [➤] │ │ │ │
│  │          │ │  │  └────────────────────────────────────────┘ │ │ │
│  │          │ │  │  Context: Architecture document · 8.2k tok │ │ │ │
│  │          │ │  │  Token usage: 1.2k/16k · Cost: ~$0.02     │ │ │ │
│  │          │ │  └────────────────────────────────────────────┘ │ │
│  └──────────┘ └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** Chat header (top of chat area). Chat input (bottom of chat area). Conversation list sidebar (left, independently scrollable).

**Responsive Behavior:**
- **Desktop (≥1024px):** Conversation list sidebar (260px) + chat area side by side
- **Tablet (768-1023px):** Collapsible conversation list (toggle button). Chat area full width when collapsed.
- **Mobile (<768px):** Full-screen chat view. Conversation list as back-navigation or bottom sheet.

### 6.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `ConversationList` | Organism | Sidebar list of past conversations with preview and timestamps |
| `ConversationItem` | Molecule | Single conversation: title, preview text, timestamp, active indicator |
| `ChatHeader` | Organism | Current conversation title, model info, context settings, actions |
| `ChatMessage` | Molecule | Single message bubble with role (user/assistant), content, timestamp |
| `MessageContent` | Molecule | Rendered Markdown with syntax highlighting, code blocks |
| `MessageActions` | Molecule | Copy, thumbs up/down, regenerate, apply-to-document buttons |
| `ChatInput` | Organism | Multi-line input with send button, context indicator, token counter |
| `Button` (primary/icon) | Atom | Send message button (➤). New conversation (+). |
| `Button` (ghost) | Atom | Message action buttons: Copy, Like, Dislike, Regenerate |
| `DropdownMenu` | Molecule | Conversation context menu: Rename, Delete, Export, Clear |
| `Dialog` | Molecule | Delete conversation confirmation |
| `Badge` | Atom | Model name badge (GPT-4o, Claude 3.5) |
| `Spinner` | Atom | AI thinking/streaming indicator |
| `Skeleton` | Atom | Message loading placeholder |
| `Tabs` | Molecule | Context selection: "Full Project" / "Architecture Only" / "Custom" |
| `Toast` | Molecule | "Copied to clipboard", "Applied to document" |
| `Tooltip` | Atom | Token count breakdown, model info |

### 6.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Send message | Type + Enter/click Send | POST message, stream AI response |
| New conversation | Click "+ New" | Create fresh conversation, auto-title from first message |
| Select conversation | Click conversation item | Load conversation history with messages |
| Rename conversation | Double-click title / ••• → Rename | Inline edit or dialog |
| Delete conversation | ••• → Delete | Confirmation dialog → DELETE API call |
| Copy message | Click copy icon | Copy to clipboard, toast confirmation |
| Regenerate response | Click regenerate | Re-run last message with same context, replace AI response |
| Rate response | Click 👍/👎 | Record feedback for model improvement |
| Apply to document | Click "Apply to Document" | Open document picker → insert AI content into document |
| Edit message | Click edit icon on user message | Inline edit → resubmit with new text |
| Clear conversation | ••• → Clear | Remove all messages, keep conversation shell |
| Scroll to bottom | Auto-scroll on new message/AI response | Smooth scroll, stop if user scrolled up manually |
| Stop generation | Click stop button (during streaming) | Cancel SSE stream, preserve partial response |
| Change context | Select context scope | Update system prompt to include specific documents only |
| Attach document | Click 📎 (future) | Reference specific document section in message |

**Keyboard Shortcuts:**
- `Enter` — Send message (Shift+Enter for newline)
- `Esc` — Stop generation / close conversation
- `⌘K` — Focus chat input
- `↑` — Edit last message (when input empty)
- `⌘←` `⌘→` — Navigate between conversations

### 6.6 AI Features

| Feature | Description |
|---------|-------------|
| Multi-turn conversations | Full conversation history sent as context, maintaining coherence across messages |
| Project context awareness | AI has access to all generated documents and project metadata |
| Context scoping | User can narrow context to specific documents (e.g., "Only Architecture") |
| Streaming responses | Token-by-token streaming display with typing indicator |
| Markdown rendering | AI responses rendered with code blocks, tables, lists, headings |
| Document referencing | AI can reference specific documents and sections by name |
| Suggestion application | AI suggestions can be applied directly to documents via dedicated action |
| Follow-up clarification | AI asks clarifying questions when ambiguous |
| Technical reasoning | AI explains trade-offs, alternatives, and rationale |
| Code generation | AI generates example code snippets (for Architecture, API Spec docs) |
| Diagram descriptions | AI generates text descriptions that can be rendered as diagrams (Mermaid) |
| Memory across conversations | AI retains awareness of project context across conversation threads |

### 6.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Loading conversations | Skeleton list items with shimmer | Fetch conversation list |
| Loading messages | Skeleton message bubbles | Fetch conversation messages |
| Empty (no conversations) | "No conversations yet. Start chatting about your project!" with input | First-time chat |
| Empty (no messages) | "Ask me anything about your project" prompt suggestions | New conversation |
| Typing (user) | Input text updates, token counter increments | Client-side |
| Streaming (AI) | Typing indicator (3 bouncing dots) → streaming text with cursor | SSE stream active |
| Streaming complete | Full message rendered, actions visible | SSE [DONE] event |
| Error (send) | "Failed to send message. [Retry]" toast | API error |
| Error (stream) | Partial content preserved. "Response interrupted. [Retry]" | SSE error |
| Error (rate limit) | Toast with countdown: "Rate limit. Try again in 25s." | 429 response |
| Context switching | Brief loading on message area | Re-fetch with new context scope |
| Offline | "You're offline. Chat is unavailable." banner | Network check |
| Generation stopped | Partial response shown, "Generation stopped" indicator | User cancelled |

### 6.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| Create conversations | ✅ | ✅ | ✅ |
| Send messages | ✅ | ✅ | ✅ |
| View conversations | ✅ | ✅ | ✅ |
| Delete own conversations | ✅ | ✅ | ✅ |
| Delete any conversation | ✅ | ✅ | ❌ |
| Regenerate responses | ✅ | ✅ | ❌ |
| Apply AI to documents | ✅ | ✅ | ❌ |
| Rate responses | ✅ | ✅ | ✅ |

### 6.9 API Integration

#### List Conversations

```
GET /api/v1/conversations?projectId={id}&page=1&limit=20

Response 200:
{
  "success": true,
  "data": [AIConversation[]],
  "meta": { "total": 12, "page": 1, "limit": 20 }
}
```

#### Get Conversation with Messages

```
GET /api/v1/conversations/:id

Response 200:
{
  "success": true,
  "data": {
    "conversation": { ... },
    "messages": [
      { "id": "...", "role": "USER", "content": "Should we use microservices?", "sequence": 1 },
      { "id": "...", "role": "ASSISTANT", "content": "Given your project...", "sequence": 2 }
    ]
  }
}
```

#### Send Message (Streaming)

```
POST /api/v1/conversations/:id/messages
{ "content": "What about database choice?", "contextScope": "full-project" }

// SSE stream:
data: {"content": "Based on "}
data: {"content": "your architecture..."}
data: [DONE]

// On completion, message + generation records created server-side
```

#### Create Conversation

```
POST /api/v1/conversations
{ "projectId": "uuid", "stepId": "chat", "model": "gpt-4o" }

Response 201:
{ "success": true, "data": AIConversation }
```

#### Delete Conversation

```
DELETE /api/v1/conversations/:id

Response 200:
{ "success": true, "data": { "message": "Conversation archived" } }
```

**Loading Behavior:** Show skeleton messages during history fetch. Stream AI response with typing indicator. Optimistic user message display.

**Retry Logic:** Failed message send retries once. SSE reconnects with backoff.

### 6.10 Database Mapping

**AIConversation model:**
- `id`, `projectId`, `stepId`, `status` (ACTIVE/COMPLETED/FAILED/CANCELLED), `model`, `temperature`, `maxTokens`, `totalInputTokens`, `totalOutputTokens`, `totalCost`, `startedAt`, `completedAt`
- Relations: `project`, `messages` (Message[]), `generations` (Generation[]), `documents` (Document[])

**Message model:**
- `id`, `conversationId`, `role` (SYSTEM/USER/ASSISTANT), `content` (Text), `tokens`, `sequence`
- Unique: `[conversationId, sequence]`

**Generation model:**
- `id`, `conversationId`, `model`, `provider` (OPENAI/ANTHROPIC/GOOGLE/OLLAMA), `promptTokens`, `completionTokens`, `totalTokens`, `cost`, `durationMs`, `status` (SUCCESS/FAILED/RETRIED), `errorMessage`

**Indexes:** `projectId + stepId`, `projectId + status` on AIConversation. `conversationId + sequence` on Message.

**Pagination:** Messages loaded all at once (ordered by sequence). Conversations paginated (20/page, sorted by updatedAt desc).

### 6.11 Edge Cases

| Case | Handling |
|------|----------|
| No internet | Chat disabled. Cached conversations viewable. "Reconnect to send messages." |
| AI timeout (120s) | Partial response shown. Error state: "Response took too long. [Retry]" |
| Very long conversation (100+ msgs) | Summarize older context. Warning: "Context window almost full. Consider starting a new conversation." |
| Token limit exceeded | Truncate oldest messages. Banner: "Earlier messages summarized to fit context window." |
| Concurrent sends | Disable send button while AI responding. Queue if needed. |
| Empty message | Client validation: "Message cannot be empty." Button disabled. |
| Deleted project | Conversation inaccessible. "This project has been archived." |
| Streaming disconnect | Auto-reconnect if within 10s. Otherwise show partial + retry. |
| Model switch mid-conversation | Confirmation: "Switching model may change response style. Continue?" |
| Harmful content | AI refusal message. Content filtered server-side. |
| Markdown injection | Sanitized rendering. No HTML execution. |

### 6.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Messages load | Fade in + slide up 4px (staggered 50ms) | 200ms each | [0.4, 0, 0.2, 1] |
| User message send | Scale 0.95→1 + slide up from input | 200ms | spring |
| AI thinking | 3 dots bouncing (staggered opacity) | 1.4s cycle | ease-in-out |
| AI streaming | Cursor blink (alternating opacity) | 1s cycle | steps(2) |
| Streaming text | Characters appear (typewriter via requestAnimationFrame) | — | linear |
| Copy feedback | Copy icon → checkmark (150ms) → copy icon (2s) | 150ms/2s | ease |
| Message actions | Fade in on hover | 150ms | ease |
| Conversation switch | Crossfade messages | 200ms | ease |
| Delete conversation | Item slide left + fade out | 200ms | ease-in |

### 6.13 Mobile Experience

- Full-screen chat view. Conversation list accessible via back button or top-left hamburger.
- Input area fixed at bottom with keyboard avoidance.
- Messages stack with minimal padding for maximum content space.
- Swipe left on conversation to delete (iOS pattern).
- Pull down from top to load earlier messages (if paginated).
- Send button prominent, always visible. Voice input support (future).

### 6.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | Messages as `<article>`, input as `<textarea>` with `<label>`, conversation list as `<nav>` |
| Live region | `aria-live="polite"` on message area for streaming responses |
| Focus management | Auto-focus input on conversation load. Focus returns to input after send. |
| Screen reader | Message role announced ("You said:", "AI responded:"). Streaming announced at intervals. |
| Keyboard | Tab to input, Enter to send, Shift+Enter for newline, Esc to stop. Arrow keys for conversation nav. |
| Color contrast | All text in message bubbles meets 4.5:1. Action icons meet 3:1 (large). |
| Reduced motion | Streaming appears as blocks instead of typewriter. Animations disabled. |

### 6.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Message virtualization | Required for conversations 100+ messages. `react-virtuoso` or `@tanstack/virtual`. |
| Streaming via SSE | EventSource with chunked rendering at 60fps via requestAnimationFrame |
| Memoization | `React.memo` on ChatMessage, MessageContent with content hash comparison |
| Lazy conversation list | Load 20 conversations, "Load more" button or infinite scroll |
| Optimistic UI | User messages appear instantly. AI response streams. |
| Markdown rendering | Lazy-loaded `react-markdown` with `react-syntax-highlighter` |
| Scroll management | `useRef` + `scrollIntoView` for auto-scroll. Detect manual scroll up. |

### 6.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Shared conversations | Share conversation link with team members (read-only/view-only) |
| Conversation forks | Branch conversation at any message to explore alternatives |
| Prompt templates | Save conversation structure as reusable template |
| Multi-model compare | Run same prompt on 2+ models side by side |
| Diagram rendering | Render Mermaid/PlantUML inline in messages |
| File attachments | Upload images, PDFs, code files for context |
| Voice input | Speech-to-text for mobile/web input |
| Agent actions | AI can trigger document generation, export creation |
| Conversation export | Export as Markdown, PDF, or shareable link |
| Semantic search | Search across all conversations for topics, decisions, and insights |

---

## 7. PRD Generator

### 7.1 Purpose

**Primary Goal:** Provide a specialized, guided interface for generating Product Requirements Documents — the most critical document in the specification suite. This screen offers a structured input form that captures all necessary context before the AI generates a comprehensive PRD.

**User Intent:** Quickly and thoroughly capture their product idea in a structured format, receive a professional-grade PRD, and iterate on it.

**Business Goal:** Demonstrate the core value of PromptPilot in a single workflow. The PRD Generator is often the first AI interaction new users have — it must be impressive, fast, and produce high-quality output that converts trial users to paid.

### 7.2 User Journey

**Entry Points:**
- Project page → Click "Generate" on PRD document card
- Dashboard → Quick Action "Generate PRD"
- Project page → "Run Full Pipeline" (PRD is step 2)
- Direct URL: `/project/[slug]/prd/generate`
- AI Chat → "Generate a PRD from this discussion"

**Previous Page:**
- Project page
- Dashboard
- AI Chat

**Next Pages:**
- PRD Editor (post-generation) — `/project/[slug]/documents/prd/edit`
- Project page (back/after generation)
- Next pipeline step (SRS) — prompted after PRD completion

**User Actions:**
1. Fill structured input form with project details
2. Use AI to expand brief descriptions into detailed sections
3. Select PRD template/style
4. Configure generation options (model, length, tone)
5. Generate PRD
6. Review streaming output
7. Refine with follow-up requests
8. Accept and save PRD
9. Iterate: edit specific sections, regenerate with feedback
10. Proceed to next pipeline step

### 7.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  PRD GENERATOR — Two-phase layout: Input → Review               │
│                                                                   │
│  PHASE 1: INPUT FORM                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  NAVBAR: ... > Mobile App Redesign > PRD Generator   [⌘K]  │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │  Product Requirements Document Generator              │ │  │
│  │  │  Describe your product and we'll generate a complete  │ │  │
│  │  │  PRD with AI assistance.                              │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  FORM (2-column on desktop, 1-column mobile)               │  │
│  │  ┌─────────────────────────┐ ┌─────────────────────────┐  │  │
│  │  │ Product Name*           │ │ Target Audience*         │  │  │
│  │  │ [Mobile App Redesign___]│ │ [iOS and Android users__]│  │  │
│  │  │                         │ │                          │  │  │
│  │  │ Elevator Pitch*         │ │ Platform*                │  │  │
│  │  │ [A cross-platform mobil│ │ [iOS, Android____________]│  │  │
│  │  │  e app redesign that...│ │                          │  │  │
│  │  │  _____________________]│ │                          │  │  │
│  │  │                         │ │                          │  │  │
│  │  │ Problem Statement       │ │ Success Metrics          │  │  │
│  │  │ [Current app has poor  │ │ [40% increase in user    │  │  │
│  │  │  UX, 2.8★ rating...___]│ │  retention, 4.5★ rating_]│  │  │
│  │  └─────────────────────────┘ └─────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │ Key Features & Requirements                           │ │  │
│  │  │ ┌─────────────────────────────────────────────────┐  │ │  │
│  │  │ │ 1. [Biometric authentication for login________] │  │ │  │
│  │  │ │ 2. [Offline-first architecture________________] │  │ │  │
│  │  │ │ 3. [Dark mode support_________________________] │  │ │  │
│  │  │ │ [+ Add Feature]                                  │  │ │  │
│  │  │ └─────────────────────────────────────────────────┘  │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │ AI Expand ✨                                          │ │  │
│  │  │ ┌─────────────────────────────────────────────────┐  │ │  │
│  │  │ │ 💡 Not sure what to write? Describe your idea    │ │ │  │
│  │  │ │ in a few sentences and let AI fill in the form:  │ │ │  │
│  │  │ │                                                   │ │ │  │
│  │  │ │ [I want to redesign our mobile banking app to___] │ │ │  │
│  │  │ │ [compete with Revolut and Monzo. Key focus on___] │ │ │  │
│  │  │ │                                    [✨ Expand]    │ │ │  │
│  │  │ └─────────────────────────────────────────────────┘  │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  GENERATION OPTIONS                                         │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │ Template: [Standard PRD ▼]  Model: [GPT-4o ▼]       │ │  │
│  │  │ Length: [Comprehensive ▼]  Tone: [Professional ▼]    │ │  │
│  │  │                                                       │ │  │
│  │  │ Include: ☑ Executive Summary  ☑ User Stories        │ │  │
│  │  │         ☑ Functional Reqs     ☑ Non-Functional Reqs  │ │  │
│  │  │         ☑ Timeline            ☑ Success Metrics      │ │  │
│  │  │                                                       │ │  │
│  │  │ ┌──────────────┐  ┌─────────────────────┐           │ │  │
│  │  │ │ Generate PRD  │  │ Save Draft & Exit   │           │ │  │
│  │  │ │ (primary btn) │  │ (secondary btn)     │           │ │  │
│  │  │ └──────────────┘  └─────────────────────┘           │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  PHASE 2: GENERATION & REVIEW (shown after "Generate" clicked)    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────────┐ ┌──────────────────────────────┐ │  │
│  │  │  GENERATION PANEL    │ │  LIVE PREVIEW                 │ │  │
│  │  │  (streaming)         │ │                                │ │  │
│  │  │                      │ │  # Mobile App Redesign        │ │  │
│  │  │  ⟳ Generating PRD... │ │  ## Product Requirements Doc  │ │  │
│  │  │                      │ │                                │ │  │
│  │  │  ✓ Collecting        │ │  ## 1. Executive Summary      │ │  │
│  │  │    requirements      │ │  The Mobile App Redesign...   │ │  │
│  │  │  ✓ Structuring doc   │ │                                │ │  │
│  │  │  ⟳ Writing content   │ │  ## 2. Problem Statement      │ │  │
│  │  │  ○ Finalizing        │ │  The current app suffers...   │ │  │
│  │  │                      │ │                                │ │  │
│  │  │  Tokens: 3.2k/16k    │ │  ## 3. Target Audience █      │ │  │
│  │  │  Cost: $0.08         │ │                                │ │  │
│  │  │  Elapsed: 12s        │ │                                │ │  │
│  │  │                      │ │                                │ │  │
│  │  │ [Cancel]             │ │                                │ │  │
│  │  └──────────────────────┘ └──────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  PHASE 3: POST-GENERATION ACTIONS                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ✅ PRD Generated Successfully!  v1 · 8,200 tokens · $0.21 │  │
│  │                                                             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ Edit PRD  │ │ Refine   │ │ Version  │ │ Continue to  │ │  │
│  │  │ (primary) │ │ with AI  │ │ History  │ │ SRS →        │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 7.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `PageHeader` | Organism | Step title, description, project context |
| `Input` | Atom | Text fields for product name, audience, platform, etc. |
| `Textarea` | Atom | Multi-line fields for elevator pitch, problem statement |
| `DynamicList` | Molecule | Key features list with add/remove/reorder |
| `Button` (primary) | Atom | "Generate PRD", "Edit PRD", "Continue to SRS" |
| `Button` (secondary) | Atom | "Save Draft & Exit", "Refine with AI" |
| `Button` (ghost) | Atom | "Add Feature", remove feature |
| `Select` | Atom | Template, model, length, tone dropdowns |
| `Checkbox` | Atom | Section include/exclude toggles |
| `AIExpandPanel` | Molecule | Free-text input + "✨ Expand" button with AI form-filling |
| `StreamingPanel` | Organism | Left: generation steps progress + "thinking" indicators. Right: live preview. |
| `GenerationProgress` | Molecule | Step-by-step progress list with checkmarks and spinners |
| `MarkdownPreview` | Molecule | Rendered PRD content with syntax highlighting |
| `CompletionBanner` | Molecule | Success state with action buttons |
| `Skeleton` | Atom | Form field and preview loading placeholders |
| `Spinner` | Atom | Generation in progress |
| `Tooltip` | Atom | Field hints and template descriptions |
| `Toast` | Molecule | Generation complete, save confirmation |

### 7.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Fill form | User types in fields | Auto-save draft to localStorage on blur (every 3s) |
| AI Expand form | Type rough idea + click "✨ Expand" | Send to AI, parse response, fill form fields |
| Add feature | Click "+ Add Feature" | Append new input row, focus it |
| Remove feature | Click ✕ on feature row | Remove with collapse animation |
| Reorder features | Drag handle (future) | Reorder list |
| Select template | Dropdown change | Update preview of template structure |
| Toggle section | Checkbox toggle | Add/remove section from PRD outline |
| Generate PRD | Click "Generate PRD" | Validate form → POST generation → show streaming phase |
| Cancel generation | Click "Cancel" | Stop generation, preserve form, show confirmation |
| Save draft | Click "Save Draft & Exit" | POST draft document, navigate back to project |
| Review streaming | Phase 2 auto-scrolls | Real-time Markdown rendering as tokens arrive |
| Accept PRD | Implicit on completion | Document auto-saved as v1 with GENERATED status |
| Edit PRD | Click "Edit PRD" | Navigate to full editor with PRD loaded |
| Refine with AI | Click "Refine" | Open chat panel with PRD context for iterative feedback |
| Continue to SRS | Click "Continue to SRS" | Navigate to SRS generator with project context |

**Keyboard Shortcuts:**
- `⌘Enter` — Generate PRD (from form)
- `⌘S` — Save draft
- `Tab` / `Shift+Tab` — Navigate between form fields
- `Esc` — Cancel generation / go back to project
- `⌘Z` — Undo form field change

### 7.6 AI Features

| Feature | Description |
|---------|-------------|
| AI Form Expansion | User provides brief unstructured description → AI fills structured form fields |
| PRD Generation | Structured form data + template → comprehensive PRD via LLM |
| Template-aware generation | Different PRD templates (Standard, Agile/User Story, IEEE 830, Lean) produce different structures |
| Section customization | User selects which sections to include, AI generates accordingly |
| Context injection | Master Context document + project settings injected into generation prompt |
| Tone/style adaptation | Professional, Collaborative, Executive, Technical — prompt adjusted accordingly |
| Length control | Concise (2-3 pages), Standard (5-7 pages), Comprehensive (10-15 pages) |
| Streaming generation | Token-by-token live preview with phase indicators |
| Smart defaults | AI infers reasonable defaults for unfilled optional fields |
| Validation suggestions | AI checks for inconsistencies or missing critical sections before generation |

### 7.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Form empty | Clean form with placeholder text and hints | Initial state |
| Form partially filled | Values in fields, draft indicator "Draft saved 30s ago" | localStorage auto-save |
| Form validating | Field borders highlight errors, submit disabled | On "Generate" click |
| AI Expanding form | AI Expand section shows spinner, form fields fill one by one | Streaming AI response |
| Generating (Phase 2) | Left panel: progress. Right panel: live preview streaming. | SSE streaming |
| Generation complete | Completion banner with actions. Preview shows full PRD. | SSE [DONE] |
| Generation failed | Error overlay: "Generation failed. [Retry] [Save Partial] [Back]" | AI timeout/error |
| Saving | Button spinner, fields disabled | API POST document |
| Saved | Green toast "Draft saved" or "PRD generated successfully" | Document upserted |
| Offline | Form editable. "Offline — changes saved locally." Banner. | No API calls possible |
| Prerequisite missing | Warning: "Master Context not generated. PRD may lack project context." | Detect missing upstream |

### 7.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| Generate PRD | ✅ | ✅ | ❌ |
| AI Expand form | ✅ | ✅ | ❌ |
| Save draft | ✅ | ✅ | ❌ |
| Refine with AI | ✅ | ✅ | ❌ |
| Edit generated PRD | ✅ | ✅ | ❌ |
| View PRD | ✅ | ✅ | ✅ |
| Export PRD | ✅ | ✅ | ✅ |

### 7.9 API Integration

#### AI Expand Form

```
POST /api/v1/pipeline/generate
{
  "projectId": "uuid",
  "stepId": "prd-expand",
  "userInput": "I want to redesign our mobile banking app to compete with Revolut...",
  "template": "form-expansion"
}

Response 200 (non-streaming):
{
  "success": true,
  "data": {
    "formFields": {
      "productName": "NeoBank Mobile App Redesign",
      "elevatorPitch": "A cross-platform mobile banking application...",
      "targetAudience": "Tech-savvy millennials and Gen Z users...",
      "platform": "iOS, Android",
      "problemStatement": "Current banking app has poor UX with 2.8★ rating...",
      "successMetrics": "Achieve 4.5★ rating, 40% increase in DAU...",
      "keyFeatures": ["Biometric auth", "Offline-first", "Dark mode", "..."],
      "technicalConstraints": "Must integrate with existing core banking system..."
    }
  }
}
```

#### Generate PRD

```
POST /api/v1/pipeline/generate
{
  "projectId": "uuid",
  "stepId": "prd",
  "userInput": "Generate comprehensive PRD based on provided form data",
  "context": {
    "formData": { ... },
    "template": "standard",
    "sections": ["executive-summary", "problem-statement", "user-stories", ...],
    "length": "comprehensive",
    "tone": "professional"
  }
}

// Streaming response via SSE — see Project section for SSE format
```

**Loading Behavior:** Phase 1 form is client-rendered. AI Expand shows loading spinner. Generation switches to Phase 2 with split panel + streaming.

**Optimistic Updates:** Form draft saved to localStorage optimistically. Document creation happens server-side on generation complete.

**Retry Logic:** AI Expand retries once on failure. Generation can be manually retried from error state.

### 7.10 Database Mapping

**Document model (for PRD):**
- `stepId`: `"prd"`
- `type`: `PRD`
- `content`: Generated PRD in Markdown
- `status`: DRAFT → GENERATED → REVIEWED
- `version`: Auto-incremented on regeneration
- `tokensUsed`, `modelUsed`: Set on generation complete
- `conversationId`: Links to AIConversation for generation history

**AIConversation model:** Created per generation attempt. Links messages (system prompt + user input + assistant response) and generation audit record.

**Indexes:** `projectId + stepId` (unique), `projectId + type`, `conversationId`

### 7.11 Edge Cases

| Case | Handling |
|------|----------|
| Form validation failure | Highlight invalid fields in red with error messages. "Please fill in required fields marked with *" |
| Empty form submission | Don't allow. Required fields marked. Button remains disabled. |
| AI Expand returns incomplete | Show warning: "AI filled 6 of 8 fields. Please review and complete manually." |
| Generation timeout (120s+) | Partial output preserved. Error state with retry. |
| Generated content too short | Warning: "Generated PRD is shorter than expected. Consider refining your inputs or regenerating." |
| Duplicate generation | Confirm: "A PRD already exists. Regenerating will create a new version. Continue?" |
| Very long user input | Truncate with warning: "Input exceeds context limit. Consider being more concise." |
| Missing Master Context | Warning banner with suggestion to generate Master Context first |
| Browser tab close during generation | `beforeunload` warning: "Generation in progress. Leaving will cancel." |
| Form draft recovery | On page load, check localStorage. Offer to restore: "You have an unsaved draft. Restore?" |

### 7.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Form field focus | Border color transition + subtle scale | 150ms | ease |
| AI Expand result | Fields fill in sequence with fade (100ms stagger) | 200ms each | ease |
| Feature add | New row slide down + fade in | 200ms | [0.4, 0, 0.2, 1] |
| Feature remove | Row collapse + fade out | 200ms | ease-in |
| Generate button | Scale pulse on hover | 150ms | ease |
| Phase transition | Form fade out → split panel fade in | 400ms | [0.4, 0, 0.2, 1] |
| Generation progress | Step items checkmark + color transition | 300ms each | ease |
| Live preview | Typewriter text rendering | Per-token | linear |
| Completion banner | Slide down + fade in + icon bounce | 500ms | spring |
| Error state | Red border pulse + content shake | 400ms | spring |

### 7.13 Mobile Experience

- Single column form, all fields stacked vertically
- AI Expand section collapses to save space (expandable accordion)
- Generation switches to full-screen split view (top: progress, bottom: preview)
- Mobile template/options as bottom sheet selector
- "Generate" button sticky at bottom of form on mobile
- Swipe back gesture warns about losing draft

### 7.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic form | Proper `<form>`, `<label>` associations, `<fieldset>` for grouped fields |
| Required indicators | Asterisk + `aria-required="true"` on required fields |
| Error announcements | `aria-describedby` on invalid fields. `role="alert"` on form-level errors. |
| Streaming content | `aria-live="polite"` region for generated content announcements |
| Keyboard | Full keyboard navigation through all form fields. Tab between features list items. |
| Screen reader | Form structure announced. Dynamic list count announced. Generation progress read. |
| Color | Error states use both color (red border) and icon + text for identification |

### 7.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Form draft auto-save | Debounced (3s) localStorage writes. JSON serialized form state. |
| AI Expand | Single API call, non-streaming (structured output). Loading spinner. |
| PRD Generation | SSE streaming for live preview. Incremental DOM via requestAnimationFrame. |
| Markdown rendering | Lazy-loaded `react-markdown`. Partial rendering during stream. |
| Template options | Static data, no API call needed. |
| Code splitting | Phase 2 components lazy-loaded, only mounted when generation starts. |

### 7.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Custom templates | User-created and saved PRD templates |
| Template marketplace | Community-shared PRD templates |
| Multi-language generation | Generate PRD in languages other than English |
| Comparative analysis | Generate PRD for competitor products for comparison |
| AI review | Pre-generation review of form inputs with suggestions |
| Section-by-section generation | Generate and approve each section individually before final assembly |
| Product canvas mode | Visual canvas for brainstorming before structured input |
| Voice-to-form | Dictate product description, AI fills structured form |
| Team collaboration | Multiple users can contribute to form simultaneously |
| Historical PRD library | Browse past PRDs as reference for new projects |

---

## 8. Editor

### 8.1 Purpose

**Primary Goal:** Provide a professional document editing experience for viewing, refining, and enhancing AI-generated specification documents. The editor combines a rich Markdown preview with AI-powered editing tools, allowing users to perfect their documents before export.

**User Intent:** Review AI-generated content, make manual edits, use AI to refine specific sections, collaborate with team members, and prepare documents for final export.

**Business Goal:** Keep users engaged on the platform beyond generation. The editor is where documents become polished, production-ready artifacts — increasing perceived value and reducing the likelihood of users exporting and leaving.

### 8.2 User Journey

**Entry Points:**
- Project page → Click "Edit" on document card
- PRD Generator → "Edit PRD" button
- Version History → "Restore this version in editor"
- Direct URL: `/project/[slug]/documents/prd/edit`
- AI Chat → "Apply to Document" action

**Previous Page:**
- Project page
- PRD Generator
- Version History
- AI Chat

**Next Pages:**
- Version History (from editor toolbar)
- Export page
- Project page (back)
- Next pipeline step document

**User Actions:**
1. View rendered Markdown document
2. Toggle between Preview, Edit (source), and Split view modes
3. Edit Markdown source directly
4. Select text → AI actions: Improve, Expand, Summarize, Rewrite, Explain
5. Full document AI actions: Improve clarity, Fix grammar, Add detail, Adjust tone
6. Request AI to add new sections
7. Undo/redo edits
8. Save changes manually or auto-save
9. Navigate between project documents via sidebar
10. Comment on specific sections (future)
11. View document outline for quick navigation
12. Preview at different export sizes (mobile/print)

### 8.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  EDITOR LAYOUT                                                     │
│                                                                   │
│  ┌──────────┐ ┌────────────────────────────────────────────────┐ │
│  │DOC NAV   │ │  EDITOR TOOLBAR (sticky)                        │ │
│  │(sidebar) │ │  ┌────────────────────────────────────────────┐ │ │
│  │          │ │  │ ← Back  │ [Preview] [Edit] [Split] │ [•••] │ │ │
│  │ Project: │ │  │         │                                 │ │ │
│  │ Mobile   │ │  │ Document: PRD v2      Auto-saved 3s ago   │ │ │
│  │ App      │ │  └────────────────────────────────────────────┘ │ │
│  │          │ │                                                 │ │
│  │ 📋 MC    │ │  ┌────────────────────────────────────────────┐ │ │
│  │ 📋 PRD ◀ │ │  │  EDITOR AREA (split view shown)            │ │ │
│  │ 📋 SRS   │ │  │                                             │ │ │
│  │ 🏗 Arch  │ │  │  ┌──────────────────┐ ┌──────────────────┐ │ │ │
│  │ 🗄️ DB    │ │  │  │  MARKDOWN EDITOR │ │  RENDERED VIEW   │ │ │
│  │ 📡 API   │ │  │  │                  │ │                  │ │ │
│  │ 📊 Flows │ │  │  │  # Product       │ │  # Product       │ │ │
│  │ 🎨 Wire  │ │  │  │  ## Requirements │ │  ## Requirements │ │ │
│  │ 🗺️ Map   │ │  │  │  ## Document     │ │  ## Document     │ │ │
│  │          │ │  │  │                  │ │                  │ │ │
│  │ ──────── │ │  │  │  ## 1. Executiv │ │  ## 1. Executiv │ │ │
│  │ OUTLINE  │ │  │  │  e Summary       │ │  e Summary       │ │ │
│  │          │ │  │  │  The Mobile App  │ │  The Mobile App  │ │ │
│  │  1. Exec │ │  │  │  Redesign projec│ │  Redesign projec│ │ │
│  │  Summary │ │  │  │  t aims to...   │ │  t aims to...   │ │ │
│  │  2. Prob │ │  │  │                  │ │                  │ │ │
│  │  lem     │ │  │  │  ## 2. Problem  │ │  ## 2. Problem  │ │ │
│  │  3. Solu │ │  │  │  Statement      │ │  Statement      │ │ │
│  │  tion    │ │  │  │  The current app│ │  The current app│ │ │
│  │  4. User │ │  │  │  suffers from...│ │  suffers from...│ │ │
│  │  Stories │ │  │  │                  │ │                  │ │ │
│  └──────────┘ │  │  └──────────────────┘ └──────────────────┘ │ │ │
│               │  └────────────────────────────────────────────┘ │ │
│               │                                                 │ │
│               │  ┌────────────────────────────────────────────┐ │ │
│               │  │  AI EDITING BAR (selection context)        │ │ │
│               │  │  ┌────────────────────────────────────────┐ │ │ │
│               │  │  │ Selected: "The current app suffers..." │ │ │ │
│               │  │  │ [✨ Improve] [📝 Rewrite] [📏 Expand]  │ │ │ │
│               │  │  │ [📋 Summarize] [💡 Explain] [✏️ Edit] │ │ │ │
│               │  │  └────────────────────────────────────────┘ │ │ │
│               │  └────────────────────────────────────────────┘ │ │
│               │                                                 │ │
│               │  ┌────────────────────────────────────────────┐ │ │
│               │  │  STATUS BAR                                │ │ │
│               │  │  v2 · 8,200 tokens · Markdown · Saved ✓   │ │ │
│               │  │  Words: 1,847 · Lines: 142 · Read: 8 min  │ │ │
│               │  └────────────────────────────────────────────┘ │ │
│               └────────────────────────────────────────────────┘ │
│                                                                   │
│  AI EDITING SIDEBAR (right, contextual)                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ✨ AI Assistant                                            │  │
│  │  ────────────────────────────────────────────────────────  │  │
│  │  How would you like to improve the selected text?          │  │
│  │                                                             │  │
│  │  [Make it more concise____________________________]        │  │
│  │  [or choose a preset:]                                     │  │
│  │  [More professional] [Simpler language] [Add examples]     │  │
│  │  [Fix grammar] [Change tone to casual]                     │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │  ⟳ AI Suggestion:                                     │ │  │
│  │  │  The current application experiences significant UX   │ │  │
│  │  │  friction, reflected in its 2.8★ App Store rating...  │ │  │
│  │  │                                                       │ │  │
│  │  │  [✓ Apply] [✕ Dismiss] [🔄 Try Again]                │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 8.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `DocumentNav` | Organism | Left sidebar: project documents list + document outline (headings) |
| `DocumentItem` | Molecule | Single document in nav with type icon, name, status, current indicator |
| `OutlineItem` | Molecule | Clickable heading from document for quick navigation |
| `EditorToolbar` | Organism | View mode toggle, save status, document info, action menu |
| `Button` (segmented) | Molecule | Preview / Edit / Split view mode selector |
| `Button` (icon) | Atom | Back, undo, redo, AI assist toggle |
| `MarkdownEditor` | Organism | Textarea/CodeMirror for raw Markdown editing |
| `MarkdownPreview` | Organism | Rendered Markdown view with syntax highlighting |
| `SplitPane` | Organism | Resizable split view (editor | preview) |
| `AIEditingBar` | Organism | Contextual bar appearing on text selection with AI actions |
| `AIAssistantPanel` | Organism | Right sidebar for AI editing: text input, preset buttons, suggestion preview |
| `AISuggestionCard` | Molecule | AI-generated text suggestion with Apply/Dismiss/Retry buttons |
| `StatusBar` | Molecule | Bottom bar: version, word count, save status, read time |
| `DropdownMenu` | Molecule | Toolbar ••• menu: Versions, Export, Document settings, Delete |
| `Skeleton` | Atom | Document content loading placeholder |
| `Spinner` | Atom | AI suggestion loading |
| `Tooltip` | Atom | Button descriptions, keyboard shortcuts |
| `Toast` | Molecule | "Changes saved", "AI suggestion applied" |

### 8.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Switch view mode | Click Preview/Edit/Split | Animate transition between modes |
| Edit Markdown | Type in editor | Real-time preview update (debounced 100ms) |
| Select text | Mouse drag / Shift+Arrow | Show AI Editing Bar with contextual actions |
| AI Improve selected | Click "✨ Improve" | Send selection to AI, show suggestion in panel |
| AI Rewrite | Click "📝 Rewrite" | Regenerate selected text with same meaning |
| AI Expand | Click "📏 Expand" | Add more detail and depth to selected section |
| AI Summarize | Click "📋 Summarize" | Condense selection to key points |
| AI Explain | Click "💡 Explain" | Generate plain-language explanation |
| Apply suggestion | Click "✓ Apply" | Replace selection with AI text, add to undo history |
| Dismiss suggestion | Click "✕ Dismiss" | Hide suggestion, retain original text |
| Try again | Click "🔄 Try Again" | Re-run AI with same prompt for different output |
| Custom AI prompt | Type instruction + Enter | Free-form AI editing instruction |
| Full doc AI action | Toolbar ••• → AI actions | Improve clarity, Fix grammar, Adjust tone for entire doc |
| Undo | `⌘Z` / toolbar button | Revert last edit |
| Redo | `⌘⇧Z` / toolbar button | Re-apply undone edit |
| Save | `⌘S` / auto-save | POST updated document content, increment version if significant |
| Navigate to heading | Click outline item | Scroll to heading in preview |
| Navigate to document | Click doc in nav sidebar | Load different document in editor |
| Resize split pane | Drag divider | Adjust editor/preview ratio, persist preference |
| Insert section | Click "+" between sections | AI-assisted: "What section would you like to add?" |

**Keyboard Shortcuts:**
- `⌘S` — Save
- `⌘Z` — Undo
- `⌘⇧Z` — Redo
- `⌘B` — Bold (in edit mode)
- `⌘I` — Italic
- `⌘K` — Insert link
- `⌘E` — Toggle Edit/Preview mode
- `⌘⇧E` — Toggle Split mode
- `⌘⇧A` — Open AI Assistant panel
- `Esc` — Focus editor from AI panel
- `⌘↑` / `⌘↓` — Jump to previous/next heading

### 8.6 AI Features

| Feature | Description |
|---------|-------------|
| Text improvement | AI rewrites selected text for clarity, conciseness, or professionalism |
| Tone adjustment | Change tone: Professional, Casual, Technical, Executive, Enthusiastic |
| Grammar fix | AI corrects grammar, spelling, and punctuation |
| Content expansion | AI adds depth, examples, and elaboration to selected text |
| Content summarization | AI condenses verbose sections to key points |
| Plain-language explanation | AI explains technical content in simpler terms |
| Section generation | AI writes entirely new sections based on user instruction |
| Context-aware editing | AI considers full document context when editing a selection |
| Consistency check | AI reviews document for internal consistency and contradictions |
| Style guide enforcement | AI adjusts document to match selected style guide (future) |
| Multi-turn refinement | Iterative editing with conversation-like back-and-forth |
| Version-aware suggestions | AI respects document version history, avoids repeating removed content |

### 8.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Loading document | Skeleton content with document outline skeleton | Fetch document data |
| Edit mode | Raw Markdown in editor, cursor visible | Editable textarea |
| Preview mode | Rendered Markdown, no cursor, read-only appearance | Read-only view |
| Split mode | Side-by-side, synchronized scroll | Two panels with linked scroll |
| Text selected | AI Editing Bar appears with animation | Selected text tracked |
| AI processing | AI Assistant panel shows spinner, suggestion card pulsing | API call in progress |
| AI suggestion ready | Suggestion card with Apply/Dismiss/Retry | Response received |
| Suggestion applied | Text replaced with highlight animation, then fades to normal | Optimistic update |
| Unsaved changes | Status bar shows "● Unsaved changes", `⌘S` prompt | Dirty state tracker |
| Auto-saving | Status bar: "Saving..." spinner | Debounced save, 2s after last edit |
| Saved | Status bar: "✓ Saved" (fades after 3s) | Save confirmed |
| Save error | Status bar: "⚠ Save failed. [Retry]" red text | API error |
| Read-only (viewer) | Edit mode disabled, AI bar hidden, "View only" badge | Permission check |
| Document not found | 404: "This document has been deleted" | API 404 response |
| Conflict | "This document was modified by another user. [Reload] [Overwrite]" | Version check |

### 8.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| View document | ✅ | ✅ | ✅ |
| Edit document | ✅ | ✅ | ❌ |
| Use AI editing | ✅ | ✅ | ❌ |
| Save changes | ✅ | ✅ | ❌ |
| Undo/redo | ✅ | ✅ | ❌ |
| View version history | ✅ | ✅ | ✅ |

### 8.9 API Integration

#### Get Document

```
GET /api/v1/projects/:projectId/documents/:stepId

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "stepId": "prd",
    "title": "Product Requirements Document",
    "content": "# Product Requirements...",
    "status": "GENERATED",
    "version": 2,
    "tokensUsed": 8200,
    "modelUsed": "gpt-4o"
  }
}
```

#### Update Document

```
PATCH /api/v1/projects/:projectId/documents/:stepId
{ "content": "# Updated content...", "version": 3 }

Response 200:
{ "success": true, "data": Document }
```

#### AI Edit (Section)

```
POST /api/v1/pipeline/generate
{
  "projectId": "uuid",
  "stepId": "prd-edit",
  "userInput": "Make the following text more concise and professional:\n\nThe current app suffers from poor UX...",
  "context": {
    "action": "improve",
    "selectedText": "The current app suffers from poor UX...",
    "fullDocument": "# Product Requirements...",
    "instruction": "more concise and professional"
  }
}

Response 200:
{
  "success": true,
  "data": {
    "improvedText": "The current application experiences significant UX friction..."
  }
}
```

**Loading Behavior:** Document content loads with skeleton placeholder. AI editing shows spinner in suggestion panel. Save operations debounced with optimistic UI.

**Retry Logic:** Save auto-retries once on failure. AI edits manually retried via "Try Again" button.

### 8.10 Database Mapping

**Document model:**
- `content` — Full Markdown text (Text field)
- `version` — Auto-incremented on significant saves (>50 char changes)
- `status` — Updated to REVIEWED when manually edited after generation
- `tokensUsed`, `modelUsed` — Updated on AI editing operations
- `stale` — Set to true if not manually reviewed within 7 days

**DocumentVersion model:**
- Created on every significant save
- `versionNumber`, `content` (immutable snapshot), `modelUsed`, `tokensUsed`

**AIConversation model:** Created per AI editing session for tracking editing conversations.

### 8.11 Edge Cases

| Case | Handling |
|------|----------|
| Very large document (50K+ words) | Virtualize editor. Warn: "Large documents may have slower editing performance." |
| AI timeout on edit | "AI edit took too long. [Retry with shorter selection] [Cancel]" |
| Empty document | "This document is empty. [Generate content] [Write manually]" |
| Concurrent edits by another user | Version conflict dialog: "This document was modified. [Reload] [Overwrite]" |
| Lost internet during edit | Queue changes locally. "Offline — 3 changes queued. Will sync when reconnected." |
| Browser crash recovery | Auto-save to localStorage every 30s. Offer recovery on next load. |
| Paste with formatting | Strip rich text. Paste as plain text. Warn if pasting >10K chars. |
| Undo stack overflow | Limit undo history to 100 actions. "Undo history limit reached." |
| Selection across sections | AI bar adapts: "Selection spans 3 sections. Apply action to entire selection?" |
| Empty AI suggestion | Show "AI returned empty result. Try a different prompt." with retry button. |

### 8.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| View mode switch | Editor/preview crossfade or split animation | 250ms | [0.4, 0, 0.2, 1] |
| AI bar appear | Slide up + fade in from selection bottom | 200ms | spring |
| AI bar dismiss | Fade out + slide down | 150ms | ease-in |
| Suggestion card | Scale 0.98→1 + fade in | 250ms | spring |
| Text replace | Highlight flash yellow → fade to normal | 600ms | ease |
| Outline scroll | Smooth scroll to heading (native `scroll-behavior: smooth`) | — | — |
| Split resize | Real-time drag, no animation | — | — |
| Save indicator | "✓ Saved" fade in, hold 2s, fade out | 500ms/2s/500ms | ease |
| Unsaved dot | Pulsing red dot (opacity 1→0.5→1) | 2s cycle | ease |
| Document switch | Content fade out → skeleton → new content fade in | 300ms | [0.4, 0, 0.2, 1] |

### 8.13 Mobile Experience

- Single pane mode only (toggle between Edit and Preview via segmented control)
- AI Editing Bar becomes bottom action sheet with horizontal scroll
- AI Assistant Panel becomes full-screen modal overlay
- Outline accessible via floating TOC button (bottom-right FAB)
- Document navigation via back button + dropdown selector
- Toolbar simplified: view toggle + save status + ••• menu
- Swipe left/right to switch between project documents

### 8.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | `<article>` for document. `<textarea>` with label for editor. Proper heading hierarchy. |
| Keyboard editing | Full keyboard navigation. Tab enters/exits editor. All AI actions keyboard-accessible. |
| Focus management | Focus returns to editor after AI suggestion applied. Focus trapped in AI panel when open. |
| ARIA live | AI suggestions announced via `aria-live="polite"`. Save status announced. |
| Screen reader | Document structure (headings, lists, tables) accessible. AI bar actions described. |
| Color contrast | Editor text ≥4.5:1. AI bar meets contrast requirements. |
| Reduced motion | Highlight flash replaced with static change. Transitions disabled. |

### 8.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Document virtualization | CodeMirror 6 for large documents (>10K lines). Virtual scroll in preview. |
| Debounced preview | 100ms debounce on Markdown re-render during editing |
| AI edit debounce | Minimum 500ms between AI edit requests |
| Memoization | `React.memo` on preview with content hash comparison. Outline memoized. |
| Auto-save debounce | 2s after last keystroke. Batch multiple rapid changes. |
| Lazy loading | CodeMirror/editor core lazy-loaded. AI panel lazy-loaded on first open. |
| localStorage backup | Periodic (30s) backup to localStorage for crash recovery |

### 8.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Real-time collaboration | CRDT-based (Yjs) collaborative editing with presence cursors |
| Comments & suggestions | Comment threads anchored to text ranges. Suggestion mode (track changes). |
| Rich text mode | WYSIWYG editor as alternative to Markdown (TipTap/ProseMirror) |
| Diagram editor | Embedded Mermaid/Excalidraw editor for visual diagrams |
| Custom keybindings | User-configurable keyboard shortcuts |
| Vim mode | Vim keybindings option for power users |
| Spell check | Browser-native + custom technical dictionary |
| Multi-document tabs | Open multiple documents as editor tabs |
| Side-by-side diff | Compare any two versions within the editor |
| Plugin system | Editor extensions: word count goals, reading time estimates, complexity analysis |

---

## 9. Version History

### 9.1 Purpose

**Primary Goal:** Provide a complete, navigable history of every version of a document — enabling users to review changes, understand evolution, compare versions, restore previous states, and maintain audit trails for compliance.

**User Intent:** Track how a document has evolved, review what changed between versions, restore a previous version if the current one is unsatisfactory, and understand the AI's contribution at each stage.

**Business Goal:** Build trust through transparency. Version history provides an "undo" safety net that encourages experimentation with AI generation. It also serves as an implicit audit trail for enterprise compliance requirements.

### 9.2 User Journey

**Entry Points:**
- Project page → Document card ••• → "Versions"
- Editor toolbar → "Version History" button / ••• menu
- Editor status bar → Version badge click
- Dashboard AI Activity → Click generation → "View Versions"
- Direct URL: `/project/[slug]/documents/prd/versions`

**Previous Page:**
- Project page
- Editor
- Dashboard (AI Activity)

**Next Pages:**
- Editor (restore version)
- Project page (back)
- Export page (export specific version)

**User Actions:**
1. Browse version timeline — chronological list of all versions
2. View version details — metadata (date, author, tokens, model, change description)
3. Preview version — read-only render of version content
4. Compare versions — side-by-side or unified diff view between any two versions
5. Restore version — replace current document with a previous version
6. Name/tag versions — label significant versions (v1.0, "Client Review", "Final")
7. See what changed — AI-generated summary of changes between versions
8. Navigate directly to editor with a specific version
9. Export specific version

### 9.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  VERSION HISTORY LAYOUT                                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  NAVBAR: ... > PRD > Version History               [⌘K]    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  HEADER                                                     │  │
│  │  📋 Product Requirements Document — Version History        │  │
│  │  Current: v4 · 8 versions total · [Back to Editor]        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────┐ ┌──────────────────────────────┐│
│  │  VERSION TIMELINE          │ │  VERSION DETAIL / COMPARISON ││
│  │  (left panel, 360px)      │ │  (right panel, flex-1)       ││
│  │                            │ │                               ││
│  │  ┌──────────────────────┐ │ │  ┌──────────────────────────┐ ││
│  │  │ ● v4 (Current)  ◀    │ │ │  │  COMPARISON: v3 vs v4    │ ││
│  │  │ ─────────────────── │ │ │  │                          │ ││
│  │  │ Manual edit          │ │ │  │  ┌──────────────────────┐│ ││
│  │  │ Jane Smith           │ │ │  │  │ AI Change Summary    ││ ││
│  │  │ 2 hours ago          │ │ │  │  │ ──────────────────  ││ ││
│  │  │ 8.4k tokens          │ │ │  │  │ Changed 3 sections:  ││ ││
│  │  │ [Preview] [Compare]  │ │ │  │  │ • Added competitor   ││ ││
│  │  └──────────────────────┘ │ │  │  │   analysis section   ││ ││
│  │                            │ │  │  │ • Updated timeline   ││ ││
│  │  ┌──────────────────────┐ │ │  │  │ • Fixed typo in exec ││ ││
│  │  │ ○ v3                 │ │ │  │  │   summary            ││ ││
│  │  │ ─────────────────── │ │ │  │  └──────────────────────┘│ ││
│  │  │ AI Regeneration      │ │ │  │                          │ ││
│  │  │ GPT-4o               │ │ │  │  ┌──────────────────────┐│ ││
│  │  │ 1 day ago            │ │ │  │  │  Unified Diff View   ││ ││
│  │  │ 9.1k tokens · $0.24  │ │ │  │  │  ──────────────────  ││ ││
│  │  │ "Added competitor     │ │ │  │  │  ## Executive Summary││ ││
│  │  │  analysis section"    │ │ │  │  │  -The Mobile App     ││ ││
│  │  │ [Preview] [Compare]  │ │ │  │  │  +The Mobile App     ││ ││
│  │  │ [Restore]            │ │ │  │  │   Redesign project   ││ ││
│  │  └──────────────────────┘ │ │  │  │   aims to deliver... ││ ││
│  │                            │ │  │  │                      ││ ││
│  │  ┌──────────────────────┐ │ │  │  │  +## Competitor      ││ ││
│  │  │ ○ v2                 │ │ │  │  │  + Analysis          ││ ││
│  │  │ ─────────────────── │ │ │  │  │  +The mobile banking  ││ ││
│  │  │ Manual edit          │ │ │  │  │  + app market is...  ││ ││
│  │  │ Jane Smith           │ │ │  │  └──────────────────────┘│ ││
│  │  │ 2 days ago           │ │ │  │                          │ ││
│  │  │ 7.8k tokens          │ │ │  │  ┌──────────┐ ┌────────┐│ ││
│  │  └──────────────────────┘ │ │  │  │ Restore v3│ │Open in ││ ││
│  │                            │ │  │  │ (primary) │ │Editor  ││ ││
│  │  ┌──────────────────────┐ │ │  │  └──────────┘ └────────┘│ ││
│  │  │ ○ v1 (Initial)       │ │ │  └──────────────────────────┘ ││
│  │  │ ─────────────────── │ │ │                               ││
│  │  │ AI Generated         │ │ │                               ││
│  │  │ GPT-4o               │ │ └──────────────────────────────┘│
│  │  │ 3 days ago           │ │                                  │
│  │  │ 8.2k tokens · $0.21  │ │                                  │
│  │  └──────────────────────┘ │                                  │
│  └────────────────────────────┘                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Sticky Elements:** Header with document context. Version timeline independently scrollable.

**Responsive Behavior:**
- **Desktop (≥1024px):** Split panel — timeline left (360px), detail right
- **Tablet (768-1023px):** Timeline full width, detail as expandable panel or navigate-to
- **Mobile (<768px):** Single column. Timeline as list. Tap to view version detail on new screen or bottom sheet.

### 9.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `PageHeader` | Organism | Document title, version count, back navigation |
| `VersionTimeline` | Organism | Vertical timeline with version nodes, connected by lines |
| `VersionNode` | Molecule | Single version: dot/indicator, metadata, actions, active state |
| `Badge` | Atom | Version type: "Current", "AI Generated", "Manual Edit", "Restored" |
| `Button` (primary) | Atom | "Restore this version", "Open in Editor" |
| `Button` (secondary) | Atom | "Preview", "Compare" |
| `Button` (ghost) | Atom | Tag version, delete version |
| `DiffView` | Organism | Side-by-side or unified diff view with syntax highlighting |
| `MonacoDiffEditor` / `react-diff-viewer` | Molecule | Line-by-line diff with additions (green), deletions (red), unchanged (neutral) |
| `AIChangeSummary` | Molecule | AI-generated natural language summary of what changed between versions |
| `MarkdownPreview` | Molecule | Read-only rendered Markdown for version preview |
| `VersionMetadata` | Molecule | Date, author, model, tokens, cost, change description |
| `Dialog` | Molecule | Restore confirmation: "Restoring v3 will replace the current version. This creates a new version (v5)." |
| `Skeleton` | Atom | Timeline loading, diff loading |
| `Spinner` | Atom | Diff computation loading |
| `Tooltip` | Atom | Token/cost breakdown on hover |
| `Toast` | Molecule | "Version v3 restored as v5", "Comparison loaded" |

### 9.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| View version list | Navigate to page | Fetch all versions for document, render timeline |
| Select version | Click version node | Highlight node, load version content in detail panel |
| Preview version | Click "Preview" | Render Markdown in read-only mode in detail panel |
| Compare versions | Select two nodes (checkboxes) + "Compare" | Fetch both versions, render diff view |
| AI change summary | Auto-on compare | Generate natural language summary of changes |
| Restore version | Click "Restore" → Confirm dialog | Create new version with old content, mark as current |
| Tag version | Click "Add tag" | Inline input for custom label (e.g., "v1.0", "Client Approved") |
| Open in editor | Click "Open in Editor" | Navigate to editor with selected version content (read-only then prompt to edit) |
| Name version | ••• → "Name this version" | Add human-readable name to version metadata |
| Delete version | ••• → "Delete" (admin only) | Soft delete version (preserves audit trail) |
| Export version | ••• → "Export this version" | Open export dialog with version pre-selected |

**Keyboard Shortcuts:**
- `J` / `K` — Navigate up/down version list
- `Enter` — Preview selected version
- `C` — Compare selected versions
- `R` — Restore selected version
- `E` — Open in editor
- `Esc` — Clear selection / back

### 9.6 AI Features

| Feature | Description |
|---------|-------------|
| AI change summary | Natural language description of what changed between any two versions |
| Diff annotation | AI highlights significant vs cosmetic changes |
| Version insights | AI identifies patterns: "Most changes focus on the security requirements section" |
| Restoration recommendations | AI suggests: "v2 of the Architecture document aligns better with your current PRD" |
| Change categorization | AI categorizes changes: Content addition, Clarification, Correction, Restructuring |
| Impact analysis | "Restoring v3 will reintroduce the monolithic architecture recommendation removed in v4" |

### 9.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Loading versions | Skeleton timeline with 4-5 placeholder nodes | Fetch document + versions |
| Empty (single version) | Single v1 node. "This is the first and only version." | No history to show |
| Version selected | Node highlighted. Detail panel shows preview. | Selected state on node |
| Comparing | Two nodes highlighted. Diff view loading. | Dual selection |
| Diff loading | Skeleton in detail panel. "Computing differences..." | Fetch both versions |
| Diff ready | Color-coded diff with summary | Side-by-side or unified |
| Restoring | Dialog open. "Restoring..." spinner on confirm. | POST new version |
| Restored | Timeline updates: new v5 (Current). Previous "current" badge moves. Toast. | Version created |
| Error (fetch) | "Failed to load version history. [Retry]" | API error |
| Error (diff) | "Could not compute diff. [Retry]" | Diff computation error |

### 9.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| View version history | ✅ | ✅ | ✅ |
| Preview versions | ✅ | ✅ | ✅ |
| Compare versions | ✅ | ✅ | ✅ |
| Restore version | ✅ | ✅ | ❌ |
| Tag/name versions | ✅ | ✅ | ❌ |
| Delete versions | ✅ | ❌ | ❌ |
| Export versions | ✅ | ✅ | ✅ |

### 9.9 API Integration

#### List Versions

```
GET /api/v1/projects/:projectId/documents/:stepId/versions

Response 200:
{
  "success": true,
  "data": {
    "document": Document,
    "versions": [
      {
        "id": "uuid",
        "versionNumber": 4,
        "content": "# Product...",
        "modelUsed": null,
        "tokensUsed": 0,
        "createdAt": "2026-07-21T14:30:00Z",
        "type": "manual_edit",
        "author": { "name": "Jane Smith" }
      },
      {
        "id": "uuid",
        "versionNumber": 3,
        "content": "# Product...",
        "modelUsed": "gpt-4o",
        "tokensUsed": 9100,
        "createdAt": "2026-07-20T10:15:00Z",
        "type": "ai_regeneration",
        "changeDescription": "Added competitor analysis section"
      }
    ]
  }
}
```

#### Restore Version

```
POST /api/v1/projects/:projectId/documents/:stepId/restore
{ "versionNumber": 3 }

Response 200:
{
  "success": true,
  "data": {
    "document": Document,   // Updated with restored content, version incremented
    "newVersion": DocumentVersion
  }
}
```

#### AI Change Summary (via pipeline)

```
POST /api/v1/pipeline/generate
{
  "projectId": "uuid",
  "stepId": "diff-summary",
  "context": {
    "versionA": "v3 content...",
    "versionB": "v4 content..."
  }
}

Response 200:
{
  "success": true,
  "data": {
    "summary": "Changed 3 sections: Added competitor analysis, updated timeline, fixed typo..."
  }
}
```

**Loading Behavior:** Version timeline loads with skeleton. Diff computation shows loading state. AI summary streams in.

**Retry Logic:** Failed fetch retried once. Diff retry on failure.

### 9.10 Database Mapping

**DocumentVersion model:**
- `id`, `documentId`, `versionNumber`, `content` (Text — immutable snapshot), `modelUsed`, `tokensUsed`, `createdAt`
- Unique: `[documentId, versionNumber]`
- Index: `documentId`

**Document model (current version):**
- `version` — Current version number (matches latest DocumentVersion)
- `content` — Current content (synced with latest version)

**DocumentVersion creation:** On every save that changes >50 characters. On every AI generation/regeneration. On version restore.

### 9.11 Edge Cases

| Case | Handling |
|------|----------|
| Single version only | Timeline shows one node. "This is the initial version. No history to compare." |
| Very large diff (50K+ words) | Paginate diff. "Showing first 500 changes. [Load more]" |
| Many versions (100+) | Virtualize timeline. Group by month/year. "Show all 127 versions" toggle. |
| Deleted document | Versions still accessible (soft delete). "Document archived. Versions preserved." |
| Restore creates identical content | Detect no-change: "Selected version is identical to current. No restore needed." |
| AI summary failure | Fallback: show raw diff statistics (lines added/removed) |
| Concurrent restore | Lock document during restore. "Another operation is in progress." |
| Compare identical versions | Show "These versions are identical" message |
| Version from deleted user | Show "Unknown user" for author. Content preserved. |

### 9.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Timeline load | Nodes stagger fade in from left (50ms each) | 300ms total | [0.4, 0, 0.2, 1] |
| Version select | Node scale 1→1.02 + highlight border | 150ms | ease |
| Diff view | Slide in + fade in detail panel | 300ms | [0.4, 0, 0.2, 1] |
| Restore confirm | Dialog scale 0.95→1 | 200ms | spring |
| Restore success | Timeline animation: new node drops from top | 400ms | spring |
| Current badge move | Badge slides from old to new node | 300ms | [0.4, 0, 0.2, 1] |
| Compare mode | Two nodes connect with animated line | 400ms | ease |
| AI summary | Text fades in line by line (100ms stagger) | 300ms total | ease |

### 9.13 Mobile Experience

- Single column: timeline as scrollable list
- Tap version → push to detail screen
- Compare: select two versions via checkboxes, "Compare" button
- Diff view in unified mode (side-by-side impractical on mobile)
- Restore via swipe action or detail screen button
- Back gesture to return to timeline

### 9.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic structure | Timeline as `<ol>` with `<li>` nodes. Detail as `<article>`. Diff with proper markup. |
| Focus management | Arrow keys navigate timeline. Focus moves to detail panel on selection. |
| ARIA | `aria-selected` on active version node. `aria-label` on diff additions/deletions. |
| Screen reader | Version metadata announced. Diff changes announced with line numbers. AI summary as live region. |
| Color | Diff colors (green/red) also indicated with +/- prefixes. Confirmed 4.5:1 for text. |
| Keyboard | Full keyboard navigation between nodes, actions, and diff view. |

### 9.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Timeline virtualization | Required for 100+ versions. `@tanstack/virtual` or custom. |
| Diff lazy loading | Fetch and compute diff only when comparing. Not on initial load. |
| Version content caching | Cache version contents client-side for toggling between previews. |
| AI summary caching | Cache summaries per version pair. Reuse on revisit. |
| Memoization | `React.memo` on VersionNode, DiffView. |
| Pagination | Load last 20 versions initially. "Load older versions" button. |

### 9.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Branching | Create named branches from versions for parallel exploration |
| Merge tool | Merge changes from different branches with conflict resolution |
| Blame view | Line-by-line attribution showing which version/author introduced each line |
| Visual diff | Side-by-side rendered Markdown diff (not just source) |
| Version policies | Auto-delete versions older than X days (retention policy) |
| Signed versions | Digital signatures for compliance (e.g., "Approved for production") |
| Export diff | Export comparison as PDF with change highlights |
| Activity feed integration | Version events appear in project/workspace activity feeds |
| Webhook triggers | Version events trigger webhooks for CI/CD integration |
| Batch operations | Delete/purge/export multiple versions at once |

---

## 10. Export

### 10.1 Purpose

**Primary Goal:** Enable users to download their generated specification documents as polished, production-ready files in multiple formats — PDF, Markdown, HTML, and DOCX — either individually, as a complete project suite, or as custom selections.

**User Intent:** Extract value from PromptPilot by obtaining documents they can share with stakeholders, commit to repositories, attach to tickets, present to clients, or archive for compliance.

**Business Goal:** The export is the moment of value delivery. A smooth, high-quality export experience creates brand loyalty and word-of-mouth referrals. Supporting multiple formats ensures the platform fits into any workflow.

### 10.2 User Journey

**Entry Points:**
- Project page → "Export" button
- Document card → ••• → "Export"
- Editor → ••• → "Export"
- Version History → ••• → "Export this version"
- Dashboard → Quick Action (future)
- Direct URL: `/project/[slug]/export`

**Previous Page:**
- Project page
- Editor
- Version History
- Any document page

**Next Pages:**
- Download success → Back to project page
- External: downloaded file opens in user's system

**User Actions:**
1. Select which documents to export (single, multiple, all)
2. Choose export format (PDF, Markdown, HTML, DOCX)
3. Configure export options (page size, include TOC, include metadata, branding)
4. Preview export settings
5. Generate export package
6. Track export generation progress
7. Download completed export
8. Share download link (if cloud-hosted)
9. View export history for the project
10. Re-download previous exports

### 10.3 Complete Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  EXPORT PAGE LAYOUT                                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  NAVBAR: ... > Mobile App Redesign > Export        [⌘K]    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  HEADER                                                     │  │
│  │  📦 Export — Mobile App Redesign                           │  │
│  │  Generate downloadable specification documents             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────┐ ┌────────────────────────┐ │
│  │  EXPORT CONFIGURATION            │ │  PREVIEW + HISTORY     │ │
│  │  (left panel, 420px)            │ │  (right panel, flex-1) │ │
│  │                                  │ │                         │ │
│  │  STEP 1: SELECT DOCUMENTS        │ │  ┌───────────────────┐ │ │
│  │  ┌────────────────────────────┐ │ │  │  EXPORT PREVIEW   │ │ │
│  │  │ ☑ Select All (9 documents) │ │ │  │                   │ │ │
│  │  │ ──────────────────────────│ │ │  │  ┌───────────────┐ │ │ │
│  │  │ ☑ Master Context     ✓    │ │ │  │  │ 📄 PRD        │ │ │ │
│  │  │ ☑ PRD                ✓    │ │ │  │  │   24 pages    │ │ │ │
│  │  │ ☑ SRS                ✓    │ │ │  │  │   estimated  │ │ │ │
│  │  │ ☑ Architecture       ✓    │ │ │  │  ├───────────────┤ │ │ │
│  │  │ ☑ Database Schema    ✓    │ │ │  │  │ 📄 SRS        │ │ │ │
│  │  │ ☑ API Spec           ✓    │ │ │  │  │   18 pages    │ │ │ │
│  │  │ ☑ User Flows         ✓    │ │ │  │  ├───────────────┤ │ │ │
│  │  │ ☑ Wireframes         ✓    │ │ │  │  │ ...           │ │ │ │
│  │  │ ☑ Roadmap            ✓    │ │ │  │  └───────────────┘ │ │ │
│  │  └────────────────────────────┘ │ │  │                   │ │ │
│  │                                  │ │  │  Total: 9 docs   │ │ │
│  │  STEP 2: FORMAT                 │ │  │  ~150 pages      │ │ │
│  │  ┌────────────────────────────┐ │ │  └───────────────────┘ │ │
│  │  │ ○ PDF (Recommended)        │ │ │                         │ │
│  │  │ ○ Markdown (.md)           │ │ │  ┌───────────────────┐ │ │
│  │  │ ○ HTML                    │ │ │  │  EXPORT HISTORY   │ │ │
│  │  │ ○ DOCX                   │ │ │  │                   │ │ │
│  │  └────────────────────────────┘ │ │  │  📦 Export #4     │ │ │
│  │                                  │ │  │  PDF · 9 docs   │ │ │
│  │  STEP 3: OPTIONS (PDF shown)    │ │  │  2 hours ago     │ │ │
│  │  ┌────────────────────────────┐ │ │  │  1.2 MB · [DL]  │ │ │
│  │  │ Page Size: [A4 ▼]         │ │ │  │  ─────────────── │ │ │
│  │  │ ☑ Include Table of Contents│ │ │  │  📦 Export #3     │ │ │
│  │  │ ☑ Include metadata header  │ │ │  │  Markdown · 5    │ │ │
│  │  │ ☑ Include PromptPilot      │ │ │  │  docs · 1 day ago│ │ │
│  │  │    branding (Free tier)     │ │ │  │  450 KB · [DL]  │ │ │
│  │  │ ☐ Include AI generation    │ │ │  │  ─────────────── │ │ │
│  │  │    notes as appendix        │ │ │  │  📦 Export #2     │ │ │
│  │  │ ☐ Watermark "DRAFT"        │ │ │  │  HTML · 9 docs   │ │ │
│  │  │ ☐ Page numbers             │ │ │  │  3 days ago      │ │ │
│  │  └────────────────────────────┘ │ │  │  2.8 MB · [DL]  │ │ │
│  │                                  │ │  └───────────────────┘ │ │
│  │  ┌────────────────────────────┐ │ └────────────────────────┘ │
│  │  │  ⚡ Export Suite           │ │                              │
│  │  │  (primary btn, full width) │ │                              │
│  │  └────────────────────────────┘ │                              │
│  └──────────────────────────────────┘                              │
└──────────────────────────────────────────────────────────────────┘

```
#### 10.3b Export Processing View

```
┌──────────────────────────────────────────────────────────────────┐
│  EXPORT PROCESSING (shown after "Export Suite" click)             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ⟳ Generating Export...                                    │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │ ████████████████░░░░░░░░░░░░░░  65%                   │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  ✓ Collected 9 documents                                   │  │
│  │  ✓ Converted to PDF format                                 │  │
│  │  ⟳ Generating Table of Contents...                         │  │
│  │  ○ Adding metadata header                                  │  │
│  │  ○ Finalizing package                                      │  │
│  │                                                             │  │
│  │  Estimated time remaining: 5 seconds                       │  │
│  │  [Cancel Export]                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  EXPORT COMPLETE (shown on success)                        │  │
│  │                                                             │  │
│  │  ✅ Export Ready!                                           │  │
│  │                                                             │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │  📄 Mobile_App_Redesign_Specification_Suite.pdf       │ │  │
│  │  │  9 documents · 156 pages · 1.2 MB                     │ │  │
│  │  │  Generated: just now · Format: PDF                    │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  ┌────────────────┐  ┌────────────────┐                   │  │
│  │  │  Download PDF    │  │  Copy Link     │                   │  │
│  │  │  (primary btn)   │  │  (secondary)    │                   │  │
│  │  └────────────────┘  └────────────────┘                   │  │
│  │                                                             │  │
│  │  Link expires in 7 days. [ⓘ]                              │  │
│  │  [Export Another]  [Back to Project]                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 10.4 UI Components

| Component | Type | Description |
|-----------|------|-------------|
| `PageHeader` | Organism | Title, project context, back navigation |
| `DocumentSelector` | Organism | Checklist of project documents with status indicators |
| `Checkbox` | Atom | Per-document selection toggle |
| `RadioGroup` | Molecule | Format selection (PDF, Markdown, HTML, DOCX) |
| `Select` | Atom | Page size dropdown (A4, Letter, Legal) |
| `Switch` / `Checkbox` | Atom | Option toggles (TOC, metadata, branding, etc.) |
| `Button` (primary) | Atom | "Export Suite", "Download" |
| `Button` (secondary) | Atom | "Copy Link", "Export Another", "Back to Project" |
| `ProgressBar` | Molecule | Export generation progress with percentage |
| `ExportProgress` | Organism | Step-by-step processing indicators |
| `PreviewCard` | Molecule | Document preview with estimated page count |
| `ExportHistory` | Organism | List of past exports with format, date, size, download |
| `ExportHistoryItem` | Molecule | Single past export entry |
| `Skeleton` | Atom | History loading, preview loading |
| `Spinner` | Atom | Processing indicator |
| `Badge` | Atom | Format type, export status |
| `Tooltip` | Atom | Option descriptions, "Why PDF?" explainer |
| `Toast` | Molecule | "Export started", "Export ready", "Export failed" |
| `Dialog` | Molecule | Large export warning (>50 pages), branding upsell (Pro feature) |

### 10.5 Functional Requirements

| Action | Trigger | Behavior |
|--------|---------|----------|
| Select documents | Toggle checkboxes | Update preview card with estimated page count and file size |
| Select all | Click "Select All" | Toggle all documents on/off |
| Choose format | Click radio button | Update options panel (format-specific options appear) |
| Configure options | Toggle switches/dropdowns | Update preview |
| Export suite | Click "Export Suite" | Validate selections, start export processing |
| Track progress | Auto-update during processing | Progress bar + step indicators animate |
| Cancel export | Click "Cancel" during processing | Abort export, discard partial file |
| Download | Click "Download" on complete | Trigger file download from URL |
| Copy link | Click "Copy Link" | Copy shareable download URL to clipboard |
| Re-download | Click "DL" in history | Download previously generated export |
| Delete export | ••• on history item | Remove export record and file (30-day retention) |
| Change page size | Select new size | Update preview with page estimate recalculation |

**Keyboard Shortcuts:**
- `⌘Enter` — Start export
- `Esc` — Cancel export / back to project

### 10.6 AI Features

| Feature | Description |
|---------|-------------|
| Smart document ordering | AI determines optimal document order (PRD → SRS → Architecture...) for the export |
| Auto-generated TOC | AI creates a formatted Table of Contents with proper nesting |
| Document summaries as preface | AI generates a 1-page executive summary of the entire suite |
| Cross-reference linking | AI adds internal links between related sections across documents |
| Format optimization | AI adjusts content formatting based on chosen output (PDF layout, Markdown clean, HTML responsive) |
| Metadata generation | AI generates document metadata: title, author, date, version, keywords |

### 10.7 State Management

| State | Visual | Handling |
|-------|--------|----------|
| Idle | Configuration form with preview | Default state |
| No documents selected | "Select at least one document to export." Warning. Export disabled. | Validation |
| Processing | Progress view with progress bar + step list | POST export generation |
| Processing step | Steps animate checkmark as completed | Server-sent progress (polling) |
| Complete | Download card with file info + actions | Export status = COMPLETED |
| Failed | "Export failed. [Retry] [Try different format]" error state | Export status = FAILED |
| Downloading | Button spinner + system download dialog | File transfer |
| Loading history | Skeleton list items | Fetch export history |
| Empty history | "No previous exports. Generate your first export above." | No export records |
| Free tier limit | "Free tier: includes PromptPilot branding. [Upgrade to Pro]" | Tier check |
| Large export | "This export is 156 pages. Generation may take 10-20 seconds." (not a warning, info) | Page count threshold |

### 10.8 Permissions

| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| Export documents | ✅ | ✅ | ✅ |
| Download exports | ✅ | ✅ | ✅ |
| Copy share link | ✅ | ✅ | ✅ |
| View export history | ✅ | ✅ | ✅ |
| Delete exports | ✅ | ✅ | ❌ |
| Custom branding (Pro) | ✅ | ✅ (own) | ❌ |
| Remove PromptPilot branding | ✅ (Pro) | ❌ | ❌ |

### 10.9 API Integration

#### Start Export

```
POST /api/v1/exports
{
  "projectId": "uuid",
  "documentIds": ["uuid1", "uuid2", "uuid3"],
  "format": "PDF",
  "options": {
    "pageSize": "A4",
    "includeTOC": true,
    "includeMetadata": true,
    "includeBranding": true,
    "includeAINotes": false,
    "watermark": null
  }
}

Response 202:
{
  "success": true,
  "data": {
    "exportId": "uuid",
    "status": "PENDING"
  }
}
```

#### Check Export Status (Polling)

```
GET /api/v1/exports/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PROCESSING",  // PENDING | PROCESSING | COMPLETED | FAILED
    "progress": 65,
    "currentStep": "generating_toc",
    "format": "PDF",
    "fileUrl": null,          // null until COMPLETED
    "fileSize": null
  }
}

// When COMPLETED:
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "progress": 100,
    "currentStep": null,
    "format": "PDF",
    "fileUrl": "https://exports.promptpilot.dev/exports/uuid.pdf",
    "fileSize": 1258291,
    "expiresAt": "2026-07-28T00:00:00Z"
  }
}
```

#### List Export History

```
GET /api/v1/exports?projectId={id}&page=1&limit=10

Response 200:
{
  "success": true,
  "data": [Export[]],
  "meta": { "total": 4, "page": 1, "limit": 10 }
}
```

#### Delete Export

```
DELETE /api/v1/exports/:id

Response 200:
{ "success": true, "data": { "message": "Export deleted" } }
```

**Loading Behavior:** Export starts with instant feedback (202), then polls every 2s for progress. Progress bar updates incrementally.

**Optimistic Updates:** Export history item appears immediately in "PROCESSING" state. Document selection is instant (client-side only).

**Retry Logic:** Failed exports can be manually retried. Polling stops on error and shows retry button.

### 10.10 Database Mapping

**Export model:**
- `id`, `projectId`, `format` (PDF/MARKDOWN/HTML/DOCX), `status` (PENDING/PROCESSING/COMPLETED/FAILED), `fileUrl`, `fileSize`, `documentIds` (JSON array), `createdAt`, `expiresAt`
- Relations: `project` (Project)
- Indexes: `projectId`, `status`

**File Storage:** Exported files stored in cloud object storage (S3/R2). `fileUrl` is a signed URL with expiry. Files auto-deleted after `expiresAt`.

**Pagination:** Export history paginated (10 per page, sorted by createdAt desc).

### 10.11 Edge Cases

| Case | Handling |
|------|----------|
| No documents selected | "Select at least one document to export." Button disabled. |
| All documents empty | "Selected documents are empty. Generate content first." |
| Very large export (50+ MB) | Show progress bar with time estimate. Stream download to avoid memory issues. |
| Export timeout | "Export is taking longer than expected. We'll notify you when ready." Async fallback with notification. |
| Download interrupted | Resume support via Range headers. Re-download from history. |
| Expired download link | "This download link has expired (7 days). Generate a new export." |
| Concurrent exports | Queue system. "Another export is processing. Your request has been queued." |
| Browser blocks download | "If download doesn't start, [click here]." Fallback button. |
| Free tier branding upsell | Pro feature (custom branding) shown with "Pro" badge. Click opens pricing dialog. |
| Deleted project | Export history still accessible via direct link for 30 days after project deletion. |
| Format unsupported on device | DOCX warning on mobile: "DOCX requires a compatible app. Consider PDF instead." |

### 10.12 Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Document select | Checkbox fill + row highlight | 150ms | ease |
| Format switch | Radio fill animation (scale) | 200ms | spring |
| Export start | Form slide left → progress slide right | 400ms | [0.4, 0, 0.2, 1] |
| Progress bar fill | Width transition | 500ms per step | ease |
| Step complete | Checkmark bounce + text fade | 300ms | spring |
| Export complete | Card slide up + scale 0.98→1 + checkmark bounce | 500ms | spring |
| Download button | Pulse on complete (subtle) | 1.5s | ease |
| History item load | Staggered fade in (50ms each) | 200ms total | [0.4, 0, 0.2, 1] |
| Delete history | Item slide left + fade out | 200ms | ease-in |
| Processing indicator | Spinner + step text typing | varies | — |

### 10.13 Mobile Experience

- Single column: configuration stacked vertically, preview/history below
- Format selector as horizontal scroll pill selector
- Document selector as scrollable list with sticky "Select All" header
- Progress view becomes full-screen overlay during processing
- Download triggers native share sheet (Web Share API) on mobile
- "Copy Link" uses native share if Web Share API available
- Export history as simple list, tap to re-download

### 10.14 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic form | `<fieldset>` for document selection, format selection, options. `<legend>` labels. |
| Progress announcement | `aria-live="polite"` announcements during processing: "65% complete, generating table of contents" |
| Keyboard | Full tab navigation through all controls. Space to toggle. Enter to submit. |
| Focus management | Focus moves to download button on completion. Focus trapped during processing. |
| Screen reader | Document count announced. Format options described. Progress steps read. Download ready announced. |
| Color | Progress bar uses both color and text percentage. No color-only status indicators. |

### 10.15 Performance

| Technique | Implementation |
|-----------|---------------|
| Async processing | Export generated server-side. Client polls every 2s (not blocking). |
| File streaming | Large files streamed with Content-Disposition header. Progress via Content-Length. |
| Progress polling | Exponential backoff if long-running: 2s → 5s → 10s (max). Stop after 5 minutes. |
| Preview estimates | Client-side page count estimation based on content length and format. |
| History caching | Export history cached with SWR. Revalidates on export complete. |
| Lazy options | Format-specific options loaded only when format selected. |

### 10.16 Future Scalability

| Feature | Integration Path |
|---------|-----------------|
| Scheduled exports | Auto-export on schedule (daily/weekly) with email delivery |
| Custom branding | Upload company logo, color scheme for branded exports |
| Export profiles | Save export configuration as named profile for reuse |
| Multi-format bundle | Export all formats at once as ZIP archive |
| Cloud storage integration | Direct export to Google Drive, Dropbox, Notion, GitHub |
| API-driven export | Public API endpoint for CI/CD pipeline integration |
| Watermark system | Custom watermark text, image, or "CONFIDENTIAL" stamp |
| Digital signatures | Cryptographically sign PDF exports for compliance |
| Export notifications | Email/Slack notification when large export completes |
| Collaborative review export | Export with comments and annotations included |
| ePub format | Export as eBook format for e-reader distribution |
| Presentation format | Export as slide deck (PPTX/Google Slides) for stakeholder presentations |

---

## Appendix A: Cross-Cutting Concerns

### A.1 Global Keyboard Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `⌘K` | Global | Open command palette |
| `⌘?`  | Global | Show keyboard shortcuts help overlay |
| `G D` | Global | Go to Dashboard |
| `G W` | Global | Go to Workspaces |
| `G P` | Global | Go to Projects |
| `G S` | Global | Go to Settings |
| `N`   | Global | New Project (opens dialog) |
| `⌘N`  | Global | New item (context-dependent) |
| `Esc` | Global | Close modal/panel/palette. Cancel operation. |
| `/`   | List pages | Focus search/filter input |

### A.2 Global State — Offline Mode

All pages implement an offline-first approach where possible:
- Dashboard, Workspace, Project pages cache data via SWR
- Editor auto-saves to localStorage as backup
- AI features disabled when offline
- Offline banner: "⚠ You're offline. Some features are unavailable." at top of viewport
- Pending actions queued in IndexedDB, synced on reconnect

### A.3 Global State — Rate Limiting

- 429 responses trigger a toast: "Rate limit reached. Try again in Xs."
- Countdown timer in toast
- AI generation actions show remaining quota in UI
- Pro tier increases limits

### A.4 Theme Support

- Light mode (default) and dark mode via `class` toggle on `<html>`
- Persisted to localStorage
- Respects `prefers-color-scheme` on first visit
- All components use CSS variables for color tokens

### A.5 Responsive Layout System

```
┌─────────────────────────────────────────────────┐
│  BREAKPOINT MAP                                  │
│                                                  │
│  <640px   Mobile     Single column, no sidebar   │
│  640-767  Mobile L   Single column, no sidebar   │
│  768-1023 Tablet     2-column, icon sidebar      │
│  1024-1279 Desktop   2-3 column, full sidebar     │
│  1280+    Desktop L  Max-width container, full    │
│  1536+    Desktop XL Larger max-width             │
└─────────────────────────────────────────────────┘
```

---

## Appendix B: Implementation Priority Matrix

| Priority | Screen | Status | Effort |
|----------|--------|--------|--------|
| P0 | Landing Page | ✅ Built (needs Tailwind migration) | Medium |
| P0 | Authentication | ✅ Built (login + register) | Done |
| P0 | Dashboard | ✅ Built (needs API data wiring) | Medium |
| P0 | Project | 🔜 Scaffold exists | Large |
| P0 | Editor | 🔜 Placeholder exists | Large |
| P1 | Workspace | 🔜 Scaffold exists | Medium |
| P1 | PRD Generator | ❌ Not started | Large |
| P1 | Export | ❌ Not started | Medium |
| P1 | Version History | ❌ Not started | Medium |
| P1 | AI Chat | 🔜 Scaffold exists | Large |

---

## Appendix C: API Endpoint Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/refresh` | Refresh tokens |
| `POST` | `/auth/logout` | Sign out |
| `GET` | `/auth/me` | Current user |
| `GET` | `/dashboard/stats` | Dashboard statistics |
| `GET` | `/workspaces` | List workspaces |
| `GET` | `/workspaces/:id` | Get workspace |
| `POST` | `/workspaces` | Create workspace |
| `PATCH` | `/workspaces/:id` | Update workspace |
| `DELETE` | `/workspaces/:id` | Archive workspace |
| `GET` | `/projects` | List projects |
| `GET` | `/projects/:id` | Get project |
| `POST` | `/projects` | Create project |
| `PATCH` | `/projects/:id` | Update project |
| `DELETE` | `/projects/:id` | Archive project |
| `GET` | `/projects/:id/documents` | List project documents |
| `POST` | `/pipeline/generate` | Generate document (non-streaming) |
| `POST` | `/pipeline/generate/stream` | Generate document (SSE streaming) |
| `POST` | `/pipeline/run` | Run full pipeline |
| `GET` | `/conversations` | List AI conversations |
| `GET` | `/conversations/:id` | Get conversation with messages |
| `POST` | `/conversations/:id/messages` | Send message in conversation |
| `DELETE` | `/conversations/:id` | Archive conversation |
| `POST` | `/exports` | Start export generation |
| `GET` | `/exports/:id` | Get export status/metadata |
| `GET` | `/exports` | List export history |
| `DELETE` | `/exports/:id` | Delete export |

---

*Document Version: 1.0 — PromptPilot Product UX Specification*
*Last Updated: 2026-07-21*
*Authors: PromptPilot Product Team*
