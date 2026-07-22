# PromptPilot — Product Requirements Document

## Overview

PromptPilot is an AI-powered SaaS platform that transforms product ideas into complete software specification suites. Users define a product vision, and the platform orchestrates a sequence of curated AI prompts to generate PRDs, SRS documents, system architecture, database schemas, API specifications, user flows, wireframes, and feature roadmaps.

## Core Features

### 1. Authentication & User Management

- User registration with email/name/password
- Secure login with JWT access + refresh token pair
- Session persistence via localStorage
- Protected routes with middleware redirects
- Password hashing with bcrypt (12 rounds)

### 2. Dashboard

- Interactive task list with add/toggle/delete operations
- Workspace overview page for project management
- Clean, responsive UI with inline styles

### 3. Specification Engine (Core Pipeline)

- 9-step prompt pipeline: Master Context → PRD → SRS → Architecture → DB Schema → API Spec → User Flows → Wireframes → Roadmap
- LLM-agnostic adapter layer (OpenAI, Anthropic, Google, Ollama)
- Streaming support for real-time generation
- Token counting and cost estimation

### 4. Collaborative Editor

- Route placeholder: `/editor`
- Ready for Phase 3 implementation

## Technical Requirements

### Frontend

- Next.js 15 (App Router) with React 19
- TypeScript, strict mode
- Responsive, accessible UI
- Client-side validation on all forms

### Backend

- Express API server with helmet, CORS, rate limiting
- JWT authentication middleware
- MongoDB via Mongoose, PostgreSQL via Prisma
- Structured error handling with typed error classes

### DevOps

- pnpm monorepo with TurboRepo
- Docker Compose for local MongoDB
- GitHub Actions CI (lint + format + build + test)
- Husky pre-commit hooks with lint-staged

## Non-Functional Requirements

- Health endpoint (`/health`) returns JSON status, uptime, DB connectivity
- Graceful shutdown on SIGTERM/SIGINT
- All API errors return `{ success: false, error: { code, message } }`
- Zero external tracking or analytics
- MIT licensed

## Privacy

- No telemetry, analytics, or tracking
- Passwords hashed with bcrypt (never stored plaintext)
- JWT tokens include `jti` (UUID) for uniqueness
- Refresh tokens hashed with SHA-256 before storage
- Users can request data copy/deletion
