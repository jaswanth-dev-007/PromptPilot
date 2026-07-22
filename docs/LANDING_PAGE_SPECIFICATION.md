# PromptPilot — Landing Page Specification

## Complete Enterprise-Grade UX, UI & Engineering Specification

### Version 1.0 — Production-Ready Build Document

---

## Visual Design System Reference

Before diving into sections, here are the foundational tokens that govern every pixel. These align with the existing PromptPilot Design System (`docs/DESIGN_SYSTEM.md`) and `tailwind.config.js`.

### Typography

```
Font Families:
  Headings:   Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Body:       Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Mono:       'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace

Type Scale:
  xs:   0.75rem (12px)  — Badges, captions, legal text
  sm:   0.875rem (14px) — Secondary nav, card descriptions, footer links
  base: 1rem (16px)     — Body text, form inputs, FAQ answers
  lg:   1.125rem (18px) — Section subtitles, feature descriptions
  xl:   1.25rem (20px)  — Card titles, testimonial quotes
  2xl:  1.5rem (24px)   — Section headings (small)
  3xl:  1.875rem (30px) — Section headings
  4xl:  2.25rem (36px)  — Major section headings
  5xl:  3rem (48px)     — Hero sub-scale
  6xl:  3.75rem (60px)  — Hero headline

Font Weights:
  normal:   400 — Body text
  medium:   500 — Navigation, labels, subtitles
  semibold: 600 — Buttons, card titles, CTAs
  bold:     700 — Headlines, hero

Letter Spacing:
  Hero:         -0.03em
  Section H2:   -0.02em
  Section H3:   -0.01em
  Body:          normal
  Uppercase:    0.05em (section overlines)

Line Heights:
  Hero headline:   1.1
  Section heading: 1.2
  Body:            1.6 - 1.7
  Card description: 1.5
```

### Color Palette (Tailwind-Mapped)

```
Primary (Indigo):
  50:  #EEF2FF  — Badge backgrounds, hover states (light)
  100: #E0E7FF  — Active nav backgrounds
  200: #C7D2FE  — Focus rings (subtle)
  400: #818CF8  — Dark mode primary
  500: #6366F1  — Interactive states
  600: #4F46E5  — PRIMARY BRAND, buttons, links, active elements
  700: #4338CA  — Button hover
  800: #3730A3  — Button active / pressed
  900: #312E81  — Dark backgrounds

Neutral (Slate):
  50:  #F8FAFC  — Page background, card backgrounds (light)
  100: #F1F5F9  — Subtle section backgrounds
  200: #E2E8F0  — Borders, dividers
  300: #CBD5E1  — Disabled states
  400: #94A3B8  — Placeholder text
  500: #64748B  — Secondary text, descriptions
  600: #475569  — Muted headings
  700: #334155  — Body text (light mode)
  800: #1E293B  — Dark section backgrounds
  900: #0F172A  — Headings, footer background, dark mode bg
  950: #020617  — Darkest backgrounds

Semantic:
  Success: #10B981 (Emerald-500) / #059669 (Emerald-600)
  Warning: #F59E0B (Amber-500)  / #D97706 (Amber-600)
  Error:   #EF4444 (Red-500)    / #DC2626 (Red-600)
  Info:    #0EA5E9 (Sky-500)    / #0284C7 (Sky-600)
```

### Spacing Scale

```
0:    0
px:   1px
0.5:  0.125rem (2px)
1:    0.25rem  (4px)   ← Base unit
1.5:  0.375rem (6px)
2:    0.5rem   (8px)
2.5:  0.625rem (10px)
3:    0.75rem  (12px)
3.5:  0.875rem (14px)
4:    1rem     (16px)
5:    1.25rem  (20px)
6:    1.5rem   (24px)
7:    1.75rem  (28px)
8:    2rem     (32px)
9:    2.25rem  (36px)
10:   2.5rem   (40px)
11:   2.75rem  (44px)
12:   3rem     (48px)
14:   3.5rem   (56px)
16:   4rem     (64px)
20:   5rem     (80px)  ← Section vertical padding
24:   6rem     (96px)
28:   7rem     (112px)
32:   8rem     (128px)
36:   9rem     (144px)
40:   10rem    (160px)
```

### Border Radius

```
sm:  4px    — Inputs, small badges
md:  8px    — Buttons, nav items, chips
lg:  12px   — Cards, dialogs, panels
xl:  16px   — Hero CTAs
2xl: 24px   — Large feature cards
full: 9999px — Pills, badges, avatars
```

### Shadows

```
sm:  0 1px 2px rgba(0,0,0,0.05)       — Subtle elevation (cards on white bg)
md:  0 4px 6px rgba(0,0,0,0.07)        — Standard cards, dropdowns
lg:  0 10px 15px rgba(0,0,0,0.10)      — Elevated cards, modals
xl:  0 20px 25px rgba(0,0,0,0.12)      — Hero CTAs, featured cards
glow-primary: 0 4px 14px rgba(79,70,229,0.30)  — Primary CTA glow
glow-indigo:  0 0 40px rgba(79,70,229,0.15)    — Ambient hero glow
```

### Icons

```
Library: lucide-react (v0.400+)
Default size: h-4 w-4 (16px) for inline, h-5 w-5 (20px) for standalone
Stroke width: 2 (default)
Color: inherit from parent text color

Feature icons (custom SVG or emoji):
  AI Chat:          MessageSquare, Sparkles
  Prompt Optimizer: Wand2, Zap
  Prompt Library:   Library, BookOpen
  PRD Generator:    FileText, ClipboardList
  Version History:  GitBranch, History
  Templates:        LayoutTemplate, Blocks
  Collaboration:    Users, UserPlus
  Workspace:        FolderKanban, Building2
  Projects:         FolderGit2, FolderOpen
  Exports:          Download, FileDown
  Analytics:        BarChart3, TrendingUp
```

### Gradients

```css
/* Hero background radial */
hero-glow: radial-gradient(
  circle at 50% 50%,
  rgba(79, 70, 229, 0.08) 0%,
  rgba(79, 70, 229, 0.03) 35%,
  transparent 70%
);

/* Hero secondary glow */
hero-glow-2: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.06) 0%, transparent 50%);

/* CTA section gradient */
cta-gradient: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);

/* Card border gradient (glass effect) */
glass-border: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);

/* Feature icon gradient */
icon-gradient: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);

/* Divider gradient */
divider-gradient: linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent);
```

### Buttons

```css
/* Primary — for main CTAs */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  background: #4F46E5;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(79,70,229,0.30);
  transition: background 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}
.btn-primary:hover {
  background: #4338CA;
  box-shadow: 0 6px 20px rgba(79,70,229,0.40);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(79,70,229,0.25);
}

/* Secondary — for auxiliary CTAs */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  background: #FFFFFF;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid #E2E8F0;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
}
.btn-secondary:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  transform: translateY(-1px);
}

/* Ghost — for tertiary actions */
.btn-ghost {
  padding: 6px 14px;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 150ms ease, color 150ms ease;
}
.btn-ghost:hover {
  background: #F1F5F9;
  color: #334155;
}

/* Nav CTA — compact primary for navigation */
.btn-nav-cta {
  padding: 8px 18px;
  border-radius: 10px;
  background: #4F46E5;
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  margin-left: 8px;
  transition: background 150ms ease;
}
.btn-nav-cta:hover {
  background: #4338CA;
}

/* Sizes */
.btn-sm:  h-8 px-3 text-xs  rounded-lg
.btn-md:  h-10 px-4 text-sm rounded-lg
.btn-lg:  h-12 px-6 text-base rounded-xl
.btn-xl:  h-14 px-8 text-lg rounded-xl
```

### Card Variants

```css
/* Standard card */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 28px;
  transition:
    box-shadow 150ms ease,
    transform 150ms ease,
    border-color 150ms ease;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}

/* Feature card */
.card-feature {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition:
    box-shadow 150ms ease,
    transform 150ms ease,
    border-color 150ms ease;
}
.card-feature:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: #e2e8f0;
}

/* Glass card */
.card-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 32px;
}
```

### Badges & Chips

```css
/* Status badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-primary:    bg-primary-50 text-primary-700
.badge-success:    bg-success-50 text-success-600
.badge-warning:    bg-warning-50 text-warning-600
.badge-accent:     bg-primary-50 text-primary-700 (with dot indicator)

/* Chip / Tag */
.chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
}
```

### Animations — Global Token Sheet

```typescript
duration: {
  instant: 0,
  fast:    150,   // hover, focus, micro-interactions
  normal:  250,   // show/hide, transitions
  slow:    400,   // page transitions, modals
  gentle:  600,   // onboarding, hero animations
  reveal:  800,   // scroll-triggered section reveals
}

easing: {
  default:     [0.4, 0, 0.2, 1],        // Material standard
  decelerate:  [0.0, 0, 0.2, 1],        // Entering screen
  accelerate:  [0.4, 0, 1, 1],           // Leaving screen
  sharp:       [0.2, 0, 0, 1],           // Quick entrances
  spring:       { type: 'spring', stiffness: 300, damping: 30 },
  springBounce: { type: 'spring', stiffness: 400, damping: 25 },
}

stagger: {
  card:    50,   // Card grid fade-in stagger (ms per card)
  list:    30,   // List item stagger
  feature: 75,   // Feature card stagger
  stat:   100,   // Stat counter stagger
}
```

### Dark Mode

```
Background hierarchy:
  Base:       #0F172A (neutral-900)
  Elevated:   #1E293B (neutral-800)
  Surface:    #334155 (neutral-700)
  Card:       #1E293B with border #334155

Text hierarchy:
  Primary:    #F8FAFC (neutral-50)
  Secondary:  #94A3B8 (neutral-400)
  Tertiary:   #64748B (neutral-500)
  Disabled:   #475569 (neutral-600)

Accent:
  Primary:    #818CF8 (primary-400)
  Primary bg: rgba(99, 102, 241, 0.15)

Shadows (inverted — lighter = higher):
  sm:   0 1px 2px rgba(0,0,0,0.3)
  md:   0 4px 6px rgba(0,0,0,0.4)
  lg:   0 10px 15px rgba(0,0,0,0.5)
```

### Grid System

```
Container max-widths:
  sm:    640px   — FAQ, narrow content
  md:    768px   — Testimonials, single column
  lg:    1024px  — Standard sections
  xl:    1200px  — Features grid, product showcase
  full:  100%    — Hero, CTA, Footer

Grid columns:
  Mobile (<768px):     1 column
  Tablet (768-1023px): 2 columns
  Desktop (≥1024px):   3 columns (features, pricing)
  Wide (≥1280px):      3-4 columns (feature showcase)

Gap scale:
  tight:  12px  — Small cards
  normal: 20px  — Standard cards
  wide:   24px  — Feature cards
  loose:  32px  — Major sections
```

### Breakpoints

```
sm:   640px   — Mobile landscape, small tablet portrait
md:   768px   — Tablet portrait
lg:   1024px  — Tablet landscape, small laptop
xl:   1280px  — Desktop
2xl:  1536px  — Large desktop
3xl:  1920px  — Ultra-wide
```

---

## 1. Information Architecture

### Section Order & Rationale

The landing page flows as a single continuous scroll experience with 14 sections. Each section exists to move the visitor through a carefully designed psychological progression: **attention → understanding → trust → desire → action**.

```
SECTION 1:  Announcement Banner
  Purpose:    Immediate social proof. "We're active, evolving, and trusted."
  Psychology: Authority + recency bias.
  Duration:   Dismissible. Not shown on return visits.

SECTION 2:  Navigation Bar
  Purpose:    Persistent orientation. Login for returning users, navigation for explorer types.
  Psychology: Familiarity + control.

SECTION 3:  Hero Section
  Purpose:    Explain PromptPilot in under 10 seconds. Capture attention. Drive primary CTA.
  Psychology: Pattern interrupt (radial glow) → Value proposition → Action.
  Critical:   This section makes or breaks conversion. Must pass the 5-second test.

SECTION 4:  Trusted By / Social Proof
  Purpose:    Establish credibility. "Companies like yours use PromptPilot."
  Psychology: Social proof + authority. Reduces perceived risk.
  Content:    Logos (real or "Used by 500+ engineering teams"), testimonial quote, G2 badge.

SECTION 5:  Problem Agitation
  Purpose:    Agitate the pain point before presenting the solution.
  Psychology: Problem-aware visitors need their pain validated before they trust the solution.
  Content:    "Building software specs is broken" — manual process pain points.

SECTION 6:  Value Proposition / How It Works
  Purpose:    Show how PromptPilot solves the problem in 3 clear steps.
  Psychology: Solution-aware visitors need to visualize themselves using it.
  Content:    3-step visual flow: Describe → Generate → Export.

SECTION 7:  Pipeline Showcase (Interactive Demo)
  Purpose:    Demonstrate the core product. Let visitors preview actual output.
  Psychology: Product-aware visitors need proof. Interactive = time on page = trust.
  Content:    9-step pipeline with clickable steps showing real generated content.

SECTION 8:  Feature Showcase
  Purpose:    Show breadth and depth. Address specific use cases for different personas.
  Psychology: Feature-aware visitors need to find their specific use case.
  Content:    9-12 feature cards in responsive grid.

SECTION 9:  Product Walkthrough (Visual Journey)
  Purpose:    Show the complete user experience from signup to export.
  Psychology: Visualization reduces fear of complexity.
  Content:    10-step interactive journey diagram with screenshots/previews.

SECTION 10: Comparison Table
  Purpose:    Position PromptPilot against alternatives (manual, ChatGPT, competitors).
  Psychology: Competitive visitors need differentiation proof.
  Content:    Feature matrix: Manual vs ChatGPT vs PromptPilot.

SECTION 11: Use Cases / Personas
  Purpose:    Help each persona see themselves in the product.
  Psychology: Personal relevance. "This is for me."
  Content:    Tabs/cards for each persona: Developer, PM, Founder, Enterprise.

SECTION 12: Testimonials
  Purpose:    Deep social proof. Real stories from real users.
  Psychology: Peer validation. Reduces final hesitation before pricing.
  Content:    3-5 detailed testimonial cards with photo, name, role, company, quote.

SECTION 13: Pricing Preview
  Purpose:    Transparent pricing. Low-friction path to start free.
  Psychology: Price anchoring. Free tier reduces barrier.
  Content:    3-tier pricing: Free / Pro / Team.

SECTION 14: FAQ
  Purpose:    Resolve remaining objections. Answer unasked questions.
  Psychology: Objection handling. Fills the gap between interest and action.
  Content:    6-8 accordion items covering common concerns.

SECTION 15: Final CTA
  Purpose:    The last conversion opportunity. Urgency + clarity.
  Psychology: Scarcity (time-limited?), certainty (no credit card), direct path.
  Content:    Bold headline + primary CTA + secondary link + trust bar.

SECTION 16: Footer
  Purpose:    Permanent navigation. Legal compliance. Brand reinforcement.
  Psychology: Completeness + professionalism.
  Content:    Logo, tagline, product links, resource links, company links, copyright.
```

### Scroll Behavior

```
Announcement Banner — dismisses upward, does not return
Navigation Bar       — sticky top (glass effect on scroll), always visible
Hero Section         — full viewport (min-h-screen). Parallax on the radial gradient.
All other sections   — standard vertical flow with scroll-triggered reveal animations

Back-to-top button   — appears after scrolling past hero. Bottom-right, pill-shaped,
                        indigo bg, ↑ icon. Fade in/out.
```

### Section Spacing Rhythm

```
Section padding: py-20 (80px top/bottom)
Alternating backgrounds:
  Hero:           bg-neutral-50 (or full-bleed gradient)
  Trusted By:     bg-white
  Problem:        bg-neutral-50
  How It Works:   bg-white
  Pipeline:       bg-neutral-50
  Features:       bg-white
  Walkthrough:    bg-neutral-50
  Comparison:     bg-white
  Use Cases:      bg-neutral-50
  Testimonials:   bg-white
  Pricing:        bg-neutral-50
  FAQ:            bg-white
  CTA:            bg-primary-900 (dark, full-bleed)
  Footer:         bg-neutral-900
```

---

## 2. Navigation Bar

### Layout & States

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  STATE: DEFAULT (top of page, transparent background)                        │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌──────────────┐                                      ┌────┐ ┌───────┐ │  │
│  │  │ PromptPilot   │  Features  HowItWorks  Pricing  Docs│Sign││Start  │ │  │
│  │  │ (logo)        │                                     │ In ││Free   │ │  │
│  │  └──────────────┘                                      └────┘ └───────┘ │  │
│  │                                                                         │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  STATE: SCROLLED (scrolled >20px down)                                        │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  bg-white/80 backdrop-blur-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] │  │
│  │                                                                         │  │
│  │  ┌──────────────┐ ⊙                    ┌─────┐ ┌─────┐  ┌────┐ ┌───────┐ │  │
│  │  │ PromptPilot   │ Features How  Pricing│ Docs │ │ Blog │  │Sign││Start  │ │  │
│  │  │ (logo)        │                     │      │ │     │  │ In ││Free   │ │  │
│  │  └──────────────┘                      └─────┘ └─────┘  └────┘ └───────┘ │  │
│  │                                                                         │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  STATE: MOBILE (menu closed)                                                  │
│                                                                               │
│  ┌──────────────────────────────────────────┐                                 │
│  │ ┌──────────────┐           ┌─────┐ ┌───┐ │                                 │
│  │ │ PromptPilot   │           │ ☰   │ │   │ │                                 │
│  │ └──────────────┘           └─────┘ └───┘ │                                 │
│  └──────────────────────────────────────────┘                                 │
│                                                                               │
│  STATE: MOBILE (menu open)                                                    │
│                                                                               │
│  ┌──────────────────────────────────────────┐                                 │
│  │ ┌──────────────┐           ┌─────┐ ┌───┐ │                                 │
│  │ │ PromptPilot   │           │ ✕   │ │   │ │                                 │
│  │ └──────────────┘           └─────┘ └───┘ │                                 │
│  │──────────────────────────────────────────│                                 │
│  │  Features                                │                                 │
│  │  How It Works                            │                                 │
│  │  Pricing                                 │                                 │
│  │  Docs                                    │                                 │
│  │  Blog                                    │                                 │
│  │  ─────────────────────────────────────── │                                 │
│  │  Sign In                                 │                                 │
│  │  ┌─────────────────────────────────────┐ │                                 │
│  │  │         Start Free                   │ │                                 │
│  │  └─────────────────────────────────────┘ │                                 │
│  └──────────────────────────────────────────┘                                 │
│                                                                               │
│  STATE: LOGGED IN (user menu replaces auth buttons)                           │
│                                                                               │
│  ┌──────────────┐                                  ┌───┐ ┌──┐ ┌────────────┐ │
│  │ PromptPilot   │ Features How  Pricing  Docs Blog│ ⊙  │ │🔔│ │ 👤 Jane ▾  │ │
│  │ (logo)        │                                │    │ │  │ │            │ │
│  └──────────────┘                                  └───┘ └──┘ └────────────┘ │
│                                                      ↑     ↑        ↑        │
│                                                  Theme  Notif   User dropdown │
│                                                  toggle  bell                │
│                                                                               │
│  USER DROPDOWN (click avatar/name):                                           │
│  ┌─────────────────────────────┐                                              │
│  │ 👤 Jane Smith               │                                              │
│  │    jane@acme.com            │                                              │
│  │ ─────────────────────────── │                                              │
│  │ 📊 Dashboard                │                                              │
│  │ 📁 My Workspaces            │                                              │
│  │ ⚙️  Settings                 │                                              │
│  │ 📖 Docs                     │                                              │
│  │ ─────────────────────────── │                                              │
│  │ 🚪 Sign Out                 │                                              │
│  └─────────────────────────────┘                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Navigation Component Specs

**Component:** `Nav`

| Prop            | Type                 | Description                                       |
| --------------- | -------------------- | ------------------------------------------------- |
| `variant`       | `'landing' \| 'app'` | Landing uses transparent→glass; App uses solid bg |
| `authenticated` | `boolean`            | Switches between auth buttons and user menu       |

**Navigation Links** (public):

```
Features      →  href="/#features"        (smooth scroll)
How It Works  →  href="/#how-it-works"    (smooth scroll)
Pricing       →  href="/#pricing"          (smooth scroll)
Docs          →  href="/docs"              (external or `/docs` route)
Blog          →  href="/blog"              (external, future)
Enterprise    →  href="/enterprise"        (future: enterprise landing page)
```

**Navigation Links** (logged in):

```
Dashboard     →  href="/dashboard"
My Workspaces →  href="/workspaces"
Settings      →  href="/settings"
Docs          →  href="/docs"
```

**Theme Toggle:**

```
Position:    Between notification bell and user avatar (or between Docs and Sign In on public nav)
Icon:        ☀️ (light mode) / 🌙 (dark mode)
Interaction: Click toggles. Framer Motion: icon rotates 180° with scale.
State:       Persisted to localStorage. Respects prefers-color-scheme on first visit.
```

**Search (future):**

```
Trigger:     ⌘K badge or search icon
Position:    Left of theme toggle (or integrated into a search icon)
Behavior:    Opens command palette overlay (`<CommandPalette>` component)
             Searches docs, navigates to sections
             On logged-in: searches projects, workspaces, documents
```

### Sticky Behavior

```
Scroll position 0:       bg-transparent, text-neutral-700
Scroll position >20px:   bg-white/80 + backdrop-blur-[12px] + shadow-sm
                         (dark mode: bg-neutral-900/80)
                         Transition: 200ms ease on background-color, box-shadow, backdrop-filter
Scroll position >hero:   Always visible. Never hides.
```

### Mobile Menu Behavior

```
Breakpoint:        <768px (hidden on desktop via CSS media query)
Open trigger:      Hamburger icon (☰) → animates to ✕ (rotate 90deg, 250ms spring)
Close trigger:     ✕ button, tapping outside menu, pressing Escape, clicking a link
Menu panel:        Full-width below nav. bg-white, shadow-lg, border-b.
Animation:         Slide down + fade in (250ms, [0.4, 0, 0.2, 1])
Items:             Stacked vertically. Links: 12px padding top/bottom, 24px horizontal.
CTA button:        Full-width with 16px horizontal margin. Primary bg.
Backdrop:          No backdrop (menu is inline below nav, not overlay)
Body scroll:       Not locked (menu is part of page flow, not overlay)
```

### Accessibility (Nav)

```
<nav> element with aria-label="Main navigation"
Logo link: aria-label="PromptPilot — Home"
Mobile toggle: aria-expanded="true/false", aria-label="Toggle navigation"
Current section: aria-current="page" on active link (future: scroll spy)
Focus ring: visible on all items. Focus trap NOT needed (standard navigation).
Tab order: Logo → Features → How It Works → Pricing → Docs → Blog → Theme → Auth/User
Dark mode toggle: aria-label="Toggle dark mode" or "Toggle light mode"
```

---

## 3. Hero Section

### Layout — Full Viewport

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  HERO SECTION (min-height: 100vh, display: flex, align-items: center)        │
│  background: #FAFBFC / neutral-50                                            │
│                                                                               │
│  [RADIAL GRADIENT 1 — center, 900px diameter]                                │
│    radial-gradient(circle at 50% 50%, rgba(79,70,229,0.08) 0%,              │
│    rgba(79,70,229,0.02) 40%, transparent 70%)                                │
│                                                                               │
│  [RADIAL GRADIENT 2 — top-right, 600px diameter, subtle]                     │
│    radial-gradient(circle at 80% 20%, rgba(99,102,241,0.06) 0%,             │
│    transparent 50%)                                                          │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │                        ┌──────────────────────┐                         │  │
│  │                        │  ● Now powered by     │                         │  │
│  │                        │  GPT-4o and Claude    │                         │  │
│  │                        │  3.5 Sonnet           │                         │  │
│  │                        └──────────────────────┘                         │  │
│  │                        (badge: bg-indigo-50 text-indigo-700)            │  │
│  │                                                                         │  │
│  │              Your Idea → Complete Engineering Specification              │  │
│  │         (h1: 4.5rem, bold, -0.03em tracking, neutral-900)              │  │
│  │                                                                         │  │
│  │    PromptPilot transforms a simple product description into a complete  │  │
│  │    suite of software engineering documents — PRD, SRS, architecture,    │  │
│  │   database schema, API spec, and roadmap — consistent, in minutes.     │  │
│  │      (p: 1.25rem, neutral-600, max-width: 640px, line-height: 1.7)     │  │
│  │                                                                         │  │
│  │         ┌──────────────────┐    ┌────────────────────┐                  │  │
│  │         │   Start Free →   │    │  See how it works ↓ │                  │  │
│  │         │  (primary, glow) │    │  (secondary)        │                  │  │
│  │         └──────────────────┘    └────────────────────┘                  │  │
│  │                                                                         │  │
│  │              Free to start · No credit card · Cancel anytime             │  │
│  │                    (text-xs, neutral-400)                               │  │
│  │                                                                         │  │
│  │       ┌─────────────────────── STATS BAR ─────────────────────────┐     │  │
│  │       │   500+        10,000+        9        99.9%               │     │  │
│  │       │   teams       documents      pipeline   uptime             │     │  │
│  │       │   using       generated      steps     SLA                 │     │  │
│  │       └──────────────────────────────────────────────────────────┘     │  │
│  │                                                                         │  │
│  │  [ANIMATED PROMPT DEMO — floating terminal/editor window]               │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │  │  $ promptpilot generate                                          │   │  │
│  │  │  ▸ Describe your product: "A mobile banking app for Gen Z..."    │   │  │
│  │  │  ▸ Generating Master Context... ✓                                │   │  │
│  │  │  ▸ Generating PRD... ⟳                                           │   │  │
│  │  │  ▸ 1,247 tokens · $0.03                                         │   │  │
│  │  └─────────────────────────────────────────────────────────────────┘   │  │
│  │  (floating, subtle bounce animation, glass effect, code font)          │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Hero Text Content

```
ANNOUNCEMENT BADGE:
  "● Now powered by GPT-4o and Claude 3.5 Sonnet"
  (The ● is a small green dot that pulses every 2s)

HEADLINE:
  "Your Idea → Complete Engineering Specification"
  Alternative (A/B test candidate):
  "From Napkin Sketch to Production Spec in Minutes"

SUBHEADLINE:
  "PromptPilot transforms a simple product description into a complete suite
   of software engineering documents — PRD, SRS, architecture, database schema,
   API spec, and roadmap — all consistent, all generated in minutes."

PRIMARY CTA:
  "Start Free →"
  Takes user to /register

SECONDARY CTA:
  "See how it works ↓"
  Smooth scrolls to How It Works section (#how-it-works)

TRUST BAR:
  "Free to start · No credit card · Cancel anytime"

STATS BAR:
  500+      teams using PromptPilot
  10,000+   documents generated
  9         pipeline steps
  99.9%     uptime SLA
```

### Animated Prompt Demo

```
CONCEPT:
  A floating terminal/editor window that simulates a PromptPilot run.
  Not a real video — it's an animated component that cycles through steps.

VISUAL:
  - Dark background (#1E293B / neutral-800)
  - Monospace font (JetBrains Mono)
  - Green prompt marker "$"
  - Subtle glass border (rgba(255,255,255,0.1))
  - Position: Absolute, below the text. Offset slightly right.
  - Floating animation: subtle translateY oscillation (4px up/down, 4s cycle)

BEHAVIOR:
  1. Window appears with initial prompt (fade in, 800ms delay after hero load)
  2. Types out user input (typewriter effect, 50ms per char)
  3. "Enter" key flash
  4. Steps appear one by one with checkmarks (500ms stagger)
  5. Token counter counts up
  6. Cycles back to step 1 after 3s pause

MOBILE: Hidden on mobile (<768px). Replaced by static illustration.
TABLET: Smaller scale (0.8), positioned below text.
```

### Hero Stats Bar

```
LAYOUT:
  Horizontal row of 4 stat items with subtle vertical dividers.
  Background: transparent (inherits hero bg)
  Stats animate in (count-up animation) when scrolled into view.

EACH STAT ITEM:
  ┌──────────────┐
  │    500+      │  ← Number: text-3xl, bold, primary-600
  │  teams using │  ← Label: text-xs, neutral-500, uppercase tracking
  └──────────────┘

DIVIDERS:
  width: 1px, height: 40px, background: neutral-200
  Hidden on mobile (stats stack vertically)

ANIMATION:
  Counter animates from 0 to target number.
  Duration: 1500ms. Easing: ease-out.
  Triggered by IntersectionObserver when stats bar enters viewport.
  Only animates once (not on re-scroll).
```

### Hero Micro-Interactions

```
1. Badge dot pulse:       scale(1) → scale(1.3) → scale(1), 2s infinite
2. CTA hover glow:        box-shadow intensifies. Subtle translateY(-2px).
3. CTA click:             scale(0.97) on mousedown, spring back
4. Gradient parallax:     On mouse move (desktop only), radial gradients shift
                           by 2-3% in direction of cursor (subtle, not distracting)
5. Terminal cursor blink: alternating opacity 1 → 0, 1s cycle, steps(2)
6. Terminal content:      typewriter effect, checkmarks fade in staggered
7. Stats count-up:        Numbers animate on scroll into view
8. Section background:    Gradient subtly shifts hue on scroll (parallax opacity)
```

### Hero Mobile Adaptation

```
<640px:
  - min-height: 90vh (not 100vh — accounts for mobile chrome)
  - Heading: clamp(2rem, 8vw, 3rem), still bold, still -0.03em
  - Subheadline: 1rem (not 1.25rem)
  - CTAs: Stacked vertically, full-width. Primary first, secondary below.
  - Trust bar: below CTAs
  - Stats bar: 2x2 grid instead of row. Dividers hidden.
  - Terminal demo: Hidden. Replaced with static product screenshot or simple gradient.
  - Radial gradients: Reduced opacity (0.04 instead of 0.08)
  - Padding: 96px top (accounts for nav), 48px bottom
```

### AI Typing Animation (Terminal Demo)

```typescript
// Conceptual behavior
const demoSteps = [
  { prompt: '$ promptpilot generate', delay: 500 },
  { prompt: '▸ Describe your product:', delay: 800 },
  { text: ' "A mobile banking app for Gen Z users with AI-powered savings..."', delay: 1200 },
  { status: '▸ Generating Master Context... ✓ ', delay: 600 },
  { status: '▸ Generating PRD... ⟳', delay: 800 },
  { status: '▸ 1,247 tokens · $0.03', delay: 400 },
  // pause 3s, then loop
]

// Each line types out character by character (30ms per char for prompts, 20ms for text)
// Checkmark appears with spring animation (scale 0 → 1.2 → 1)
// Spinner (⟳) rotates continuously
// Token counter pulses on update
```

---

## 4. Feature Showcase

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  FEATURE SHOWCASE                                                             │
│  py-20, bg-white                                                              │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                     Everything You Need to Ship                          │  │
│  │        (h2, 4xl, bold, -0.02em, neutral-900, text-center)              │  │
│  │                                                                         │  │
│  │      One platform. Every engineering artifact. AI-powered.              │  │
│  │            (p, lg, neutral-500, text-center, max-w-2xl)                 │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  GRID (3 columns desktop, 2 tablet, 1 mobile)                                 │
│  gap-8                                                                        │
│                                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │
│  │                  │ │                  │ │                  │             │
│  │  ┌────────────┐  │ │  ┌────────────┐  │ │  ┌────────────┐  │             │
│  │  │  Icon      │  │ │  │  Icon      │  │ │  │  Icon      │  │             │
│  │  │  (48px)    │  │ │  │  (48px)    │  │ │  │  (48px)    │  │             │
│  │  └────────────┘  │ │  └────────────┘  │ │  └────────────┘  │             │
│  │                  │ │                  │ │                  │             │
│  │  AI Chat         │ │  Prompt          │ │  Prompt          │             │
│  │                  │ │  Optimizer       │ │  Library          │             │
│  │  Conversational  │ │  Refine prompts  │ │  Save, organize, │             │
│  │  AI for          │ │  automatically   │ │  and reuse your  │             │
│  │  brainstorming   │ │  with AI that    │ │  best prompts    │             │
│  │  and iteration.  │ │  understands     │ │  across projects.│             │
│  │                  │ │  context.        │ │                  │             │
│  │  • Natural convos│ │  • Auto-improve  │ │  • Collections   │             │
│  │  • Context-aware │ │  • Tone control  │ │  • Tags & search │             │
│  │  • Multi-turn    │ │  • A/B testing   │ │  • Versioning    │             │
│  │                  │ │                  │ │                  │             │
│  │  [Try AI Chat →] │ │  [See it work →] │ │  [Browse →]     │             │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘             │
│                                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │
│  │  PRD Generator   │ │  Version History │ │  Templates       │             │
│  │  ─────────────── │ │  ─────────────── │ │  ─────────────── │             │
│  │  Generate complete│ │  Track every     │ │  Start fast with │             │
│  │  Product Require- │ │  change. Restore │ │  pre-built       │             │
│  │  ments Documents  │ │  any version.    │ │  templates for   │             │
│  │  in minutes.      │ │  Never lose work.│ │  common use cases│             │
│  │                   │ │                  │ │                  │             │
│  │  • Structured form│ │  • Diff view     │ │  • 50+ templates │             │
│  │  • AI form-fill   │ │  • Named versions│ │  • Customizable  │             │
│  │  • Export ready   │ │  • Restore 1-clk │ │  • Community     │             │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘             │
│                                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │
│  │  Collaboration   │ │  Workspace       │ │  Export          │             │
│  │  ─────────────── │ │  ─────────────── │ │  ─────────────── │             │
│  │  Work together    │ │  Organize every- │ │  Download specs  │             │
│  │  with your team.  │ │  thing in work-  │ │  in PDF, MD,     │             │
│  │  Comment, review, │ │  spaces. Invite   │ │  HTML, or DOCX.  │             │
│  │  approve.         │ │  your team.       │ │  Share anywhere. │             │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘             │
│                                                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐             │
│  │  Projects        │ │  Exports         │ │  Analytics        │             │
│  │  ─────────────── │ │  ─────────────── │ │  ─────────────── │             │
│  │  Manage multiple │ │  Export single    │ │  Track usage,    │             │
│  │  projects per     │ │  docs or full     │ │  token spend,    │             │
│  │  workspace.       │ │  project suites.  │ │  team activity.  │             │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Individual Feature Card Specs

Each card follows this structure:

```typescript
interface FeatureCard {
  icon: string // Lucide icon name or custom SVG path
  iconBg: string // Background color for icon container
  title: string // Feature name (1-3 words)
  description: string // 1-2 sentences explaining the feature
  benefits: string[] // 3 bullet points (key capabilities)
  cta: {
    label: string // "Try it →", "Learn more →", "See demo →"
    href: string // Link target
  }
  animation: string // Hover animation variant
}

// Card variants:
// - default:   bg-neutral-50, border-neutral-100
// - elevated:  bg-white, shadow-sm
// - glass:     bg-white/70, backdrop-blur
```

**Feature 1: AI Chat**

```
Icon:           MessageSquare (Lucide), in a 48x48 rounded-xl bg-indigo-50
Icon Color:     primary-600
Title:          AI Chat
Description:    "Conversational AI for brainstorming, refining, and iterating on your specifications. Context-aware, multi-turn, always available."
Benefits:       "• Natural conversations  • Full project context  • Multi-turn memory"
CTA:            "Try AI Chat →" (href="/register")
Animation:      On hover: icon container scale 1.05, card lifts 4px, shadow md
```

**Feature 2: Prompt Optimizer**

```
Icon:           Wand2 (Lucide), in a 48x48 rounded-xl bg-emerald-50
Icon Color:     emerald-600
Title:          Prompt Optimizer
Description:    "AI that improves your prompts automatically. Enhance clarity, adjust tone, add detail, or optimize for specific models."
Benefits:       "• Auto-improve prompts  • Tone & style control  • A/B prompt testing"
CTA:            "See it work →" (smooth scroll to pipeline showcase)
```

**Feature 3: Prompt Library**

```
Icon:           Library (Lucide), in a 48x48 rounded-xl bg-amber-50
Icon Color:     amber-600
Title:          Prompt Library
Description:    "Save, organize, tag, and version your best prompts. Build collections for different projects, models, or use cases."
Benefits:       "• Collections & folders  • Tags & full-text search  • Auto-versioning"
CTA:            "Browse library →" (href="/register")
```

**Feature 4: PRD Generator**

```
Icon:           FileText (Lucide), in a 48x48 rounded-xl bg-sky-50
Icon Color:     sky-600
Title:          PRD Generator
Description:    "Generate complete Product Requirements Documents from a simple description. Structured form → professional PRD in minutes."
Benefits:       "• Structured input form  • AI form auto-fill  • Export-ready format"
CTA:            "Generate a PRD →" (href="/register")
```

**Feature 5: Version History**

```
Icon:           GitBranch (Lucide), in a 48x48 rounded-xl bg-violet-50
Icon Color:     violet-600
Title:          Version History
Description:    "Every edit, every generation, every refinement — tracked. Compare versions side-by-side. Restore any previous state."
Benefits:       "• Side-by-side diffs  • Named version tags  • One-click restore"
CTA:            "Learn more →" (smooth scroll)
```

**Feature 6: Templates**

```
Icon:           LayoutTemplate (Lucide), in a 48x48 rounded-xl bg-rose-50
Icon Color:     rose-600
Title:          Templates
Description:    "Start fast with 50+ pre-built templates for PRDs, SRS, architecture docs, API specs, user stories, and more."
Benefits:       "• 50+ ready templates  • Fully customizable  • Community library"
CTA:            "Explore templates →" (href="/register")
```

**Feature 7: Collaboration**

```
Icon:           Users (Lucide), in a 48x48 rounded-xl bg-teal-50
Icon Color:     teal-600
Title:          Collaboration
Description:    "Invite your team. Comment on documents. Request reviews. Approve changes. Everything stays in sync."
Benefits:       "• Real-time presence  • Comments & threads  • Review workflow"
CTA:            "See collaboration →" (href="/register")
```

**Feature 8: Workspace**

```
Icon:           FolderKanban (Lucide), in a 48x48 rounded-xl bg-orange-50
Icon Color:     orange-600
Title:          Workspaces
Description:    "Organize everything in workspaces. Personal or team. Each workspace contains projects, documents, and members."
Benefits:       "• Personal & Team modes  • Role-based access  • Cross-project search"
CTA:            "Set up workspace →" (href="/register")
```

**Feature 9: Projects**

```
Icon:           FolderGit2 (Lucide), in a 48x48 rounded-xl bg-cyan-50
Icon Color:     cyan-600
Title:          Projects
Description:    "Each project runs the full 9-step pipeline. Track progress, manage documents, and see everything at a glance."
Benefits:       "• Pipeline progress bar  • Document statuses  • One-click full run"
CTA:            "Start a project →" (href="/register")
```

**Feature 10: Exports**

```
Icon:           Download (Lucide), in a 48x48 rounded-xl bg-blue-50
Icon Color:     blue-600
Title:          Exports
Description:    "Export individual documents or complete project suites. PDF, Markdown, HTML, DOCX. Share with anyone."
Benefits:       "• 4 export formats  • Single doc or full suite  • Shareable links"
CTA:            "Try export →" (href="/register")
```

**Feature 11: Analytics**

```
Icon:           BarChart3 (Lucide), in a 48x48 rounded-xl bg-fuchsia-50
Icon Color:     fuchsia-600
Title:          Analytics
Description:    "Track your usage. Token spend, generation velocity, team activity, project completion rates. Data-driven decisions."
Benefits:       "• Token & cost tracking  • Team activity dashboard  • Project velocity"
CTA:            "View analytics →" (href="/register")
```

### Feature Grid Responsive Behavior

```
Desktop (≥1280px): 3 columns × 4 rows (12 cards, last row has 2 cards centered or add "View All" card)
Desktop (1024-1279px): 3 columns
Tablet (768-1023px): 2 columns
Mobile (<768px): 1 column, cards stacked
```

### Feature Card Hover States

```
Default:
  bg-neutral-50, border-neutral-100, shadow-none, scale(1)

Hover:
  150ms transition
  bg-white (if was neutral-50), border-neutral-200, shadow-md, scale(1.01)
  Icon container: bg color intensifies, scale(1.05)
  CTA link: text-primary-700 (from primary-600), underline appears

Active (click):
  scale(0.99)
```

---

## 5. Product Walkthrough

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PRODUCT WALKTHROUGH                                                          │
│  py-20, bg-neutral-50                                                         │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │              See the Complete Workflow                                  │  │
│  │   (h2, 4xl, bold, -0.02em, neutral-900, text-center)                   │  │
│  │                                                                         │  │
│  │   From signup to exported specification — everything works together.    │  │
│  │             (p, lg, neutral-500, text-center, max-w-2xl)                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  INTERACTIVE JOURNEY MAP                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │     ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐          │  │
│  │     │  1   │ →  │  2   │ →  │  3   │ →  │  4   │ →  │  5   │          │  │
│  │     │Landin│    │ Sign │    │ Dash │    │ Work │    │ Proj │          │  │
│  │     │ Page │    │  Up  │    │board │    │space │    │ ect  │          │  │
│  │     └──────┘    └──────┘    └──────┘    └──────┘    └──────┘          │  │
│  │                                                                         │  │
│  │     ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐          │  │
│  │     │  6   │ →  │  7   │ →  │  8   │ →  │  9   │ →  │  10  │          │  │
│  │     │  AI  │    │ PRD  │    │      │    │ Vers │    │Export│          │  │
│  │     │ Chat │    │ Gen  │    │Editor│    │ Hist │    │      │          │  │
│  │     └──────┘    └──────┘    └──────┘    └──────┘    └──────┘          │  │
│  │                                                                         │  │
│  │  DETAIL PANEL (appears below when a step is selected)                   │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │  │  ┌──────────────────────────┐  ┌──────────────────────────────┐ │   │  │
│  │  │  │                          │  │                              │ │   │  │
│  │  │  │  Step 4: Workspace       │  │  [screenshot or illustration] │ │   │  │
│  │  │  │                          │  │                              │ │   │  │
│  │  │  │  Organize your projects  │  │  (shows the workspace UI     │ │   │  │
│  │  │  │  in workspaces. Invite   │  │   with projects, members,    │ │   │  │
│  │  │  │  your team. Set up       │  │   and settings tabs)         │ │   │  │
│  │  │  │  personal or team        │  │                              │ │   │  │
│  │  │  │  workspaces.             │  │                              │ │   │  │
│  │  │  │                          │  │                              │ │   │  │
│  │  │  │  What you can do:        │  │                              │ │   │  │
│  │  │  │  • Create team workspace │  │                              │ │   │  │
│  │  │  │  • Invite members        │  │                              │ │   │  │
│  │  │  │  • Set permissions       │  │                              │ │   │  │
│  │  │  │  • Manage projects       │  │                              │ │   │  │
│  │  │  │                          │  │                              │ │   │  │
│  │  │  │  [Try it →]              │  │                              │ │   │  │
│  │  │  └──────────────────────────┘  └──────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Journey Steps — Detail Content

Each step has this data structure:

```typescript
interface JourneyStep {
  id: number
  label: string // Short label (1-2 words)
  title: string // Full title
  description: string // 1-2 sentence explanation
  capabilities: string[] // 3 bullet points
  screenshot: string // Image path or component reference
  icon: string // Lucide icon name
}
```

**Step 1: Landing Page**

```
Title:       "Discover PromptPilot"
Description: "Learn how PromptPilot transforms product ideas into complete engineering specifications in minutes."
Capabilities: "• Understand the value prop  • See the pipeline demo  • Compare against alternatives"
Screenshot:   Hero section or full landing page thumbnail
Icon:         Globe
```

**Step 2: Sign Up**

```
Title:       "Create Your Account"
Description: "Sign up in seconds. No credit card required. Start with a free personal workspace."
Capabilities: "• Email + password signup  • Auto-created workspace  • Onboarding wizard"
Screenshot:   Registration form or dashboard onboarding
Icon:         UserPlus
```

**Step 3: Dashboard**

```
Title:       "Your Command Center"
Description: "The dashboard gives you an at-a-glance overview of all your work, quick actions, and recent activity."
Capabilities: "• Quick action shortcuts  • Workspace summary stats  • AI activity feed"
Screenshot:   Dashboard screenshot (or mockup)
Icon:         LayoutDashboard
```

**Step 4: Workspace**

```
Title:       "Organize in Workspaces"
Description: "Workspaces contain your projects and team. Personal for solo work, Team for collaboration."
Capabilities: "• Personal & team modes  • Invite members by email  • Set roles & permissions"
Screenshot:   Workspace detail view mockup
Icon:         Building2
```

**Step 5: Project**

```
Title:       "Run the 9-Step Pipeline"
Description: "Each project runs the complete specification pipeline. Watch as AI generates all 9 engineering documents."
Capabilities: "• Pipeline progress tracking  • One-click full run  • Per-document statuses"
Screenshot:   Project page mockup with pipeline progress
Icon:         FolderGit2
```

**Step 6: AI Chat**

```
Title:       "Chat with Your Project AI"
Description: "Discuss your project with AI. Brainstorm alternatives, ask questions, get suggestions — all with full project context."
Capabilities: "• Multi-turn conversations  • Full project context  • Apply AI to documents"
Screenshot:   AI Chat interface mockup
Icon:         MessageSquare
```

**Step 7: PRD Generator**

```
Title:       "Generate Professional PRDs"
Description: "Fill a structured form or let AI expand your rough notes into a comprehensive Product Requirements Document."
Capabilities: "• Structured input form  • AI form auto-expansion  • Template-based generation"
Screenshot:   PRD Generator mockup
Icon:         FileText
```

**Step 8: Editor**

```
Title:       "Refine Every Document"
Description: "View, edit, and enhance generated documents. Use AI to improve specific sections. Full Markdown support."
Capabilities: "• Split view editor  • AI text improvement  • Real-time preview"
Screenshot:   Editor mockup
Icon:         Edit3
```

**Step 9: Version History**

```
Title:       "Track Every Change"
Description: "Every generation and edit creates a version. Compare, diff, and restore any previous state."
Capabilities: "• Side-by-side diffs  • AI change summaries  • One-click restore"
Screenshot:   Version History mockup
Icon:         GitBranch
```

**Step 10: Export**

```
Title:       "Download & Share"
Description: "Export individual documents or the full project suite as PDF, Markdown, HTML, or DOCX."
Capabilities: "• 4 export formats  • Full suite or selection  • Shareable download links"
Screenshot:   Export page mockup
Icon:         Download
```

### Interactive Behavior

```
Desktop:
  - Steps displayed as two rows of 5 connected nodes
  - Nodes connected by arrows (→) or lines
  - Active step: highlighted with primary border + bg-indigo-50
  - Clicking a node: detail panel slides in below (height animation, 300ms)
  - Detail panel: left side text, right side screenshot
  - Only one step active at a time. Clicking another switches the panel.
  - Auto-advance option: carousel mode every 5s (pause on hover)

Tablet:
  - Steps as horizontal scrollable carousel (overflow-x: auto with snap points)
  - Detail panel below carousel
  - Arrow indicators for previous/next

Mobile:
  - Steps as horizontal scrollable row (compact: icon + number only)
  - Active step expands to show label
  - Detail panel as full-width card below
  - Swipe left/right to navigate between steps
```

---

## 6. Visual Design System — Extended

This section extends the token sheet at the top of the document with landing-page-specific visual decisions.

### Typography Details

```
Hero Headline:
  Tag:        h1
  Font:       Inter, bold (700)
  Size:       clamp(2.5rem, 6vw, 4.5rem)
  Line-height: 1.1
  Letter-spacing: -0.03em
  Color:      neutral-900 (light) / neutral-50 (dark)

Section Headings:
  Tag:        h2
  Font:       Inter, bold (700)
  Size:       clamp(1.75rem, 4vw, 2.5rem)
  Line-height: 1.2
  Letter-spacing: -0.02em
  Color:      neutral-900 / neutral-50

Section Subtitles:
  Tag:        p
  Font:       Inter, regular (400)
  Size:       1.125rem (lg)
  Line-height: 1.7
  Color:      neutral-500 (light) / neutral-400 (dark)

Body Text:
  Tag:        p
  Font:       Inter, regular (400)
  Size:       1rem (base)
  Line-height: 1.6
  Color:      neutral-700 / neutral-300

Card Titles:
  Tag:        h3
  Font:       Inter, semibold (600)
  Size:       1.125rem (lg) / 1rem for feature cards
  Color:      neutral-900 / neutral-50

Card Descriptions:
  Tag:        p
  Font:       Inter, regular (400)
  Size:       0.875rem (sm)
  Line-height: 1.6
  Color:      neutral-500 / neutral-400
```

### Button System — Visual Variants

```
┌──────────────────────────────────────────────────────────────┐
│  BUTTON VARIANTS                                             │
│                                                               │
│  PRIMARY:                                                    │
│  ┌─────────────────┐                                         │
│  │  Start Free →    │  bg-primary-600, text-white            │
│  └─────────────────┘  shadow-primary/30 glow                 │
│                       Hover: bg-primary-700, stronger glow   │
│                                                               │
│  SECONDARY:                                                  │
│  ┌─────────────────┐                                         │
│  │  See how it works│  bg-white, text-neutral-700            │
│  └─────────────────┘  border-neutral-200                     │
│                       Hover: bg-neutral-50, border-neutral-300│
│                                                               │
│  GHOST:                                                      │
│  ┌───────────┐                                                │
│  │  Sign In   │  bg-transparent, text-neutral-600            │
│  └───────────┘  Hover: bg-neutral-100                       │
│                                                               │
│  DARK (for dark backgrounds):                                 │
│  ┌─────────────────┐                                         │
│  │  Get Started →   │  bg-white, text-primary-700            │
│  └─────────────────┘  Hover: bg-neutral-100                 │
│                                                               │
│  SIZE SCALE:                                                  │
│  sm:  h-8  px-3  text-xs   (badges, small actions)           │
│  md:  h-10 px-4  text-sm   (nav links, card CTAs)            │
│  lg:  h-12 px-6  text-base (standard CTAs)                   │
│  xl:  h-14 px-8  text-lg   (hero CTAs)                       │
└──────────────────────────────────────────────────────────────┘
```

### Input System

```css
.input {
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #334155;
  background: #ffffff;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}
.input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
.input::placeholder {
  color: #9ca3af;
}
.input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Used in: Email capture CTA (future), search (future) */
```

### Section Dividers

```
Standard:    height: 1px, background: divider-gradient (see gradients)
Alternative: No divider — alternating bg colors create natural separation
Usage:       Between sections where both have white background
```

### Illustration Style

```
Style:      Minimalist line illustrations with indigo accent
Format:     SVG (inline or as components)
Line weight: 1.5px
Colors:     neutral-700 for lines, primary-600 for accents
Rounded:    stroke-linecap="round", stroke-linejoin="round"

Hero illustration: Floating UI elements (terminal, cards, pipeline nodes)
Feature icons:     Rounded square container (48x48, rounded-xl) with icon
Screenshots:       Actual product screenshots with subtle shadow and border
Empty states:      Simple geometric illustrations (line art style)
```

---

## 7. Responsive Design — Detailed

### Desktop (≥1280px)

```
Container:    max-w-[1200px], mx-auto, px-8
Grid:         3 columns for features, 3 for pricing
Nav:          Full horizontal with all links
Font scale:   Full (hero at 4.5rem)
Images:       Full size
Spacing:      py-20 (80px) section padding
```

### Desktop Small (1024-1279px)

```
Container:    max-w-[1024px], mx-auto, px-6
Grid:         3 columns for features (smaller cards), 3 for pricing
Nav:          Full horizontal, slightly reduced padding
Font scale:   Hero at clamp(2.5rem, 5vw, 4rem)
```

### Tablet (768-1023px)

```
Container:    max-w-full, px-6
Grid:         2 columns for features and pricing
Nav:          Collapsible sidebar icons only (if needed) or simplified horizontal
Font scale:   Hero at clamp(2rem, 5vw, 3.5rem)
Pipeline:     Horizontal scroll for step buttons
Stats:        2x2 grid
CTAs:         Side by side (not stacked)
```

### Mobile (<768px)

```
Container:    max-w-full, px-4
Grid:         1 column for everything
Nav:          Hamburger menu with slide-down panel
Font scale:   Hero at clamp(1.75rem, 8vw, 2.5rem)
Pipeline:     Horizontal scroll for step buttons (with snap)
Stats:        2x2 grid (compact)
CTAs:         Stacked vertically, full-width
Section pad:  py-12 (48px) instead of py-20
Cards:        Full-width with 20px horizontal padding
FAQ:          Full-width items
```

### Large Desktop (1536px+)

```
Container:    max-w-[1400px], mx-auto, px-12
Grid:         4 columns for features
Font scale:   Hero at max 5rem
Spacing:      py-24 (96px) section padding
```

### Ultra-Wide (1920px+)

```
Container:    max-w-[1600px], mx-auto
Grid:         Features at 4 columns
Background:   Wider radial gradients, larger negative space
Max text:     Content text max-w-[720px] for readability
```

### Touch Gestures (Mobile)

```
Swipe left/right:  Navigate pipeline showcase steps
Swipe down:        Close mobile menu
Tap:               Expand FAQ, select pipeline step
Long press:        (future) Context menu on feature cards
Pull to refresh:   Not applicable (static page)
```

---

## 8. Accessibility

### WCAG 2.2 AA Compliance

```
COLOR CONTRAST:
  All body text:       ≥ 4.5:1 against background
  Large text (≥18px):  ≥ 3:1 against background
  Hero headline:       neutral-900 (#0F172A) on #FAFBFC = 15.4:1 ✅
  Body text:           neutral-700 (#334155) on #FFFFFF = 9.5:1 ✅
  Subtle text:         neutral-500 (#64748B) on #F8FAFC = 5.2:1 ✅
  Primary CTA text:    white (#FFFFFF) on primary-600 (#4F46E5) = 6.2:1 ✅
  Feature card text:   neutral-500 (#64748B) on neutral-50 (#F8FAFC) = 5.2:1 ✅
  All badge text:      Primary-700 on Primary-50 = 7.3:1 ✅
  Link text:           Primary-600 on white = 5.3:1 ✅

KEYBOARD NAVIGATION:
  Tab order:           Logical DOM order (banner → nav → hero → sections → footer)
  Skip link:           "Skip to main content" — visually hidden, first focusable element
  Focus visible:       outline-2 outline-primary-500 outline-offset-2 on all interactive elements
  No focus trap:       No modals on landing page (mobile menu does not trap focus)
  FAQ accordion:       Enter/Space to toggle, arrow keys between items
  Feature cards:       Tab between cards (not needed — cards are decorative, CTAs inside are tabbable)
  Mobile menu:         Focus moves to first menu item on open. Escape closes menu.
  Smooth scroll:       `scroll-behavior: smooth` respects prefers-reduced-motion

ARIA:
  Nav:                 <nav aria-label="Main navigation">
  Mobile menu toggle:  aria-expanded="true/false", aria-controls="mobile-menu"
  Mobile menu panel:   id="mobile-menu", role="navigation", aria-label="Mobile navigation"
  FAQ:                 aria-expanded on each question button, aria-controls linking to answer
  Pipeline showcase:   role="tablist" on the steps, role="tab" on each step, aria-selected, role="tabpanel"
  Feature cards:       role="article" optional, not required
  Pricing section:     role="region" with aria-label="Pricing plans"
  Testimonials:        <blockquote> with <cite> for attribution
  Stats:               Not live (no dynamic updates on landing). Just <p> elements.
  Images:              alt text on all images. Decorative images: alt="" (empty).
  Icons:               aria-hidden="true" on Lucide icons (decorative). aria-label on icon-only buttons.

SCREEN READERS:
  Page title:          <h1> for hero headline (announced first)
  Section structure:   Proper heading hierarchy: h1 (hero), h2 (section titles), h3 (card titles)
  Links:               Descriptive link text — no "click here". "Start Free" is clear.
  CTA buttons:         Links styled as buttons — announced as "link" by default. Fine for landing.
  Animations:          Respects prefers-reduced-motion. No auto-playing content.
  Form inputs:         Future email capture: proper <label> associations.

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce) disables:
    - Scroll-triggered fade-in animations (elements appear immediately)
    - Parallax effects
    - Floating animation on terminal demo
    - Pulse animations on badges
    - Count-up animation on stats (show final value)
    - Hover transforms (show hover color change only)
    - Smooth scroll behavior (instant scroll)
    - Skeleton animations (show static placeholder)
```

### Focus Ring System

```css
/* Global focus visible */
*:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom focus ring for buttons (overrides default) */
.btn:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
}

/* Focus ring for inputs */
.input:focus-visible {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}
```

---

## 9. Performance

### Architecture

```
RENDERING STRATEGY:
  Next.js 15 App Router
  Landing page route: app/page.tsx (server component by default)
  Interactive components: 'use client' where needed (Nav, FAQ, PipelineShowcase, CommandPalette)
  Static generation: ISR with revalidation every 60 seconds
  CDN: Vercel Edge Network (or equivalent)

BUNDLE STRATEGY:
  Navigation + Hero:     Critical path. Loaded immediately.
  Below-fold sections:   Lazy-loaded via dynamic import + IntersectionObserver
  Pipeline Showcase:     Lazy-loaded (contains code samples, large component)
  Testimonials:          Lazy-loaded
  FAQ:                   Lazy-loaded (or lightweight enough for initial bundle)
  Footer:                In initial bundle (always visible)

JS BUNDLE BUDGET:
  Initial (critical): < 50KB gzipped
  Total:              < 150KB gzipped
  Excludes:           React, Next.js framework (these are cached)
```

### Image Optimization

```
next/image for all images:
  - Automatic WebP/AVIF conversion
  - Lazy loading (loading="lazy") for below-fold images
  - Priority loading (priority={true}) for hero illustration
  - Responsive sizes attribute based on breakpoints
  - Blur-up placeholder (placeholder="blur") for all images
  - Quality: 85 for photos, 100 for screenshots/SVGs

SVG ILLUSTRATIONS:
  - Inline SVGs for icons (bundled with component)
  - External SVGs via next/image for large illustrations
  - No rasterization of SVGs

SCREENSHOT IMAGES:
  - PNG format with compression
  - 2x resolution for retina displays (actual display at 1x)
  - Max width: 800px (screenshots don't need to be full-bleed)
```

### Lazy Loading Strategy

```
Priority loading (in initial HTML):
  - Nav component (server-rendered)
  - Hero section (server-rendered)
  - Hero illustration / terminal demo (client, loaded with priority)

Deferred loading (IntersectionObserver, rootMargin: 200px):
  - Trusted By section
  - Problem section
  - How It Works section
  - Pipeline Showcase (dynamic import)
  - Feature Showcase (first 6 cards in bundle, rest lazy)
  - Product Walkthrough (dynamic import)
  - Comparison Table
  - Use Cases
  - Testimonials (dynamic import)
  - Pricing Preview
  - FAQ
  - Final CTA
  - Footer

Component-level code splitting:
  const PipelineShowcase = dynamic(() => import('@/components/showcase/PipelineShowcase'))
  const Testimonials = dynamic(() => import('@/components/landing/Testimonials'))
```

### Caching

```
CDN CACHE:
  Static assets:    1 year (fingerprinted URLs)
  HTML (ISR):       60 seconds stale, revalidate in background
  Fonts:            1 year
  Images:           1 year

BROWSER CACHE:
  Service Worker:   Not used for landing page (overkill for mostly static content)
  Cache-Control:    Set by CDN headers
```

### Analytics Performance

```
Script loading:
  Analytics script: async/defer — never blocks rendering
  Third-party:      Loaded after page interactive (requestIdleCallback)
  No render-blocking analytics

Impact:
  Core Web Vitals target:
    LCP (Largest Contentful Paint): < 2.5s
    FID (First Input Delay):        < 100ms
    CLS (Cumulative Layout Shift):  < 0.1
    TTFB (Time to First Byte):      < 800ms
```

---

## 10. SEO

### Meta Tags

```html
<!-- Primary Meta -->
<title>PromptPilot — AI-Powered Software Planning Pipeline</title>
<meta
  name="description"
  content="Turn your product idea into a complete engineering specification — PRD, SRS, architecture, database schema, API spec, and roadmap — in minutes. Powered by AI. Built for engineers."
/>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://promptpilot.dev" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://promptpilot.dev" />
<meta property="og:title" content="PromptPilot — AI-Powered Software Planning Pipeline" />
<meta
  property="og:description"
  content="Turn your product idea into a complete engineering specification in minutes."
/>
<meta property="og:image" content="https://promptpilot.dev/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="PromptPilot" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://promptpilot.dev" />
<meta name="twitter:title" content="PromptPilot — AI-Powered Software Planning Pipeline" />
<meta
  name="twitter:description"
  content="Turn your product idea into a complete engineering specification in minutes."
/>
<meta name="twitter:image" content="https://promptpilot.dev/twitter-card.png" />
<meta name="twitter:site" content="@promptpilot" />
<meta name="twitter:creator" content="@promptpilot" />
```

### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PromptPilot",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "description": "AI-powered platform that transforms product ideas into complete software specification suites.",
  "url": "https://promptpilot.dev",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

### Sitemap Strategy

```
sitemap.xml (generated at build time):
  https://promptpilot.dev/              — Landing page (priority 1.0, daily)
  https://promptpilot.dev/pricing       — Pricing page (priority 0.9, weekly)
  https://promptpilot.dev/about         — About page (priority 0.7, monthly)
  https://promptpilot.dev/features      — Features page (priority 0.8, weekly)
  https://promptpilot.dev/blog          — Blog index (priority 0.8, daily)
  https://promptpilot.dev/blog/*        — Blog posts (priority 0.6, weekly)
  https://promptpilot.dev/docs          — Documentation (priority 0.7, daily)
  https://promptpilot.dev/privacy       — Privacy policy (priority 0.3, yearly)
  https://promptpilot.dev/terms         — Terms of service (priority 0.3, yearly)

robots.txt:
  User-agent: *
  Allow: /
  Sitemap: https://promptpilot.dev/sitemap.xml
```

---

## 11. Analytics

### Event Tracking Schema

```typescript
// Conceptual event tracking (implementation agnostic — PostHog, Plausible, etc.)

// PAGE VIEW
analytics.page({
  path: '/',
  referrer: document.referrer,
  utm_source: URLParams.get('utm_source'),
  utm_medium: URLParams.get('utm_medium'),
  utm_campaign: URLParams.get('utm_campaign'),
});

// CTA CLICKS
analytics.track('cta_click', {
  location: 'hero' | 'nav' | 'footer' | 'final_cta',
  type: 'primary' | 'secondary',
  destination: '/register' | '/login' | '/#pricing',
});

// SCROLL DEPTH
analytics.track('scroll_depth', {
  depth: 25 | 50 | 75 | 100,  // percentage
  section: 'hero' | 'features' | 'pricing' | 'faq' | 'cta',
});

// HERO ENGAGEMENT
analytics.track('hero_engagement', {
  action: 'terminal_viewed' | 'stats_viewed' | 'demo_interacted',
  time_spent: 1234,  // ms spent in viewport
});

// FEATURE INTERACTIONS
analytics.track('feature_interaction', {
  feature: 'ai_chat' | 'prompt_optimizer' | 'prompt_library' | 'prd_generator' | ...,
  action: 'viewed' | 'cta_clicked',
});

// PIPELINE SHOWCASE
analytics.track('pipeline_interaction', {
  step_clicked: 'prd' | 'srs' | 'architecture' | ...,
  total_steps_viewed: 5,
});

// PRICING INTERACTIONS
analytics.track('pricing_interaction', {
  action: 'viewed' | 'plan_clicked',
  plan: 'free' | 'pro' | 'team',
});

// FAQ
analytics.track('faq_interaction', {
  question: 'What exactly does PromptPilot generate?',
  action: 'opened' | 'closed',
});

// SIGNUP CONVERSION
analytics.track('signup_started', {
  source: 'hero_cta' | 'nav_cta' | 'footer_cta' | 'pricing_cta',
});

// DEMO REQUESTS (future)
analytics.track('demo_requested', {
  source: 'nav' | 'enterprise_section' | 'footer',
});

// CONVERSION FUNNEL
// 1. landing_page_view
// 2. hero_engagement (scrolled or interacted)
// 3. features_viewed (scrolled to features)
// 4. pricing_viewed
// 5. cta_click
// 6. signup_started (/register page view)
// 7. signup_completed (registered successfully)
// 8. activation (first project created)
```

### Privacy-First Analytics

```
No third-party cookies
No fingerprinting
No cross-site tracking
IP anonymization
GDPR/CCPA compliant
Self-hosted option (Plausible) or privacy-focused provider (PostHog with masking)
Respects Do Not Track (DNT) header
All analytics opt-out ready
```

---

## 12. Animations — Complete Reference

### Scroll-Triggered Section Reveals

```typescript
// Conceptual animation config for each section
const sectionAnimation = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' }, // Trigger 100px before visible
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
}

// Applied via Framer Motion's motion.div with whileInView
// Each card in a grid staggers by index * 50ms
```

### Hero Animations

```
Timeline (all times relative to page load):

0ms:       Hero section background visible
200ms:     Announcement badge fades in + slides down 8px
400ms:     Headline fades in (character by character? Or word by word? Word by word — 50ms stagger per word)
600ms:     Subheadline fades in
800ms:     Primary CTA fades in + scales from 0.95 → 1 with spring
900ms:     Secondary CTA fades in
1000ms:    Trust bar fades in
1200ms:    Stats bar starts animating (count-up)
1500ms:    Terminal demo window fades in + slides up
1800ms:    Terminal typing animation begins

TOTAL:      ~3 seconds for full hero animation sequence
           After initial load, all elements visible. No re-triggering on scroll back.

REDUCED MOTION:
           All elements visible immediately. No animations. No delays.
```

### Button Hover Animation

```css
.btn {
  transition:
    background-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}
.btn:hover {
  transform: translateY(-1px);
}
.btn:active {
  transform: translateY(0) scale(0.98);
}
```

### Card Hover Animation

```css
.card {
  transition:
    box-shadow 150ms ease,
    transform 150ms ease,
    border-color 150ms ease;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}
```

### Navigation Scroll Transition

```css
.nav {
  transition:
    background-color 200ms ease,
    box-shadow 200ms ease,
    backdrop-filter 200ms ease;
}
```

### Mobile Menu Animation

```
Open:
  Panel:    height 0 → auto (or max-height trick), 250ms, [0.4, 0, 0.2, 1]
  Icon:     rotate(0deg) → rotate(90deg), 250ms, spring
  Items:    Staggered fade-in + slide down (30ms per item)

Close:
  Panel:    height auto → 0, 200ms, ease-in
  Icon:     rotate(90deg) → rotate(0deg), 200ms, spring
```

### FAQ Accordion Animation

```
Open:
  Answer:  max-height 0 → 500px (or auto), opacity 0 → 1, 250ms, [0.4, 0, 0.2, 1]
  Icon +:  rotate(0deg) → rotate(45deg), 250ms, ease

Close:
  Answer:  max-height → 0, opacity 1 → 0, 200ms, ease-in
  Icon +:  rotate(45deg) → rotate(0deg), 200ms, ease

Only one FAQ item open at a time (accordion behavior).
```

### Pipeline Showcase Animations

```
Step hover:      Border color transition (neutral-200 → primary-500), bg change, 150ms ease
Step select:     Active border + bg with spring animation
Content switch:  Panel content crossfade (old fades out 100ms, new fades in 200ms)
Code content:    No animation on switch (instant content replacement)
```

### Feature Card Grid Entrance

```
Staggered reveal: Each card fades in + slides up 16px
Delay:            75ms per card, starting from top-left, row by row
Duration:         400ms per card
Easing:           [0.4, 0, 0.2, 1]
Trigger:          IntersectionObserver when grid enters viewport
Once:             true (doesn't re-animate)
Mobile:           100ms stagger (fewer cards visible at once)
```

### Loading Skeleton Animation

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}
```

### AI Typing Animation (Terminal Demo)

```
Cursor:    █ character, blinking (opacity 1 ↔ 0, 1s cycle, steps(2))
Typing:    Character-by-character reveal at 30ms per character
           (or 20ms for fast lines)
Prompt:    Green dollar sign ($) in JetBrains Mono
Checkmark: ✓ appears with spring scale (0 → 1.2 → 1, 300ms)
Spinner:   ⟳ rotates continuously (360deg, 1s linear infinite)
```

### Page Transition (future SPA navigation)

```
Exit:   Current content fades out (200ms, ease-in)
Enter:  New content fades in + slides up 8px (300ms, [0.4, 0, 0.2, 1])
Applies only within app routes. Landing page is static — no client-side transitions.
```

### Success Animation (future form submissions)

```
Email captured:     Input slides up → checkmark bounces in → "Thanks!" text fades
Duration:           600ms total
Elements:           Input → spinner (200ms) → checkmark (400ms spring) → text
```

### Back-to-Top Button

```
Appear:    Fade in + slide up 8px (opacity 0→1, 250ms) when scrolled past hero
Disappear: Fade out + slide down 8px (250ms) when scrolled back to hero
Hover:     Scale 1.05 + shadow increase (150ms)
Click:     Smooth scroll to top (native scroll-behavior or manual)
```

### Parallax (Subtle)

```
Hero radial gradient: Moves 2-3% in direction of cursor (desktop only).
                     Uses mousemove listener.
                     Not applied on mobile (no hover/cursor).
                     Disabled when prefers-reduced-motion.

Implementation:      CSS transform on the gradient pseudo-element.
                     Calculated as: translateX(cursorX * 0.02), translateY(cursorY * 0.02)
                     Clamped to max 20px displacement.
```

---

## 13. Empty & Error States

### Loading State (Initial Page Load)

```
Strategy: The page is statically generated (SSG). HTML arrives immediately.
          No full-page loading spinner. Content is visible immediately.

ABOVE-FOLD:         Server-rendered HTML. No loading state needed.
BELOW-FOLD:         Sections use skeleton loaders for dynamic/lazy content.

SKELETON PATTERNS:
  Feature cards:   6-12 skeleton rectangles arranged in grid.
                    Each: 280px × 220px, shimmer animation.
                    Layout matches final grid (3 columns desktop, 2 tablet, 1 mobile).
  Pipeline:        Horizontal row of 9 skeleton pills + 1 skeleton content box.
  Testimonials:    3 skeleton cards in a row (avatar circle + text lines).
  Pricing:         3 skeleton cards in a row.
  FAQ:             6-8 skeleton rectangles (full width, 60px height, stacked).
```

### Offline

```
Detection:    navigator.onLine + failed fetch listeners
Indicator:    Fixed banner at top of viewport (below nav):
              ┌─────────────────────────────────────────────────────────┐
              │ ⚠ You're offline. Some content may be unavailable.      │
              │ (bg-amber-50, border-amber-200, text-amber-800)        │
              └─────────────────────────────────────────────────────────┘
Duration:     Until connectivity restored (online event fires)
Behavior:     Page content remains visible (server-rendered HTML already loaded).
              External links, signup redirect, dynamic content unavailable.
              "Start Free" button remains clickable — redirects to register.
              If register page also requires network, show error there.
              Banner auto-dismisses when online event fires.
```

### Broken Images

```
Fallback:     On error event, show placeholder:
              ┌──────────────────┐
              │                  │
              │   [icon]         │
              │   Image          │
              │   unavailable    │
              │                  │
              └──────────────────┘
              (bg-neutral-100, border-neutral-200, rounded-lg, centered icon + text)
              Uses onError handler on <img> or next/image onError prop.
              Logs to analytics: analytics.track('image_error', { src, section })
```

### API Failure (future dynamic content)

```
If any API call fails (unlikely on static landing page, but for future):
  - Show section-specific error state, not full-page error
  - Example: "Couldn't load pricing. [Retry]" button
  - Retry button: refetches API, replaces error with content
  - Stale content shown if available (SWR cache)
  - Log error to monitoring
```

### 404 Page (not landing page, but linked from it)

```
Layout:
  ┌─────────────────────────────────────────────┐
  │                                             │
  │              ┌─────────────┐                 │
  │              │   404       │                 │
  │              │   Page not  │                 │
  │              │   found     │                 │
  │              └─────────────┘                 │
  │                                             │
  │  The page you're looking for doesn't exist  │
  │  or has been moved.                         │
  │                                             │
  │  ┌──────────────────┐   ┌────────────────┐  │
  │  │  Back to Home →   │   │  View Docs →   │  │
  │  └──────────────────┘   └────────────────┘  │
  └─────────────────────────────────────────────┘

  Has minimal nav (logo + "Back to Home").
  No full navigation (user doesn't need to browse from a 404).
  Includes search input (future: command palette to find content).
```

### Maintenance Mode (future)

```
If the platform is down for maintenance:
  - Cloudflare / CDN-level maintenance page (not app-level)
  - Simple message: "PromptPilot is undergoing scheduled maintenance.
                     We'll be back shortly."
  - No app loaded. Static HTML served from edge.
  - SEO: 503 status code, Retry-After header.
```

### JavaScript Disabled

```
All content visible (server-rendered HTML).
Interactive elements degraded:
  - Mobile menu: Links visible by default (or hidden, but content still accessible via footer links)
  - FAQ: All answers visible by default (no accordion collapse)
  - Pipeline showcase: First step content visible, others accessible via hash links
  - Smooth scroll: Falls back to instant jump
  - Animations: None (CSS transitions don't work without layout triggers)
  - Command palette: Hidden (requires JS)
  - Theme toggle: Not visible (requires JS, defaults to system preference)
  - Analytics: Not loaded (requires JS)
  - CTA buttons: Still work (they're <a> links with href)

Implementation:
  <noscript> styles to override display:none on FAQ answers and mobile menu
```

---

## 14. Future Scalability

### Marketplace

```
SECTION: "PromptPilot Marketplace" (replaces or augments Templates section)
CONTENT:
  - Showcase of community-created prompt templates
  - Pipeline step plugins
  - Export format plugins
  - Categories: Development, Design, Product, Research, Enterprise
  - Ratings, downloads, pricing (free / paid)
  - Featured / trending sections

COMPONENT: MarketplaceGrid with MarketplaceCard
LAYOUT: Same as Features grid (3 columns → responsive)
CARD: Template name, author avatar, rating stars, download count, price badge
INTERACTION: Click → marketplace detail page (external route)

IMPACT ON LANDING: One new section or replaces Templates section
BUILD TIMELINE: Phase 5 (Q1 2027)
```

### Templates Gallery

```
SECTION: "Start with Templates" (expanded Templates section)
CONTENT:
  - 6-12 featured templates with hover previews
  - Categories: PRD, SRS, Architecture, API Spec, User Stories, Roadmap
  - "Browse 50+ templates →" CTA
  - Each template shows: name, description, use case, difficulty, estimated time

COMPONENT: TemplateGallery with TemplateCard
LAYOUT: Horizontal scrollable carousel + grid toggle
CARD: Template icon, title, description, tags, "Use Template" button
HOVER: Card lifts, shows quick preview of template structure

IMPACT ON LANDING: Expands existing Templates section
BUILD TIMELINE: Phase 4 (Q3 2026)
```

### AI Agents

```
SECTION: "AI Agents" (future section after Features)
CONTENT:
  - "Extend PromptPilot with AI agents that automate your workflow"
  - Agent types: Code Generator, Test Writer, Documentation Keeper, Review Bot
  - How agents work: select → configure → deploy

VISUAL: Agent cards with pulsing AI indicators
STATUS: Conceptual. Phase 6+ (2027).
LANDING IMPACT: New section added between Features and Walkthrough.
```

### Community

```
SECTION: "Join the Community" (future section near footer)
CONTENT:
  - Discord members count
  - GitHub stars
  - Community templates count
  - Meetup groups
  - "Join Discord →" CTA

VISUAL: Dark section with community stats and social proof
STATUS: Can add anytime. Phase 4.
```

### Enterprise Portal

```
SECTION: "PromptPilot Enterprise" (separate page: /enterprise)
CONTENT:
  - SSO, RBAC, Audit logs, SLA, dedicated support, custom AI models
  - Enterprise ROI calculator
  - Customer logos (Fortune 500)
  - "Talk to Sales" CTA

NAV: "Enterprise" link in navigation bar
IMPACT ON LANDING: Nav link only. Separate page. Minimal landing page change.
BUILD TIMELINE: Phase 5 (Q1 2027)
```

### Integrations

```
SECTION: "Integrations" (future section)
CONTENT:
  - GitHub, GitLab, Bitbucket (sync specs to repos)
  - Jira, Linear, Notion (export to project management)
  - Slack, Discord, Teams (notifications)
  - Zapier, Make (automation)
  - Custom webhooks

VISUAL: Integration logos grid with "Connect" buttons
STATUS: Phase 5.
```

### Plugin Store

```
SECTION: "Plugin Store" (future section or separate page)
CONTENT:
  - "Extend PromptPilot"
  - Editor plugins, Export plugins, AI model plugins
  - Developer documentation link
  - "Build a Plugin →" CTA for developers

VISUAL: Similar to Marketplace. Cards with install count, rating.
STATUS: Phase 5-6.
```

### General Scalability Notes

```
SECTION ORDER FLEXIBILITY:
  Sections are independent components. Order can be changed via a config array.
  Feature flags can toggle sections on/off per environment.
  A/B testing: Show/hide sections based on experiment group.

ADDING NEW SECTIONS:
  1. Create section component in components/landing/
  2. Add to sections array in app/page.tsx
  3. Add to navigation links array
  4. Add analytics events
  5. Test across breakpoints

PERFORMANCE WITH MORE SECTIONS:
  Lazy loading prevents bundle growth.
  Each section independently code-split.
  No performance degradation with 20+ sections.

I18N READY:
  All text strings via translation keys (future: next-intl or similar).
  Section order can differ per locale.
  RTL support via CSS logical properties (future).
```

---

## 15. Final Component Tree

```
LandingPage (app/page.tsx — Server Component)
│
├── AnnouncementBanner (Client Component)
│   Props: message, cta?, dismissible
│   State: dismissed (localStorage), theme
│   Animation: Slide down + fade in. Slide up on dismiss.
│
├── Nav (Client Component)
│   Props: variant ('landing'), authenticated
│   State: scrolled, mobileMenuOpen, theme
│   Hooks: useScrollPosition, useMediaQuery
│   ├── Logo
│   │   Props: href
│   ├── NavLinks (Desktop)
│   │   Props: links[], currentPath?
│   │   └── NavLink[]
│   │       Props: href, label, active?
│   ├── ThemeToggle
│   │   Props: (none — reads from context/atom)
│   │   State: theme ('light' | 'dark' | 'system')
│   ├── AuthButtons (when !authenticated)
│   │   ├── SignInButton (ghost)
│   │   │   Props: href="/login"
│   │   └── StartFreeButton (primary, compact)
│   │       Props: href="/register"
│   ├── UserMenu (when authenticated)
│   │   Props: user { name, email, avatarUrl }
│   │   State: dropdownOpen
│   │   ├── NotificationBell
│   │   │   Props: unreadCount
│   │   └── UserDropdown
│   │       ├── UserInfo
│   │       ├── MenuItem[] (Dashboard, Workspaces, Settings, Docs)
│   │       └── SignOutButton
│   └── MobileMenuToggle
│       Props: open, onClick, aria-expanded, aria-controls
│       └── MobileMenuPanel (conditional)
│           Props: links[], authenticated, onClose
│           ├── MobileNavLink[]
│           ├── ThemeToggle
│           └── AuthButtons (mobile variant)
│
├── HeroSection (Client Component — has cursor parallax)
│   Props: (none — self-contained)
│   State: cursorPosition (for gradient parallax)
│   Hooks: useMousePosition (desktop only), useInView
│   ├── HeroBackground
│   │   └── RadialGradient[]
│   ├── AnnouncementBadge
│   │   Props: text, dotColor, href?
│   ├── HeroHeadline
│   │   Props: text (or children)
│   │   Animation: Word-by-word fade (framer-motion stagger)
│   ├── HeroSubheadline
│   │   Props: text
│   ├── HeroCTAs
│   │   ├── PrimaryCTA (Button, xl, primary)
│   │   │   Props: href="/register", label="Start Free"
│   │   └── SecondaryCTA (Button, xl, secondary)
│   │       Props: href="#how-it-works", label="See how it works ↓"
│   ├── TrustBar
│   │   Props: text
│   ├── HeroStats
│   │   Props: stats[] { value, label }
│   │   Animation: Count-up on scroll into view
│   │   └── StatItem[]
│   │       Props: value, label, prefix?, suffix?
│   └── TerminalDemo (Client Component)
│       Props: steps[] (demo content)
│       State: currentStepIndex, isTyping
│       Animation: Typewriter, floating, checkmarks, cursor blink
│       └── TerminalLine[]
│           Props: type ('prompt' | 'input' | 'status'), text, delay
│
├── TrustedBySection (Client Component — lazy loaded)
│   Props: logos[] { name, src, width, height }
│   State: (none — static)
│   └── LogoMarquee
│       └── CompanyLogo[]
│
├── ProblemSection (Client Component — lazy loaded)
│   Props: painPoints[]
│   └── PainPoint[]
│       Props: icon, title, description
│
├── HowItWorksSection (Client Component)
│   Props: steps[] { number, icon, title, description }
│   └── StepCard[]
│       Props: number, icon, title, description, isLast?
│
├── PipelineShowcase (Client Component — lazy loaded, dynamic import)
│   Props: steps[] { id, label, icon, description, content }
│   State: activeStep
│   ├── PipelineNav
│   │   └── PipelineStepButton[]
│   │       Props: id, label, icon, active, onClick
│   └── PipelineContent
│       ├── ContentHeader (icon + title + description)
│       └── ContentBody (code block with syntax highlighting)
│           └── CodeBlock
│               Props: content, language ('markdown')
│
├── FeatureShowcase (Client Component)
│   Props: features[] FeatureCardProps
│   State: (none — static cards with hover states)
│   └── FeatureCard[]
│       Props: icon, iconBg, title, description, benefits[], cta { label, href }
│       Animation: Staggered fade-in (IntersectionObserver)
│
├── ProductWalkthrough (Client Component — lazy loaded, dynamic import)
│   Props: journeySteps[] JourneyStepProps
│   State: activeStep
│   ├── JourneyMap
│   │   └── JourneyNode[]
│   │       Props: id, label, icon, active, onClick
│   └── JourneyDetail
│       ├── DetailText (title + description + capabilities)
│       └── DetailImage (screenshot or illustration)
│
├── ComparisonTable (Client Component)
│   Props: rows[] { feature, competitors: Record<string, string> }
│   ├── TableHeader (column labels)
│   └── TableRow[]
│       Props: feature, values[]
│
├── UseCasesSection (Client Component — future)
│   Props: personas[] { id, icon, title, description, useCase }
│   State: activePersona
│   ├── PersonaTabs
│   └── PersonaContent
│
├── TestimonialsSection (Client Component — lazy loaded, dynamic import)
│   Props: testimonials[] { quote, author, role, company, avatarUrl }
│   State: activeIndex (carousel)
│   └── TestimonialCard[]
│       ├── Quote (blockquote)
│       ├── Author (avatar + name + role + company)
│       └── CompanyLogo
│
├── PricingSection (Client Component)
│   Props: plans[] { name, price, period, description, features[], cta, popular? }
│   └── PricingCard[]
│       Props: plan, popular?, onCTAClick
│       ├── PopularBadge (conditional)
│       ├── PlanHeader (name + price)
│       ├── PlanDescription
│       ├── FeatureList
│       │   └── FeatureItem[]
│       └── PlanCTA (Button)
│
├── FAQSection (Client Component)
│   Props: items[] { question, answer }
│   State: openIndex (single accordion)
│   └── FAQItem[]
│       Props: question, answer, isOpen, onToggle
│       ├── QuestionButton (aria-expanded)
│       └── AnswerPanel (conditional, animated height)
│
├── CTASection (Client Component)
│   Props: headline, subtitle, primaryCTA { label, href }, secondaryCTA?, trustText?
│   ├── CTAHeadline
│   ├── CTASubtitle
│   ├── CTAPrimary (Button, xl, primary or white-on-dark)
│   └── CTA TrustBar
│
├── Footer (Server Component — static)
│   Props: (none — uses constants)
│   ├── FooterGrid
│   │   ├── FooterBrand (logo + tagline + copyright)
│   │   └── FooterLinkSection[] (Product, Resources, Company, Legal)
│   │       └── FooterLink[]
│
└── BackToTop (Client Component)
    Props: (none — self-contained)
    State: visible (scroll position > viewport height)
    Animation: Fade in/out
```

### Component File Map

```
apps/frontend/
├── app/
│   └── page.tsx                          ← LandingPage (Server Component entry)
│
├── components/
│   ├── marketing/                         ← EXISTING (migrate to Tailwind)
│   │   ├── Nav.tsx                       ← ✅ Built (needs Tailwind, dark mode, theme toggle, search)
│   │   ├── Footer.tsx                    ← ✅ Built (needs Tailwind)
│   │   ├── PricingSection.tsx            ← ✅ Built (needs Tailwind)
│   │   ├── FAQ.tsx                       ← ✅ Built (needs Tailwind)
│   │   ├── ComparisonTable.tsx           ← ✅ Built (needs Tailwind)
│   │   └── CTASection.tsx               ← 🔜 New (extract from page.tsx)
│   │
│   ├── showcase/                          ← EXISTING
│   │   ├── HowItWorks.tsx               ← ✅ Built (needs Tailwind)
│   │   ├── PipelineShowcase.tsx          ← ✅ Built (needs Tailwind, dark mode)
│   │   └── ArtifactGrid.tsx             ← ✅ Built (replace with FeatureShowcase)
│   │
│   ├── landing/                           ← 🔜 NEW
│   │   ├── AnnouncementBanner.tsx
│   │   ├── HeroSection.tsx              ← Extract from page.tsx Hero()
│   │   ├── HeroStats.tsx
│   │   ├── TerminalDemo.tsx
│   │   ├── TrustedBySection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── FeatureShowcase.tsx           ← Expands ArtifactGrid
│   │   ├── FeatureCard.tsx
│   │   ├── ProductWalkthrough.tsx
│   │   ├── JourneyNode.tsx
│   │   ├── JourneyDetail.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── BackToTop.tsx
│   │
│   ├── nav/                               ← EXISTING
│   │   └── Navbar.tsx                    ← Used in app layout (not landing)
│   │
│   └── feedback/                          ← EXISTING
│       ├── Skeleton.tsx                  ← Reuse: loading skeletons
│       └── ToastProvider.tsx             ← Reuse: not needed on landing
│
└── hooks/
    ├── useScrollPosition.ts              ← 🔜 New
    ├── useMousePosition.ts               ← 🔜 New
    ├── useInView.ts                      ← 🔜 New
    ├── useReducedMotion.ts               ← 🔜 New
    └── useCountUp.ts                     ← 🔜 New
```

---

## Implementation Notes

### Migration Priority (Existing → Tailwind)

```
Phase 1 — Critical path (must migrate first):
  1. Nav.tsx                    — Every page uses it
  2. Hero (extract from page.tsx) — Primary conversion element
  3. Footer.tsx                 — Every page uses it

Phase 2 — Conversion sections:
  4. PricingSection.tsx         — Revenue impact
  5. FAQ.tsx                    — Objection handling
  6. CTASection (new)          — Final conversion push

Phase 3 — Value demonstration:
  7. HowItWorks.tsx
  8. PipelineShowcase.tsx
  9. ComparisonTable.tsx
  10. ArtifactGrid → FeatureShowcase (rewrite)

Phase 4 — New sections:
  11. TrustedBySection
  12. ProblemSection
  13. TestimonialsSection
  14. ProductWalkthrough
  15. AnnouncementBanner
  16. TerminalDemo
  17. BackToTop
```

### Dark Mode Implementation

```
1. Tailwind darkMode: 'class' already configured ✅
2. Theme toggle in Nav:
   - Reads initial theme from localStorage or system preference
   - Toggles 'dark' class on <html>
   - Persists choice to localStorage
   - Event: 'theme-change' custom event for other components
3. All components use dark: prefix variants in Tailwind
4. CSS variables for dynamic values (shadows, gradients that change in dark mode)
5. System preference detection:
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
6. Initial flash prevention:
   <script> in <head> that reads localStorage and sets class before paint
   (inline script, no flicker)
```

---

_Document Version: 1.0 — PromptPilot Landing Page Specification_
_Last Updated: 2026-07-21_
_Status: Ready for implementation_
