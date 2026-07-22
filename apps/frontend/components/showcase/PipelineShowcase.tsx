'use client'

import React, { useState } from 'react'

interface Step {
  id: string
  label: string
  icon: string
  description: string
  content: string
}

const STEPS: Step[] = [
  {
    id: 'master-context',
    label: 'Master Context',
    icon: '💡',
    description: 'Define your product vision, target audience, and constraints.',
    content: `# Master Context — PromptPilot

## Product Vision
PromptPilot is an AI-powered SaaS platform that transforms product ideas into complete software specification suites.

## Target Audience
Software engineers, product managers, technical founders, and engineering teams.

## Platform
Web application with REST API backend and Next.js frontend.

## Industry Domain
Developer tools and software engineering productivity.

## Key Constraints
- Enterprise-grade security (SOC 2 Type II target)
- 99.9% uptime SLA
- GDPR & CCPA compliant`,
  },
  {
    id: 'prd',
    label: 'PRD',
    icon: '📋',
    description: 'Generate a complete Product Requirements Document.',
    content: `# Product Requirements Document

## Functional Requirements
1. User authentication with email/password + OAuth (Google, GitHub)
2. 9-step AI pipeline for generating software specifications
3. Workspace-based project organization
4. Version history for all generated documents
5. Export to PDF, Markdown, and DOCX

## Non-Functional Requirements
- API response time < 200ms p95
- 99.9% uptime SLA
- WCAG 2.2 AA accessibility compliance
- Zero external analytics or tracking`,
  },
  {
    id: 'srs',
    label: 'SRS',
    icon: '📐',
    description: 'Generate a Software Requirements Specification.',
    content: `# Software Requirements Specification

## 1. Introduction
This document defines the complete software requirements for PromptPilot.

## 2. System Architecture
- Frontend: Next.js 15 App Router with React 19
- Backend: Express API with TypeScript
- Database: PostgreSQL via Prisma ORM
- Auth: JWT access/refresh tokens with bcrypt

## 3. API Design
- RESTful API with versioning (/api/v1)
- Rate limiting: 100 req/15min per IP
- Structured error responses: { success, error: { code, message } }`,
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: '🏗️',
    description: 'Design the complete system architecture.',
    content: `# System Architecture

## High-Level Architecture
\`\`\`
┌─────────────┐     ┌─────────────┐     ┌────────────┐
│  Next.js 15 │────▶│  Express    │────▶│ PostgreSQL │
│  Frontend   │     │  API Server │     │  (Prisma)  │
└─────────────┘     └─────────────┘     └────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌─────────────┐
│  Vercel     │     │  Docker     │
│  (Hosting)  │     │  (Optional) │
└─────────────┘     └─────────────┘
\`\`\`

## Key Decisions
- Monorepo: Turborepo + pnpm workspaces
- Auth: Custom JWT (not managed service)
- Styling: Tailwind CSS with design tokens`,
  },
  {
    id: 'database',
    label: 'Database Schema',
    icon: '🗄️',
    description: 'Design the complete database schema.',
    content: `# Database Schema

## Core Entities
- **User** — email, passwordHash, name, role, isActive
- **Workspace** — name, slug, ownerId, type (personal/team)
- **Project** — name, slug, workspaceId, status
- **Document** — projectId, stepId, type, content (Markdown), version
- **AIConversation** — projectId, stepId, model, tokens, cost
- **Message** — conversationId, role (system/user/assistant), content

## Indexes
- users: email (unique)
- workspaces: (ownerId, slug) unique
- projects: (workspaceId, slug) unique
- documents: (projectId, stepId) unique`,
  },
  {
    id: 'api-spec',
    label: 'API Specification',
    icon: '🔌',
    description: 'Design the complete REST API.',
    content: `# API Specification

## Authentication
\`POST   /api/v1/auth/register\` — Create account
\`POST   /api/v1/auth/login\`    — Sign in
\`POST   /api/v1/auth/refresh\`  — Refresh tokens
\`POST   /api/v1/auth/logout\`   — Sign out
\`GET    /api/v1/auth/me\`       — Current user

## Projects
\`GET    /api/v1/projects\`      — List projects
\`POST   /api/v1/projects\`      — Create project
\`GET    /api/v1/projects/:id\`  — Get project
\`PATCH  /api/v1/projects/:id\`  — Update project

## Pipeline
\`POST   /api/v1/pipeline/run\`  — Execute pipeline step`,
  },
  {
    id: 'user-flows',
    label: 'User Flows',
    icon: '🔄',
    description: 'Map the complete user journey.',
    content: `# User Flows

## Registration Flow
\`\`\`
Landing → Register → Email/Password → Verify → Dashboard
\`\`\`

## Pipeline Flow
\`\`\`
Dashboard → New Project → Define Context → Run Pipeline
  → Master Context → PRD → SRS → Architecture → DB → API
  → User Flows → Wireframes → Roadmap
\`\`\`

## Export Flow
\`\`\`
Project → Select Documents → Choose Format (PDF/MD/DOCX)
  → Generate → Download
\`\`\``,
  },
  {
    id: 'wireframes',
    label: 'Wireframes',
    icon: '🎨',
    description: 'Generate UI wireframes for your application.',
    content: `# UI Wireframes

## Landing Page
┌────────────────────────────┐
│  [Logo]  Nav  [CTA Button] │
├────────────────────────────┤
│                            │
│    Hero Section            │
│    Headline + CTA          │
│                            │
├────────────────────────────┤
│  Features Grid (3×3)       │
├────────────────────────────┤
│  How It Works              │
├────────────────────────────┤
│  Footer                    │
└────────────────────────────┘`,
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: '🗺️',
    description: 'Create a feature roadmap with priorities.',
    content: `# Feature Roadmap

## Phase 1 — MVP (Q3 2026)
- ✅ User authentication
- ✅ 9-step pipeline
- ✅ Document generation
- ✅ Basic dashboard

## Phase 2 — Platform (Q4 2026)
- 🔲 Workspace collaboration
- 🔲 Export system (PDF, MD, DOCX)
- 🔲 Version history
- 🔲 Email notifications

## Phase 3 — Enterprise (Q1 2027)
- 🔲 SSO (OIDC/SAML)
- 🔲 RBAC with custom roles
- 🔲 Audit logging
- 🔲 SOC 2 Type II`,
  },
]

export function PipelineShowcase() {
  const [activeStep, setActiveStep] = useState<string>(STEPS[0].id)
  const current = STEPS.find(s => s.id === activeStep) || STEPS[0]

  return (
    <section style={styles.section} id="pipeline">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>See PromptPilot in Action</h2>
          <p style={styles.subtitle}>
            Click any step to see the type of output PromptPilot generates. Every document is real content from an actual PromptPilot run.
          </p>
        </div>

        <div style={styles.pipeline}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(step.id)}
                aria-selected={step.id === activeStep}
                style={{
                  ...styles.step,
                  ...(step.id === activeStep ? styles.stepActive : {}),
                }}
              >
                <span style={styles.stepIcon}>{step.icon}</span>
                <span style={styles.stepLabel}>{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span style={styles.connector}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <span style={{ fontSize: '1.5rem' }}>{current.icon}</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {current.label}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '4px 0 0 0' }}>
                {current.description}
              </p>
            </div>
          </div>
          <div style={styles.contentBody}>
            <pre style={styles.pre}>
              <code>{current.content}</code>
            </pre>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>
            Generated by PromptPilot using GPT-4o
          </p>
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 24px',
    backgroundColor: '#F8FAFC',
    fontFamily: 'inherit',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6B7280',
    marginTop: '12px',
    maxWidth: '600px',
    margin: '12px auto 0',
  },
  pipeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '32px',
    overflowX: 'auto',
    padding: '8px 0',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#64748B',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    minWidth: '80px',
  },
  stepActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: 600,
  },
  stepIcon: {
    fontSize: '1.25rem',
  },
  stepLabel: {
    fontSize: '0.6875rem',
  },
  connector: {
    color: '#CBD5E1',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    borderBottom: '1px solid #F1F5F9',
  },
  contentBody: {
    padding: '24px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  pre: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.8125rem',
    lineHeight: 1.7,
    color: '#334155',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
}
