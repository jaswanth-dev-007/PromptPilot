# Deployment Guide · PromptPilot

**Version:** 1.0.0
**Status:** Approved
**Author:** DevOps Engineer & Chief Software Architect
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0

---

## 1. Deployment Overview

PromptPilot has two deployment targets:

| Target              | Type           | Priority    | Description                                               |
| ------------------- | -------------- | ----------- | --------------------------------------------------------- |
| **npm Registry**    | CLI Package    | P0 (MVP)    | The CLI tool distributed via `npm install -g promptpilot` |
| **Hosted Services** | Web + API + DB | P3 (Growth) | Web dashboard, API server, database, marketplace          |

This guide covers both. The npm deployment is the primary focus through v1.0.

---

## 2. npm Package Deployment

### 2.1 Package Structure

```
promptpilot/
├── bin/
│   └── promptpilot.js        # Entry point: #!/usr/bin/env node
├── dist/                     # Compiled TypeScript output
│   ├── cli/
│   ├── core/
│   ├── adapters/
│   ├── validators/
│   ├── fs/
│   ├── config/
│   └── shared/
├── docs/                     # Prompt templates (shipped with package)
│   ├── 00_Master_Context.md
│   └── ...
├── templates/                # Default scaffold (copied on `init`)
│   └── ...
├── package.json
└── README.md
```

### 2.2 Build Process

```bash
# Clean previous build
npm run clean

# TypeScript compilation
tsc -b

# Output goes to packages/*/dist/
# Main entry: packages/cli/dist/cli.js
```

### 2.3 Package.json Configuration

```json
{
  "name": "promptpilot",
  "version": "0.1.0",
  "description": "AI-powered software planning pipeline",
  "license": "MIT",
  "repository": "github:promptpilot/promptpilot",
  "bin": {
    "promptpilot": "./bin/promptpilot.js"
  },
  "main": "./dist/cli/cli.js",
  "files": ["bin/", "dist/", "docs/", "templates/", "README.md", "LICENSE"],
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [
    "prompt-engineering",
    "software-planning",
    "prd",
    "srs",
    "architecture",
    "ai",
    "cli",
    "specification"
  ]
}
```

### 2.4 Release Process

```bash
# 1. Ensure you're on main and up to date
git checkout main
git pull origin main

# 2. Run full CI
npm run ci:full

# 3. Bump version
npm version patch  # or minor, or major
# This: bumps package.json, creates git tag, commits

# 4. Build
npm run build

# 5. Publish to npm
npm publish --access public

# 6. Push tags
git push origin main --tags

# 7. Create GitHub Release
gh release create v$(node -p "require('./package.json').version") \
  --title "v$(node -p "require('./package.json').version")" \
  --notes-file CHANGELOG.md
```

### 2.5 Release Automation (GitHub Actions)

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run ci:full
      - run: npm run build

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

### 2.6 Post-Release Verification

```bash
# Fresh install test
npm install -g promptpilot

# Smoke tests
promptpilot --version
promptpilot --help
promptpilot init test-project --yes
cd test-project
promptpilot run 1 --dry-run
promptpilot validate

# Cleanup
cd .. && rm -rf test-project
npm uninstall -g promptpilot
```

---

## 3. Hosted Services Deployment (P3)

### 3.1 Infrastructure

| Service            | Provider                   | Configuration                                 |
| ------------------ | -------------------------- | --------------------------------------------- |
| **API Server**     | Railway / Fly.io / AWS ECS | 2 vCPU, 4GB RAM, auto-scale 2-10 instances    |
| **PostgreSQL**     | Railway / AWS RDS / Neon   | db.t3.medium, 50GB storage, automated backups |
| **Redis**          | Upstash / AWS ElastiCache  | 2GB cache.t3.micro, cluster mode              |
| **Object Storage** | Cloudflare R2 / AWS S3     | Prompt pack files, artifact backups           |
| **CDN**            | Cloudflare                 | Static assets, web dashboard                  |
| **Email**          | Resend / AWS SES           | Transactional email                           |
| **Monitoring**     | Sentry + Grafana / Datadog | Error tracking, performance monitoring        |
| **Logging**        | Better Stack / CloudWatch  | Structured log aggregation                    |

### 3.2 Environment Variables (Hosted)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/promptpilot

# Redis
REDIS_URL=redis://user:pass@host:6379

# Auth
JWT_SECRET=random-64-char-string
SESSION_SECRET=random-64-char-string

# OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Email
RESEND_API_KEY=xxx
EMAIL_FROM=noreply@promptpilot.dev

# Billing
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Storage
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET=promptpilot-packs
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3.3 Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml (for local dev of hosted tier)
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/promptpilot
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: promptpilot
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  pgdata:
```

### 3.4 Database Migration (Hosted)

```bash
# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Create a new migration
npm run db:create-migration -- --name add_user_avatars

# Seed development data
npm run db:seed
```

### 3.5 Health Check Endpoint

```typescript
// GET /health
app.get('/health', async c => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    uptime: process.uptime(),
  }

  const allHealthy = Object.values(checks).every(c => c !== false)
  return c.json(checks, allHealthy ? 200 : 503)
})

async function checkDatabase(): Promise<boolean> {
  try {
    await db.execute('SELECT 1')
    return true
  } catch {
    return false
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}
```

---

## 4. Environment Strategy

### 4.1 npm Package (OSS CLI)

The npm package is environment-agnostic. Users install it on their machine. No staging/preview environments — the package is the artifact.

### 4.2 Hosted Services

| Environment     | Purpose                       | Database         | Deploy Trigger           |
| --------------- | ----------------------------- | ---------------- | ------------------------ |
| **Development** | Local development             | Docker (local)   | Manual                   |
| **Preview**     | Per-PR ephemeral environments | Branch DB (Neon) | PR opened                |
| **Staging**     | Pre-release testing           | Staging DB       | Push to `staging` branch |
| **Production**  | Live service                  | Production DB    | Push to `main` or tag    |

### 4.3 Preview Environments (Per-PR)

Each PR gets an ephemeral environment:

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      - name: Comment Preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview deployed: ${previewUrl}`
            })
```

---

## 5. Monitoring & Observability

### 5.1 CLI (No Telemetry)

The open-source CLI sends **zero data anywhere**. No monitoring, no analytics, no crash reporting. Per NFR-S01 and Master Context §15.1.

### 5.2 Hosted Services

| Signal          | Tool                      | What to Monitor                                              |
| --------------- | ------------------------- | ------------------------------------------------------------ |
| **Errors**      | Sentry                    | Unhandled exceptions, API errors                             |
| **Performance** | Sentry Performance        | P95 latency per endpoint, slow queries                       |
| **Uptime**      | Better Uptime / Pingdom   | Health check endpoint every 30s                              |
| **Logs**        | Better Stack / CloudWatch | Structured JSON logs, search, alerts                         |
| **Metrics**     | Prometheus + Grafana      | Request rate, error rate, DB connections, Redis hit rate     |
| **Alerts**      | PagerDuty / Opsgenie      | Error rate spike, P95 latency > 2s, DB connection exhaustion |

### 5.3 Key Metrics to Monitor

| Metric             | Alert Threshold           | Action                                       |
| ------------------ | ------------------------- | -------------------------------------------- |
| API error rate     | > 1% for 5 minutes        | Page on-call engineer                        |
| P95 latency        | > 2 seconds for 5 minutes | Investigate slow queries or LLM timeouts     |
| DB connection pool | > 80% utilization         | Scale up or investigate connection leaks     |
| Redis memory       | > 80%                     | Scale up or investigate key bloat            |
| Failed login rate  | > 50/minute               | Potential brute force — enable rate limiting |

---

## 6. Rollback Procedures

### 6.1 npm Package Rollback

```bash
# If a bad version was published, deprecate it
npm deprecate promptpilot@0.1.0 "Buggy release — use 0.0.9 instead"

# Users can install a specific version
npm install -g promptpilot@0.0.9
```

### 6.2 Hosted Services Rollback

```bash
# Option A: Revert the commit
git revert <bad-commit-hash>
git push origin main
# CI/CD deploys the previous version

# Option B: Re-deploy previous image
# If using container registry with versioned images
kubectl set image deployment/api api=registry/promptpilot:v0.1.9

# Option C: Database rollback (only if migration is reversible)
npm run db:rollback
```

---

## 7. Security Deployment Checklist

Before every production deployment:

- [ ] `npm audit` passes with 0 critical/high vulnerabilities.
- [ ] No API keys, secrets, or credentials in the codebase.
- [ ] `.env` files are in `.gitignore` and not committed.
- [ ] HTTPS enforced on all endpoints.
- [ ] CORS configured to allow only trusted origins.
- [ ] Rate limiting enabled on auth endpoints.
- [ ] Database backups completed in the last 24 hours.
- [ ] SSL certificates valid for 30+ days.
- [ ] Dependency licenses compatible with MIT.
- [ ] No debug logging enabled.

---

## 8. Cost Management

### 8.1 npm Package Costs

| Item              | Cost                                |
| ----------------- | ----------------------------------- |
| npm publish       | Free (public packages)              |
| GitHub Actions CI | Free (public repos, 2000 min/month) |
| **Total**         | **$0/month**                        |

### 8.2 Hosted Services Costs (Estimated)

| Service                       | Monthly Cost (Small) | Monthly Cost (Medium) |
| ----------------------------- | -------------------- | --------------------- |
| API Server (Railway)          | $20                  | $100                  |
| PostgreSQL (Neon/Railway)     | $20                  | $80                   |
| Redis (Upstash)               | $10                  | $40                   |
| R2 Storage (10GB)             | $0.15                | $2                    |
| Email (Resend, 10K emails)    | $20                  | $50                   |
| Monitoring (Sentry free tier) | $0                   | $26                   |
| **Total (Small)**             | **~$70/month**       | —                     |
| **Total (Medium)**            | —                    | **~$300/month**       |

---

## 9. Scaling Plan

### 9.1 npm Package

The npm package doesn't need scaling — it's installed by users and runs locally. No server infrastructure. The only scaling concern is npm registry bandwidth, which is handled by npm, Inc.

### 9.2 Hosted Services

| Load Level     | Users        | API Instances     | DB Tier                           | Redis Tier   |
| -------------- | ------------ | ----------------- | --------------------------------- | ------------ |
| **Launch**     | < 100        | 1                 | db.t3.micro (2GB)                 | 256MB        |
| **Growth**     | 100-1,000    | 2-4 (auto-scale)  | db.t3.medium (4GB)                | 1GB          |
| **Scale**      | 1,000-10,000 | 4-10 (auto-scale) | db.t3.large (8GB) + read replicas | 2GB cluster  |
| **Enterprise** | 10,000+      | 10+ (auto-scale)  | Custom RDS + read replicas        | 4GB+ cluster |

---

**End of Deployment Guide**
