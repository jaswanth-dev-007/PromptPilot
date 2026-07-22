# PromptPilot — Authentication & Onboarding System Specification

## Complete Enterprise-Grade Auth, Security & User Onboarding Design

### Version 1.0 — Production-Ready Build Document

---

## Design System Reference

All UI components reference the PromptPilot Design System (`docs/DESIGN_SYSTEM.md`) and the existing Tailwind token config:

- **Typography:** Inter (headings) + Geist Sans (body), scale 12–72px, weights 400/500/600/700
- **Color:** Primary Indigo-600 (#4F46E5), Neutral Slate 50–950, Success Emerald-500, Warning Amber-500, Error Red-500
- **Spacing:** 4px base unit
- **Radii:** sm 4px, md 8px, lg 12px, xl 16px
- **Shadows:** sm/md/lg/xl elevation system, `glow-primary` for CTA buttons
- **Motion:** 150ms fast, 250ms normal, 400ms slow, Framer Motion spring presets
- **Breakpoints:** sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px

### What's Already Built

| Component                                                         | Status        | Location                                   |
| ----------------------------------------------------------------- | ------------- | ------------------------------------------ |
| AuthService (register/login/refresh/logout/getUser)               | ✅ Production | `packages/auth/src/service.ts`             |
| JWT tokens (HS256, jti, rotation, revocation)                     | ✅ Production | `packages/auth/src/tokens.ts`              |
| Cookie management (HttpOnly, Secure, SameSite)                    | ✅ Production | `packages/auth/src/cookies.ts`             |
| Password hashing (bcrypt, 12 rounds)                              | ✅ Production | `packages/auth/src/hash.ts`                |
| Zod validation schemas                                            | ✅ Production | `packages/auth/src/validate.ts`            |
| Auth middleware (authenticate, optionalAuth, authorize)           | ✅ Production | `packages/auth/src/middleware.ts`          |
| Express auth routes (/register, /login, /refresh, /logout, /me)   | ✅ Production | `apps/api/src/routes/auth.ts`              |
| Onboarding service (auto-create default workspace)                | ✅ Production | `apps/api/src/services/onboarding.ts`      |
| Login page (client validation, API integration)                   | ✅ Production | `apps/frontend/app/login/page.tsx`         |
| Register page (name/email/password/confirm)                       | ✅ Production | `apps/frontend/app/register/page.tsx`      |
| AuthProvider (React Context, localStorage persistence)            | ✅ Production | `apps/frontend/providers/AuthProvider.tsx` |
| Next.js middleware (protected route redirects)                    | ✅ Production | `apps/frontend/middleware.ts`              |
| User model (Prisma, email unique, passwordHash, refreshTokenHash) | ✅ Production | `prisma/schema.prisma`                     |
| Error classes (AuthError, ConflictError, ForbiddenError, etc.)    | ✅ Production | `packages/shared/src/errors.ts`            |

### What This Spec Adds (Phase 4–5)

| Feature                                     | Priority |
| ------------------------------------------- | -------- |
| Google/GitHub OAuth                         | P0       |
| Magic Link (passwordless)                   | P0       |
| Email Verification                          | P0       |
| Password Reset (forgot + reset flow)        | P0       |
| MFA/2FA (TOTP)                              | P1       |
| Passkeys (WebAuthn)                         | P1       |
| Microsoft OAuth + Apple Sign-In             | P1       |
| Enterprise SSO (SAML/OIDC)                  | P1       |
| Session Management (multi-device)           | P1       |
| Account Lockout + Brute-force Protection    | P0       |
| Device History + Suspicious Login Detection | P2       |
| Audit Trail (all auth events)               | P1       |
| Backup Recovery Codes                       | P1       |

---

## 1. Authentication State Machine

```
                         ┌──────────────────────────────────────────┐
                         │                                          │
                         ▼                                          │
                   ┌──────────┐                                     │
          ┌───────▶│ UNAUTH   │◀──────────── Logout / Expired      │
          │        └────┬─────┘                                     │
          │             │                                            │
          │     Register│  Login  MagicLink  OAuth                 │
          │             ▼                                            │
          │        ┌──────────┐                                     │
          │        │ AUTH'ING │ (in-flight API call)                │
          │        └────┬─────┘                                     │
          │             │                                            │
          │        ┌────┴──────────────────────────┐               │
          │        ▼                               ▼               │
          │  ┌──────────────┐             ┌──────────────┐        │
          │  │ EMAIL_PENDING │            │  MFA_PENDING  │        │
          │  │ (verify email)│            │ (enter TOTP)  │        │
          │  └──────┬───────┘             └──────┬───────┘        │
          │         │ Verified            TOTP │ valid            │
          │         ▼                            ▼                │
          │  ┌──────────────┐             ┌──────────────┐        │
          │  │ POST_SIGNUP  │             │ AUTHENTICATED│────────┘
          │  │ (profile +   │             │ (dashboard)  │
          │  │  workspace)  │             └──────────────┘
          │  └──────┬───────┘                    │
          │         │ Setup complete             │ Refresh fails
          │         ▼                            ▼
          │  ┌──────────────┐             ┌──────────────┐
          │  │ AUTHENTICATED│             │SESSION_EXPIRED│
          │  │ (dashboard)  │────────────▶│ (redirect to  │
          │  └──────┬───────┘             │  login)       │
          │         │                     └──────────────┘
          │         │ Too many failures
          │         ▼
          │  ┌──────────────┐
          │  │   LOCKED     │
          │  │ (time-based  │
          │  │  cooldown)   │
          │  └──────────────┘
          │
          │  ┌──────────────┐
          │  │  SUSPENDED   │  (admin action)
          │  └──────────────┘
          │
          └──┌──────────────┐
             │   DELETED    │  (30-day soft delete, recoverable)
             └──────────────┘
```

### State Transitions

| From            | To              | Trigger                                                    |
| --------------- | --------------- | ---------------------------------------------------------- |
| UNAUTH          | AUTHENTICATING  | User submits login/register/OAuth/Magic Link form          |
| AUTHENTICATING  | EMAIL_PENDING   | Registration success but email not verified                |
| AUTHENTICATING  | MFA_PENDING     | Login success but user has MFA enabled                     |
| AUTHENTICATING  | AUTHENTICATED   | Login success, no MFA, email verified                      |
| AUTHENTICATING  | UNAUTH          | Login/register fails (wrong credentials, rate limit, etc.) |
| EMAIL_PENDING   | AUTHENTICATED   | Email verified (via link or code)                          |
| EMAIL_PENDING   | POST_SIGNUP     | Email verified for new user, proceed to setup              |
| POST_SIGNUP     | AUTHENTICATED   | Profile + workspace setup complete                         |
| MFA_PENDING     | AUTHENTICATED   | TOTP code valid                                            |
| MFA_PENDING     | UNAUTH          | TOTP code invalid (after max retries) or user cancels      |
| MFA_PENDING     | LOCKED          | Too many failed MFA attempts                               |
| AUTHENTICATED   | UNAUTH          | User logs out                                              |
| AUTHENTICATED   | SESSION_EXPIRED | Access token expires, refresh fails                        |
| AUTHENTICATED   | LOCKED          | Too many failed actions (unusual but possible)             |
| SESSION_EXPIRED | UNAUTH          | Redirect to login page                                     |
| LOCKED          | UNAUTH          | Lockout cooldown expires                                   |
| SUSPENDED       | UNAUTH          | Admin reinstates account                                   |
| DELETED         | UNAUTH          | User recovers within 30 days                               |
| DELETED         | —               | Permanent after 30 days                                    |

---

## 2. Database Design

### Extended User Model (Prisma)

```prisma
model User {
  id                  String    @id @default(uuid())
  email               String    @unique
  emailVerified       Boolean   @default(false) @map("email_verified")
  emailVerifiedAt     DateTime? @map("email_verified_at")
  passwordHash        String?   @map("password_hash")      // null for OAuth-only users
  name                String
  avatarUrl           String?   @map("avatar_url")
  role                UserRole  @default(MEMBER)

  // Account status
  isActive            Boolean   @default(true) @map("is_active")
  suspendedAt         DateTime? @map("suspended_at")
  suspendedReason     String?   @map("suspended_reason")
  deletedAt           DateTime? @map("deleted_at")

  // Login tracking
  lastLoginAt         DateTime? @map("last_login_at")
  lastLoginIp         String?   @map("last_login_ip")
  lastLoginUserAgent  String?   @map("last_login_user_agent")
  loginCount          Int       @default(0) @map("login_count")

  // Brute-force protection
  failedLoginAttempts   Int       @default(0) @map("failed_login_attempts")
  lastFailedLoginAt     DateTime? @map("last_failed_login_at")
  lockedUntil           DateTime? @map("locked_until")

  // MFA
  mfaEnabled          Boolean   @default(false) @map("mfa_enabled")
  totpSecret          String?   @map("totp_secret")          // Encrypted at rest
  backupCodesHash     String?   @map("backup_codes_hash")     // JSON array of SHA-256 hashes

  // Password reset
  resetTokenHash      String?   @map("reset_token_hash")
  resetTokenExpiresAt DateTime? @map("reset_token_expires_at")

  // Email verification
  verificationTokenHash    String?   @map("verification_token_hash")
  verificationTokenExpires DateTime? @map("verification_token_expires")

  // Token management
  refreshTokenHash    String?   @map("refresh_token_hash")     // Current session (single-device MVP)

  // Preferences
  preferences         Json      @default("{}")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  oauthAccounts       OAuthAccount[]
  sessions            Session[]
  recoveryCodes       RecoveryCode[]
  ownedWorkspaces     Workspace[]       @relation("WorkspaceOwner")
  memberships         WorkspaceMember[]
  ownedProjects       Project[]         @relation("ProjectOwner")
  notifications       Notification[]
  invitations         Invitation[]      @relation("InvitationInvitee")
  auditEntries        AuditEntry[]

  @@index([email])
  @@index([role])
  @@index([deletedAt])
  @@index([lockedUntil])
  @@map("users")
}
```

### Session Model (Multi-Device — Phase 4)

```prisma
model Session {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshTokenHash   String   @map("refresh_token_hash")
  deviceName         String?  @map("device_name")      // "Chrome on macOS", "Safari on iPhone"
  deviceType         String?  @map("device_type")      // "browser", "mobile", "desktop"
  ipAddress          String?  @map("ip_address")
  userAgent          String?  @map("user_agent")
  lastUsedAt         DateTime @default(now()) @map("last_used_at")
  expiresAt          DateTime @map("expires_at")
  revokedAt          DateTime? @map("revoked_at")
  createdAt          DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([refreshTokenHash])
  @@index([revokedAt])
  @@map("sessions")
}
```

### OAuth Account Model (Phase 4)

```prisma
model OAuthAccount {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider        String                           // "google", "github", "microsoft", "apple"
  providerUserId  String   @map("provider_user_id")  // Provider's unique user ID
  accessToken     String?  @map("access_token")       // Encrypted at rest
  refreshToken    String?  @map("refresh_token")      // Encrypted at rest
  tokenExpiresAt  DateTime? @map("token_expires_at")
  email           String?                            // Email from provider (may differ from user.email)
  name            String?                            // Display name from provider
  avatarUrl       String?  @map("avatar_url")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@unique([provider, providerUserId])
  @@index([userId, provider])
  @@map("oauth_accounts")
}
```

### Recovery Code Model (Phase 5)

```prisma
model RecoveryCode {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  codeHash  String   @map("code_hash")    // SHA-256 of recovery code
  used      Boolean  @default(false)
  usedAt    DateTime? @map("used_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId, used])
  @@map("recovery_codes")
}
```

### Device History Model (Phase 5)

```prisma
model DeviceHistory {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event       String                              // "login", "login_failed", "logout", "mfa_challenge", "mfa_success", "mfa_failed"
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  deviceName  String?  @map("device_name")
  location    String?                              // GeoIP: "San Francisco, US"
  success     Boolean
  failureReason String? @map("failure_reason")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([userId, createdAt])
  @@index([createdAt])
  @@map("device_history")
}
```

### New Enums

```prisma
enum UserRole {
  SUPER_ADMIN
  ADMIN
  MEMBER
}

enum AuditAction {
  USER_REGISTERED
  USER_LOGGED_IN
  USER_LOGGED_OUT
  LOGIN_FAILED
  PASSWORD_CHANGED
  PASSWORD_RESET_REQUESTED
  PASSWORD_RESET_COMPLETED
  EMAIL_VERIFIED
  EMAIL_CHANGED
  MFA_ENABLED
  MFA_DISABLED
  MFA_FAILED
  OAUTH_CONNECTED
  OAUTH_DISCONNECTED
  SESSION_REVOKED
  ACCOUNT_LOCKED
  ACCOUNT_UNLOCKED
  ACCOUNT_SUSPENDED
  ACCOUNT_REINSTATED
  ACCOUNT_DELETED
  PROFILE_UPDATED
  WORKSPACE_CREATED
  WORKSPACE_JOINED
}
```

### Audit Entry Model (Phase 4)

```prisma
model AuditEntry {
  id           String      @id @default(uuid())
  userId       String      @map("user_id")
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  action       AuditAction
  resourceType String?     @map("resource_type")    // "user", "workspace", "session"
  resourceId   String?     @map("resource_id")
  metadata     Json        @default("{}")
  ipAddress    String?     @map("ip_address")
  userAgent    String?     @map("user_agent")
  createdAt    DateTime    @default(now()) @map("created_at")

  @@index([userId, createdAt])
  @@index([action])
  @@index([createdAt])
  @@map("audit_entries")
}
```

---

## 3. API Design

### Complete API Surface

```
Authentication:
  POST   /api/v1/auth/register              — Create account (email + password)
  POST   /api/v1/auth/login                 — Sign in (email + password)
  POST   /api/v1/auth/refresh               — Refresh access token
  POST   /api/v1/auth/logout                — Sign out (invalidate session)
  GET    /api/v1/auth/me                    — Get current user

Email Verification:
  POST   /api/v1/auth/verify-email/send     — Send verification email
  POST   /api/v1/auth/verify-email/confirm  — Confirm email with token
  GET    /api/v1/auth/verify-email/status   — Check verification status

Password Reset:
  POST   /api/v1/auth/forgot-password       — Request reset email
  POST   /api/v1/auth/reset-password        — Reset with token
  POST   /api/v1/auth/change-password       — Change password (authenticated)

Magic Link:
  POST   /api/v1/auth/magic-link/send       — Send magic link email
  POST   /api/v1/auth/magic-link/verify     — Verify magic link token

OAuth:
  GET    /api/v1/auth/oauth/:provider       — Initiate OAuth flow
  GET    /api/v1/auth/oauth/:provider/callback — OAuth callback
  POST   /api/v1/auth/oauth/disconnect/:provider — Disconnect OAuth provider
  GET    /api/v1/auth/oauth/accounts        — List connected OAuth accounts

MFA / 2FA:
  POST   /api/v1/auth/mfa/enroll            — Generate TOTP secret + QR code
  POST   /api/v1/auth/mfa/verify            — Verify TOTP code to enable
  POST   /api/v1/auth/mfa/disable           — Disable MFA
  POST   /api/v1/auth/mfa/challenge         — Verify TOTP during login
  GET    /api/v1/auth/mfa/recovery-codes    — View/download recovery codes
  POST   /api/v1/auth/mfa/recovery-codes/regenerate — Regenerate codes

Passkeys / WebAuthn:
  POST   /api/v1/auth/passkey/register/begin    — Start registration
  POST   /api/v1/auth/passkey/register/complete — Complete registration
  POST   /api/v1/auth/passkey/auth/begin        — Start authentication
  POST   /api/v1/auth/passkey/auth/complete     — Complete authentication

Sessions:
  GET    /api/v1/auth/sessions              — List active sessions
  DELETE /api/v1/auth/sessions/:id          — Revoke specific session
  DELETE /api/v1/auth/sessions              — Revoke all sessions ("Log out everywhere")

Account Management:
  PATCH  /api/v1/auth/profile              — Update name, avatar
  POST   /api/v1/auth/change-email         — Change email (requires password)
  DELETE /api/v1/auth/account              — Delete account (soft delete)
  POST   /api/v1/auth/account/recover      — Recover account within 30 days

Enterprise SSO:
  POST   /api/v1/auth/sso/:orgId           — Initiate SAML/OIDC flow
  POST   /api/v1/auth/sso/:orgId/callback  — SSO callback

Invitations:
  POST   /api/v1/invitations/:token/accept — Accept workspace invitation
  GET    /api/v1/invitations/:token        — View invitation details
```

### Detailed API Specifications

#### Register

```
POST /api/v1/auth/register
Content-Type: application/json

Payload:
{
  "name": "Jane Smith",              // Required. 2-100 chars.
  "email": "jane@example.com",       // Required. Valid email format.
  "password": "SecurePass123!",      // Required. Min 8 chars, mixed case, number/symbol.
  "acceptTerms": true                // Required. Must be true.
}

Validation (Zod):
  name:         z.string().min(2).max(100)
  email:        z.string().email().max(255).transform(v => v.toLowerCase())
  password:     z.string().min(8).max(128)
                .regex(/[A-Z]/, "Must contain uppercase letter")
                .regex(/[a-z]/, "Must contain lowercase letter")
                .regex(/[0-9]/, "Must contain a number")
                .regex(/[^A-Za-z0-9]/, "Must contain a special character")
  acceptTerms:  z.literal(true, { message: "You must accept the terms" })

Business Logic:
  1. Check rate limit: max 3 registrations per IP per hour
  2. Check email uniqueness (case-insensitive)
     - If email exists AND deletedAt is set → suggest recovery
     - If email exists AND isActive → return 409
  3. Hash password: bcrypt(input.password, 12)
  4. Create user with emailVerified: false
  5. Generate verification token (crypto.randomBytes(32).toString('hex'))
  6. Store SHA-256(verificationToken) + expiresAt (24 hours)
  7. Send verification email (async, fire-and-forget)
  8. Generate JWT tokens (access + refresh)
  9. Store SHA-256(refreshToken) on user
  10. Create default Workspace (PERSONAL) via onboarding service
  11. Set auth cookies
  12. Log audit: USER_REGISTERED
  13. Track analytics: signup_completed

Success Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "MEMBER",
      "emailVerified": false,
      "createdAt": "2026-07-21T10:00:00Z"
    },
    "expiresIn": 604800
  }
}
// Sets cookies: accessToken, refreshToken

Error Response (409 — Email exists):
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "An account with this email already exists",
    "suggestion": "Try logging in instead, or reset your password."
  }
}

Error Response (429 — Rate limited):
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many registration attempts",
    "retryAfter": 3600
  }
}

Error Response (400 — Validation):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "password", "message": "Must contain a special character" },
      { "field": "acceptTerms", "message": "You must accept the terms" }
    ]
  }
}
```

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

Payload:
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
  // Optional:
  "rememberDevice": true             // Extends session duration to 90 days
}

Business Logic:
  1. Check global rate limit: 5 attempts per IP per 15 minutes
  2. Find user by email (case-insensitive)
     - If not found → return 401 (same message as wrong password — don't reveal existence)
  3. Check account status:
     - !isActive → 401 "Account is deactivated"
     - lockedUntil > now → 423 "Account temporarily locked. Try again in X minutes."
     - deletedAt → 404 (or 401 to avoid enumeration)
  4. Compare password: bcrypt.compare(input.password, user.passwordHash)
     - If mismatch → increment failedLoginAttempts
     - If failedLoginAttempts >= 5 → set lockedUntil = now + 15 minutes
     - If failedLoginAttempts >= 10 → set lockedUntil = now + 1 hour
     - If failedLoginAttempts >= 20 → set lockedUntil = now + 24 hours (manual unlock by admin)
     - Track analytics: login_failure
     - Return 401 "Invalid email or password"
  5. If password match:
     - Reset failedLoginAttempts to 0
     - Clear lockedUntil
     - Update lastLoginAt, lastLoginIp, lastLoginUserAgent, loginCount++
  6. Check MFA:
     - If user.mfaEnabled → return 200 with requiresMfa: true (do NOT issue tokens yet)
     - If !user.mfaEnabled → proceed to step 7
  7. Generate JWT tokens (access + refresh)
  8. Create Session record (multi-device) OR update refreshTokenHash (single-device)
  9. Set auth cookies
  10. Record DeviceHistory: LOGIN
  11. Log audit: USER_LOGGED_IN
  12. Track analytics: login_success
  13. Check suspicious login (new IP, new device) → send email notification

Success Response (200 — No MFA):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "MEMBER",
      "emailVerified": true,
      "lastLoginAt": "2026-07-21T14:00:00Z"
    },
    "expiresIn": 604800,
    "requiresMfa": false
  }
}
// Sets cookies: accessToken, refreshToken

Success Response (200 — MFA Required):
{
  "success": true,
  "data": {
    "requiresMfa": true,
    "mfaToken": "temp-token-for-mfa-verification",  // Short-lived (5 min) single-use token
    "expiresIn": 300
  }
}
// Does NOT set auth cookies. Client must POST /auth/mfa/challenge

Error Response (401 — Wrong credentials):
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
// Same message whether email doesn't exist OR password is wrong (prevents enumeration)

Error Response (423 — Account locked):
{
  "success": false,
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Account temporarily locked due to too many failed attempts",
    "lockedUntil": "2026-07-21T14:15:00Z",
    "remainingSeconds": 847
  }
}

Error Response (429 — Rate limited):
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many login attempts. Try again in 12 minutes.",
    "retryAfter": 720
  }
}
```

#### Refresh Token

```
POST /api/v1/auth/refresh
Cookie: refreshToken={token}
// Or body: { "refreshToken": "..." }

Business Logic:
  1. Extract refresh token from cookie or body
  2. JWT verify (checks expiry + signature)
  3. Decode userId from payload
  4. Find user by ID
  5. Compare SHA-256(presented token) with stored refreshTokenHash
     - If mismatch → TOKEN REUSE DETECTED
       → Revoke ALL sessions for user (clear all refreshTokenHash + Session records)
       → Log audit: SESSION_REVOKED (all)
       → Track analytics: token_reuse_detected
       → Return 401 "Session revoked. Please log in again."
  6. Generate NEW token pair
  7. Replace stored refreshTokenHash with SHA-256(new refreshToken)
  8. Update Session record (or user.refreshTokenHash for single-device)
  9. Set new cookies
  10. Log device history

Success Response (200):
{
  "success": true,
  "data": {
    "expiresIn": 604800
  }
}

Error Response (401 — Token reuse detected):
{
  "success": false,
  "error": {
    "code": "TOKEN_REVOKED",
    "message": "Session revoked for security. Please log in again.",
    "suggestion": "All sessions have been invalidated due to a potential security issue."
  }
}
```

#### Logout

```
POST /api/v1/auth/logout
Authorization: Bearer {accessToken}
Cookie: accessToken={token}

Business Logic:
  1. Verify access token
  2. Extract userId
  3. Clear refreshTokenHash on user (single-device) OR revoke specific Session (multi-device)
  4. Clear auth cookies
  5. Log audit: USER_LOGGED_OUT
  6. Record DeviceHistory: LOGOUT

Success Response (200):
{ "success": true, "data": { "message": "Logged out successfully" } }
```

#### Get Current User

```
GET /api/v1/auth/me
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "MEMBER",
    "emailVerified": true,
    "mfaEnabled": true,
    "avatarUrl": null,
    "preferences": { "theme": "system" },
    "lastLoginAt": "2026-07-21T14:00:00Z",
    "loginCount": 47,
    "createdAt": "2026-06-01T10:00:00Z",
    "oauthAccounts": ["google"]
  }
}
```

#### Send Verification Email

```
POST /api/v1/auth/verify-email/send
Authorization: Bearer {accessToken}

Business Logic:
  1. Rate limit: 1 per 2 minutes per user
  2. If email already verified → 200 "Email already verified" (idempotent)
  3. Generate verification token (crypto.randomBytes(32).toString('hex'))
  4. Store SHA-256(token) + expiresAt (24h) on user
  5. Send email with verification link: https://app.promptpilot.dev/verify-email?token={token}
  6. Track analytics: verification_email_sent

Response (200):
{
  "success": true,
  "data": {
    "message": "Verification email sent",
    "expiresAt": "2026-07-22T10:00:00Z"
  }
}
```

#### Confirm Email

```
POST /api/v1/auth/verify-email/confirm
Content-Type: application/json

Payload:
{ "token": "abc123..." }

Business Logic:
  1. Find user by SHA-256(token) matching verificationTokenHash
  2. Check token not expired
  3. Set emailVerified = true, emailVerifiedAt = now
  4. Clear verificationTokenHash + verificationTokenExpires
  5. Log audit: EMAIL_VERIFIED
  6. Track analytics: verification_completed

Response (200):
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "emailVerified": true
  }
}

Error (400 — Expired):
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Verification link has expired. Request a new one."
  }
}
```

#### Forgot Password

```
POST /api/v1/auth/forgot-password
Content-Type: application/json

Payload:
{ "email": "jane@example.com" }

Business Logic:
  1. Rate limit: 1 per 5 minutes per email + 3 per IP per hour
  2. Find user by email
     - If NOT found → return 200 with generic success message (don't reveal existence)
     - If found but OAuth-only (no passwordHash) → return 200 ("If an account exists, check your email")
  3. Check account status (suspended, deleted)
  4. Generate reset token (crypto.randomBytes(40).toString('hex'))
  5. Store SHA-256(token) + expiresAt (15 minutes) on user
  6. Send email with reset link: https://app.promptpilot.dev/reset-password?token={token}
  7. Log audit: PASSWORD_RESET_REQUESTED
  8. Track analytics: password_reset_requested
  9. ALWAYS return 200 (same message — prevents email enumeration)

Response (200):
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, we've sent a password reset link."
  }
}
```

#### Reset Password

```
POST /api/v1/auth/reset-password
Content-Type: application/json

Payload:
{
  "token": "abc123...",
  "password": "NewSecurePass123!"
}

Business Logic:
  1. Find user by SHA-256(token) matching resetTokenHash
  2. Check token not expired (15 minutes)
  3. Validate new password (same rules as registration)
  4. Check new password ≠ old password
  5. Hash new password
  6. Update passwordHash
  7. Clear resetTokenHash + resetTokenExpiresAt
  8. Invalidate ALL sessions: clear refreshTokenHash + DELETE all Sessions
  9. Log audit: PASSWORD_RESET_COMPLETED
  10. Track analytics: password_reset_completed
  11. Send email notification: "Your password was changed"
  12. Generate new JWT tokens (auto-login after reset)
  13. Set auth cookies

Response (200):
{
  "success": true,
  "data": {
    "message": "Password reset successfully",
    "expiresIn": 604800
  }
}

Error (401 — Token used or expired):
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Reset link has expired or already been used. Request a new one."
  }
}
```

#### Magic Link — Send

```
POST /api/v1/auth/magic-link/send
Content-Type: application/json

Payload:
{ "email": "jane@example.com" }

Business Logic:
  1. Rate limit: 1 per 2 minutes per email
  2. Find user by email or create placeholder
  3. Generate magic link token (crypto.randomBytes(40).toString('hex'))
  4. Store SHA-256(token) + expiresAt (10 minutes) on user
  5. Send email with link: https://app.promptpilot.dev/magic-link?token={token}
  6. ALWAYS return 200 (prevents enumeration)

Response (200):
{
  "success": true,
  "data": {
    "message": "If an account with that email exists, we've sent a magic link."
  }
}
```

#### Magic Link — Verify

```
POST /api/v1/auth/magic-link/verify
Content-Type: application/json

Payload:
{ "token": "abc123..." }

Business Logic:
  1. Find user by SHA-256(token) matching magicTokenHash
  2. Check token not expired (10 minutes)
  3. Clear magicTokenHash + magicTokenExpires
  4. Auto-verify email if not already verified
  5. Generate JWT tokens
  6. Set auth cookies
  7. Log audit: USER_LOGGED_IN (magic_link)

Response (200):
{
  "success": true,
  "data": {
    "user": { ... },
    "expiresIn": 604800,
    "newAccount": false    // true if user was just created
  }
}
```

#### MFA Enroll

```
POST /api/v1/auth/mfa/enroll
Authorization: Bearer {accessToken}

Business Logic:
  1. Generate TOTP secret: speakeasy.generateSecret({ name: "PromptPilot:user@email" })
  2. Store secret encrypted (AES-256-GCM with key from env) on user.totpSecret
  3. Generate otpauth URL
  4. Generate QR code data URL
  5. Generate 10 recovery codes
  6. Store SHA-256 of each code in recoveryCodes table
  7. Do NOT enable MFA yet (requires verify step)

Response (200):
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",          // Base32 secret for manual entry
    "otpauthUrl": "otpauth://totp/PromptPilot:jane@example.com?secret=JBSWY3DPEHPK3PXP&issuer=PromptPilot",
    "qrCodeDataUrl": "data:image/png;base64,..."
  }
}
```

#### MFA Verify (Enable)

```
POST /api/v1/auth/mfa/verify
Authorization: Bearer {accessToken}

Payload:
{ "code": "123456" }

Business Logic:
  1. Decrypt user.totpSecret
  2. speakeasy.totp.verify({ secret, token: code, window: 1 })
  3. If valid:
     - Set user.mfaEnabled = true
     - Create 10 RecoveryCode records (SHA-256 hashes)
     - Log audit: MFA_ENABLED
     - Return recovery codes (ONLY TIME they are shown in plaintext)
  4. If invalid: return 400

Response (200):
{
  "success": true,
  "data": {
    "mfaEnabled": true,
    "recoveryCodes": [
      "aaaaa-bbbbb-ccccc",
      "ddddd-eeeee-fffff",
      "..."
    ]
  }
}
```

#### MFA Challenge (during login)

```
POST /api/v1/auth/mfa/challenge

Payload:
{
  "mfaToken": "temp-token-from-login",
  "code": "123456"
}

Business Logic:
  1. Verify mfaToken (short-lived, 5 minutes)
  2. Extract userId from mfaToken
  3. Decrypt user.totpSecret
  4. speakeasy.totp.verify({ secret, token: code, window: 1 })
  5. If valid:
     - Generate JWT tokens
     - Set cookies
     - Reset failed MFA attempts
     - Record DeviceHistory: MFA_SUCCESS
     - Log audit: USER_LOGGED_IN (with MFA)
  6. If invalid:
     - Increment mfaFailedAttempts
     - If >= 5 → lock account temporarily
     - Record DeviceHistory: MFA_FAILED
     - Return 401

Response (200):
{
  "success": true,
  "data": {
    "user": { ... },
    "expiresIn": 604800
  }
}
```

#### List Sessions

```
GET /api/v1/auth/sessions
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "deviceName": "Chrome on macOS",
        "deviceType": "desktop",
        "ipAddress": "203.0.113.1",
        "location": "San Francisco, US",
        "lastUsedAt": "2026-07-21T14:00:00Z",
        "createdAt": "2026-07-15T10:00:00Z",
        "isCurrent": true        // true if this matches the current request's session
      },
      {
        "id": "uuid",
        "deviceName": "Safari on iPhone",
        "deviceType": "mobile",
        "ipAddress": "198.51.100.1",
        "location": "New York, US",
        "lastUsedAt": "2026-07-20T09:00:00Z",
        "createdAt": "2026-07-10T08:00:00Z",
        "isCurrent": false
      }
    ]
  }
}
```

#### Delete Account

```
DELETE /api/v1/auth/account
Authorization: Bearer {accessToken}

Payload:
{
  "password": "SecurePass123!",       // Required for password users
  "confirmation": "DELETE"            // User must type "DELETE"
}

Business Logic:
  1. Require password verification (or OAuth re-auth)
  2. Require confirmation text match
  3. Soft-delete: set deletedAt = now
  4. Revoke all sessions
  5. Clear auth cookies
  6. Log audit: ACCOUNT_DELETED
  7. Schedule permanent deletion: 30 days
  8. Send email: "Your account has been deleted. Recover within 30 days."

Response (200):
{
  "success": true,
  "data": {
    "message": "Account deleted. It can be recovered within 30 days by logging in."
  }
}
```

---

## 4. Rate Limiting & Brute-Force Protection

### Rate Limit Configuration

```
Endpoint                       Window      Max Requests   Per
─────────────────────────────────────────────────────────────────
POST /auth/register            1 hour      3              IP
POST /auth/login               15 min      5              IP + email
POST /auth/refresh             1 min       10             IP
POST /auth/forgot-password     5 min       1              email
POST /auth/forgot-password     1 hour      3              IP
POST /auth/magic-link/send     2 min       1              email
POST /auth/verify-email/send   2 min       1              user
POST /auth/mfa/challenge       15 min      5              user
POST /auth/reset-password      15 min      3              IP
Global (all auth)              15 min      100            IP
```

### Progressive Delay (Failed Login)

```
Attempt 1-4:   No delay (just counter increment)
Attempt 5:     15-minute lockout
Attempt 6-9:   15-minute lockout (counter continues)
Attempt 10:    1-hour lockout
Attempt 11-19: 1-hour lockout
Attempt 20+:   24-hour lockout (manual admin unlock)
```

### IP-based Throttling

```
Implementation:       Redis or in-memory store with sliding window
Key pattern:          ratelimit:{endpoint}:{ip}:{window}
Response headers:     X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
429 body:             { code: "RATE_LIMITED", retryAfter: seconds }
```

### Suspicious Login Detection

```
Triggers:
  - Login from new IP address (significantly different from usual)
  - Login from new device/browser
  - Login from unusual location (GeoIP distance > 500km from usual)
  - Login at unusual time (2am-5am local time)

Action:
  - Send email notification: "New sign-in from {location} on {device}"
  - Option: Require MFA if enabled
  - Record DeviceHistory with suspicious: true flag
  - Show banner on next login: "Is this you? New sign-in from Chrome in Berlin."

Future: Adaptive risk scoring (ML-based)
```

---

## 5. Screen Specifications

### 5.1 Sign Up Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT (min-h-screen, bg-neutral-50)                   │
│                                                               │
│  ┌──────────────────────────┐                                │
│  │  [← Back to home]        │  (top-left, ghost button)      │
│  └──────────────────────────┘                                │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], mx-auto,         │              │
│  │  bg-white, rounded-xl, shadow-md, p-8)      │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │          [PromptPilot Logo]            │ │              │
│  │  │          (centered, h-8)               │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  Create your account                  │ │              │
│  │  │  (h2, text-2xl, bold, neutral-900)    │ │              │
│  │  │                                       │ │              │
│  │  │  Start building with PromptPilot      │ │              │
│  │  │  (p, text-sm, neutral-500)            │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  OAUTH BUTTONS (social login)         │ │              │
│  │  │                                       │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │  G  Continue with Google         │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  │                                       │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │  GH Continue with GitHub         │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  │                                       │ │              │
│  │  │  ───────── OR CONTINUE WITH ───────── │ │              │
│  │  │  (divider with text, neutral-300)    │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ERROR BANNER (conditional)            │ │              │
│  │  │  bg-red-50, border-red-200, red-700  │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  Full Name*                           │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │ Your full name                   │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  │                                       │ │              │
│  │  │  Email*                               │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │ you@example.com                  │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  │                                       │ │              │
│  │  │  Password*                            │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │ ••••••••••••            👁      │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  │                                       │ │              │
│  │  │  [████████░░░░░░░░] Strong           │ │              │
│  │  │  (password strength meter)           │ │              │
│  │  │  • At least 8 characters             │ │              │
│  │  │  • One uppercase letter  ✓           │ │              │
│  │  │  • One lowercase letter  ✓           │ │              │
│  │  │  • One number  ✓                     │ │              │
│  │  │  • One special character  ✗          │ │              │
│  │  │                                       │ │              │
│  │  │  Confirm Password*                    │ │              │
│  │  │  ┌─────────────────────────────────┐ │ │              │
│  │  │  │ ••••••••••••                    │ │ │              │
│  │  │  └─────────────────────────────────┘ │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ☐ I agree to the Terms of Service   │ │              │
│  │  │    and Privacy Policy                 │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │         Create Account                │ │              │
│  │  │         (primary btn, full-w, lg)     │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Already have an account? Sign in          │              │
│  │  (text-sm, neutral-500, link to /login)   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:**

- **Business:** Convert visitors into registered users with minimal friction while collecting necessary data for personalization
- **User:** Create an account quickly to access PromptPilot's features
- **Security:** Validate identity, enforce password strength, prevent automated signups

**User Flow:**

- **Entry:** Landing page "Start Free" CTA, any "Get Started" button, `/register` URL, OAuth redirect from Google/GitHub
- **Exit:** On success → Email Verification (if enabled) or Dashboard (if email verification disabled). On OAuth → Dashboard directly.
- **Navigation:** "Sign in" link → `/login`. "Back to home" → `/`. Logo → `/`.

**Form Validation (Real-time on blur/type):**

```
Name:
  Required:     "Name is required"
  Min length:   2 chars ("Name must be at least 2 characters")
  Max length:   100 chars
  Pattern:      Any Unicode letter + spaces + hyphens + apostrophes

Email:
  Required:     "Email is required"
  Format:       /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  Max length:   255 chars
  Normalization: Lowercase before submission
  Async check:  Debounced (500ms) uniqueness check against API: "This email is already registered"

Password:
  Required:     "Password is required"
  Min length:   8 chars
  Max length:   128 chars
  Rules:        At least one: uppercase, lowercase, number, special character
  Real-time:    Strength meter updates on every keystroke

Confirm Password:
  Match:        Must equal password field ("Passwords do not match")

Terms:
  Required:     Must be checked ("You must accept the terms to continue")
```

**Password Strength Meter:**

```
Visual: 4-segment bar below password field
Colors: Red → Orange → Yellow → Green (gradient fill)

Scoring:
  0-25%:  Weak    (0-1 rules met)            — Red bar, "Weak"
  25-50%: Fair    (2 rules met)              — Orange bar, "Fair"
  50-75%: Good    (3 rules met)              — Yellow bar, "Good"
  75-100%: Strong (4+ rules met, 12+ chars)  — Green bar, "Strong"

Rules checklist below the bar:
  • At least 8 characters         ✓ (green check or ○ empty)
  • One uppercase letter          ✓
  • One lowercase letter          ○
  • One number                    ○
  • One special character         ○

Animation: Bar width transitions (300ms, ease-out). Checkmarks spring in.
```

**OAuth Buttons:**

```
Google Button:
  ┌──────────────────────────────────────────┐
  │  [G icon]  Continue with Google           │
  └──────────────────────────────────────────┘
  bg-white, border-neutral-200, text-neutral-700
  Hover: bg-neutral-50, border-neutral-300
  Icon: Google "G" logo (SVG, 20x20)

GitHub Button:
  ┌──────────────────────────────────────────┐
  │  [GH icon] Continue with GitHub           │
  └──────────────────────────────────────────┘
  bg-neutral-900, text-white
  Hover: bg-neutral-800
  Icon: GitHub mark (SVG, 20x20, white)

Microsoft Button:
  ┌──────────────────────────────────────────┐
  │  [MS icon] Continue with Microsoft        │
  └──────────────────────────────────────────┘
  bg-white, border-neutral-200, text-neutral-700
  Hover: bg-neutral-50

Apple Button:
  ┌──────────────────────────────────────────┐
  │  [Apple icon] Sign in with Apple          │
  └──────────────────────────────────────────┘
  bg-black, text-white
  Hover: bg-neutral-900
  (Shown on iOS/macOS only — detect via user agent)

Layout: Stacked vertically, 12px gap. Full-width.
Order: Google → GitHub → Microsoft → Apple (most-used first)
```

### 5.2 Login Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │          [PromptPilot Logo]            │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Sign In                                   │              │
│  │  Welcome back to PromptPilot               │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  OAUTH BUTTONS (same as signup)       │ │              │
│  │  │  ───────── OR ─────────               │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ERROR BANNER (conditional)                │              │
│  │                                             │              │
│  │  Email                                     │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ you@example.com                      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Password                                  │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ ••••••••••                  👁      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌──────────────────┐  ┌────────────────┐  │              │
│  │  │ ☐ Remember me     │  │ Forgot password?│  │              │
│  │  │ (text-sm, neut-500│  │ (text-sm, indigo│  │              │
│  │  │  checkbox)        │  │  link)          │  │              │
│  │  └──────────────────┘  └────────────────┘  │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Sign In                      │   │              │
│  │  │         (primary btn, full-w)        │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Don't have an account? Create one          │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:**

- **Business:** Authenticate returning users. The primary entry point for existing accounts.
- **User:** Access PromptPilot workspace and resume work.
- **Security:** Verify credentials, detect suspicious activity, enforce MFA if enabled.

**User Flow:**

- **Entry:** Landing page "Sign In" link, middleware redirect from protected route, direct URL `/login`
- **Exit:** On success → Dashboard (redirect to original protected route if applicable). On MFA enabled → MFA Verification screen.
- **Navigation:** "Create one" → `/register`. "Forgot password?" → `/forgot-password`. Logo → `/`.

**Remember Me:**

```
Checked:   Sets refresh token expiry to 90 days (instead of 30)
Unchecked: Standard 30-day refresh token
Implementation: "rememberMe" boolean in login payload.
              Server adjusts token expiry accordingly.
              NOT a persistent "stay logged in" — just extended session.
```

**States:**

```
IDLE:         Clean form, empty fields
AUTHENTICATING: Button spinner, inputs disabled
ERROR:        Red error banner. Messages:
              - "Invalid email or password" (generic, prevents enumeration)
              - "Account locked. Try again in 14 minutes."
              - "Too many attempts. Try again in 12 minutes." (rate limit)
              - "Network error. Check your connection."
LOCKED:       423 response. Banner with countdown timer. Form disabled.
SUSPENDED:    "This account has been suspended. Contact support."
DELETED:      "This account has been deleted. Log in within 30 days to recover."
SUCCESS:      Brief flash → redirect to dashboard
MFA_REQUIRED: Redirect to MFA Verification screen
```

### 5.3 Forgot Password Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  Forgot Password?                           │              │
│  │  Enter your email and we'll send you a      │              │
│  │  link to reset your password.               │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  SUCCESS BANNER (after submit)         │ │              │
│  │  │  bg-green-50, border-green-200        │ │              │
│  │  │  "If an account exists, check your    │ │              │
│  │  │   email for the reset link."          │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ERROR BANNER (rate limit only)       │ │              │
│  │  │  "Too many requests. Try again in X." │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Email                                      │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ you@example.com                      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Send Reset Link              │   │              │
│  │  │         (primary btn, full-w)        │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ← Back to Sign In                          │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  MAGIC LINK WAITING STATE (after submit):                     │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │         ✉️ (envelope icon, large)           │              │
│  │                                             │              │
│  │  Check your email                           │              │
│  │                                             │              │
│  │  We sent a password reset link to           │              │
│  │  j•••@example.com                          │              │
│  │                                             │              │
│  │  Didn't receive the email? Check spam       │              │
│  │  or [Resend email] (with cooldown timer)    │              │
│  │                                             │              │
│  │  ← Back to Sign In                          │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Security Notes:**

- Always return 200 with success message regardless of whether email exists (prevents enumeration)
- Rate limit per email (1 per 5 min) AND per IP (3 per hour)
- Reset token: 40 random bytes, SHA-256 stored, 15-minute expiry
- Email contains: `https://app.promptpilot.dev/reset-password?token={token}`
- Reset link is single-use. Once used or expired, token is cleared.

### 5.4 Reset Password Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  INVALID TOKEN STATE                  │ │              │
│  │  │  ⚠️ This reset link has expired or    │ │              │
│  │  │    already been used.                 │ │              │
│  │  │    [Request a new reset link →]       │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Create New Password                        │              │
│  │  Choose a strong password for your account. │              │
│  │                                             │              │
│  │  New Password                               │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ ••••••••••                  👁      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │  [Password strength meter]                  │              │
│  │  [Rules checklist]                          │              │
│  │                                             │              │
│  │  Confirm New Password                       │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ ••••••••••                          │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Reset Password               │   │              │
│  │  │         (primary btn, full-w)        │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  SUCCESS STATE (after reset):                                 │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD                                  │              │
│  │                                             │              │
│  │         ✓ (checkmark, green, animated)      │              │
│  │                                             │              │
│  │  Password Reset Successfully                │              │
│  │  You've been signed in with your new        │              │
│  │  password.                                  │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Go to Dashboard →           │   │              │
│  │  │         (primary btn)               │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 5.5 Email Verification Screen (Post-Signup)

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │         ✉️ (envelope icon, 64px, animated)  │              │
│  │                                             │              │
│  │  Verify Your Email                          │              │
│  │                                             │              │
│  │  We've sent a verification link to          │              │
│  │  jane@example.com                           │              │
│  │                                             │              │
│  │  Click the link in the email to verify      │              │
│  │  your account and continue.                 │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │  Resend email (available in 01:42)   │   │              │
│  │  │  (secondary btn, full-w, disabled)   │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │  Continue to Dashboard →            │   │              │
│  │  │  (ghost btn, full-w)                │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Wrong email? [Change email]               │              │
│  │  (text-sm, link)                           │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  EMAIL VERIFIED STATE (after clicking link, returning):       │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD                                  │              │
│  │                                             │              │
│  │         ✓ (green checkmark, spring anim)    │              │
│  │                                             │              │
│  │  Email Verified!                            │              │
│  │  Your email has been verified successfully. │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │  Continue →                          │   │              │
│  │  │  (primary btn)                      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  VERIFY MAGIC LINK SCREEN (when clicking link from email):    │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD                                  │              │
│  │                                             │              │
│  │  ⟳ Verifying your email...                 │              │
│  │  (spinner + text, auto-verify)              │              │
│  │                                             │              │
│  │  On success: auto-redirect to dashboard     │              │
│  │  On failure: show error with retry option   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 5.6 MFA Verification Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ← Back to Sign In                    │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │           🔐 (lock icon, 48px)         │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Two-Factor Authentication                  │              │
│  │  Enter the 6-digit code from your            │              │
│  │  authenticator app.                         │              │
│  │                                             │              │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐     │              │
│  │  │   │ │   │ │   │ │   │ │   │ │   │     │              │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘     │              │
│  │  (6 individual OTP inputs, auto-advance)    │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ERROR: Invalid code. 2 attempts left. │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Verify                      │   │              │
│  │  │         (primary btn, full-w)       │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Lost access? Use a recovery code →        │              │
│  │  (text-sm, link to backup code screen)     │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  OTP INPUT BEHAVIOR:                                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                       │
│  │ 1 │ │ 2 │ │ 3 │ │   │ │   │ │   │                       │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                       │
│    Focus automatically advances to next input                 │
│    Backspace on empty input moves to previous                 │
│    Paste supported (pastes across all 6)                     │
│    Auto-submit when all 6 filled (no button press needed)    │
│    Duration: 5 minutes max for entire challenge              │
│    Error shake on invalid code + clear all inputs            │
└──────────────────────────────────────────────────────────────┘
```

**OTP Input Component Spec:**

```typescript
interface OTPInputProps {
  length: 6 // Number of digits
  onComplete: (code: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

// Behavior:
// - 6 individual <input> elements, type="text", inputMode="numeric", maxLength={1}
// - Pattern: [0-9] only
// - Auto-focus first input on mount
// - On digit entry: auto-advance to next input
// - On backspace (empty): move to previous input
// - On paste: distribute characters across inputs
// - On all 6 filled: call onComplete(code) after 150ms debounce
// - Error: shake animation + red border + clear inputs after 500ms
// - Focus management: useRef array for input elements

// Accessibility:
// - aria-label="Digit 1 of 6" on each input
// - aria-describedby="otp-error" on error
// - role="group" + aria-label="Verification code" on container
// - Paste announcement via aria-live
```

### 5.7 Backup Codes Screen (MFA Recovery)

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  ← Back to verification code                │              │
│  │                                             │              │
│  │  Enter Recovery Code                        │              │
│  │  Use one of your 10 recovery codes to       │              │
│  │  sign in. Each code can only be used once.  │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │  XXXXX-XXXXX-XXXXX                   │   │              │
│  │  │  (single input, dash-separated)      │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ERROR: Invalid or already used code.       │              │
│  │  X codes remaining.                         │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Sign In                      │   │              │
│  │  │         (primary btn, full-w)        │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 5.8 Profile Setup Screen (Post-Signup Onboarding)

```
┌──────────────────────────────────────────────────────────────┐
│  ONBOARDING LAYOUT                                            │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  ONBOARDING CARD (max-w-[560px], mx-auto,   │              │
│  │  bg-white, rounded-xl, shadow-md, p-10)     │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  STEP INDICATOR                       │ │              │
│  │  │  ● Step 1 of 2   ○ Step 2 of 2       │ │              │
│  │  │  (progress dots)                      │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Welcome to PromptPilot! 👋                 │              │
│  │  Let's set up your profile.                │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ┌─────┐                              │ │              │
│  │  │  │ 👤  │  Upload Photo                 │ │              │
│  │  │  │     │  (optional)                   │ │              │
│  │  │  └─────┘                              │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Full Name                                  │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ Jane Smith                           │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  What describes you best?                   │              │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │              │
│  │  │ Developer│ │Product   │ │Founder   │  │              │
│  │  │          │ │Manager   │ │          │  │              │
│  │  └──────────┘ └──────────┘ └──────────┘  │              │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │              │
│  │  │ Designer │ │Researcher│ │Other     │  │              │
│  │  └──────────┘ └──────────┘ └──────────┘  │              │
│  │  (selectable chips, multi-select)          │              │
│  │                                             │              │
│  │  How did you hear about us?                 │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ Select an option          ▼          │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Continue →                   │   │              │
│  │  │         (primary btn)               │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Skip for now → (text-sm, link, neutral-400)│              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Onboarding Decision Tree:**

```
Is email verified?  ──No──▶  Show verification screen first
                              ↓
                            Verified? ──No──▶ Skip onboarding, go to dashboard
                                                (show "Verify email" banner)
                              ↓ Yes
Profile Setup (Step 1) ──Skip──▶
                              ↓
Workspace Setup (Step 2) ──Skip──▶
                              ↓
                           Dashboard
```

### 5.9 Workspace Creation Screen (Post-Signup Step 2)

```
┌──────────────────────────────────────────────────────────────┐
│  ONBOARDING LAYOUT                                            │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  ONBOARDING CARD (max-w-[560px], p-10)     │              │
│  │                                             │              │
│  │  ○ Step 1 of 2   ● Step 2 of 2            │              │
│  │                                             │              │
│  │  Create Your Workspace                      │              │
│  │  Workspaces organize your projects and team │              │
│  │                                             │              │
│  │  Workspace Name                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ My Workspace                         │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │  ┌──┐ Use my name (Jane's Workspace)   │  │              │
│  │  └──┘ (checkbox)                        │  │              │
│  │                                             │              │
│  │  Workspace URL                              │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ promptpilot.dev/workspace/           │   │              │
│  │  │ [janes-workspace_______________]     │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │  (auto-generated from name, editable)      │              │
│  │  ✓ janes-workspace is available            │              │
│  │  ✗ my-workspace is taken                   │              │
│  │                                             │              │
│  │  Workspace Type                             │              │
│  │  ┌────────────────────────────────────┐   │              │
│  │  │ ● Personal  Just for me             │   │              │
│  │  │ ○ Team      I'll invite others      │   │              │
│  │  └────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Go to Dashboard →           │   │              │
│  │  │         (primary btn)               │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Skip — I'll do this later →               │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Workspace Naming Rules:**

```
Min length:   3 characters
Max length:   50 characters
Pattern:      /^[a-z0-9]+(?:-[a-z0-9]+)*$/  (lowercase, numbers, hyphens)
Validation:   Must be unique per user (for personal) or globally (for team/public)
Auto-generated: From name input — lowercase, spaces → hyphens, remove special chars
Async check:  Debounced (500ms) availability check on slug change
```

### 5.10 Invitation Acceptance Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[480px], p-8)             │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  EXPIRED / INVALID STATE              │ │              │
│  │  │  ⚠️ This invitation has expired or    │ │              │
│  │  │    is no longer valid.                │ │              │
│  │  │    Contact the workspace admin for a   │ │              │
│  │  │    new invitation.                    │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │        🏢 Acme Corporation             │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  You've been invited to join               │              │
│  │                                             │              │
│  │  Acme Corporation                          │              │
│  │  by Jane Smith (Admin)                     │              │
│  │                                             │              │
│  │  Role: Editor                              │              │
│  │  Members: 5                                │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Accept Invitation            │   │              │
│  │  │         (primary btn, full-w)        │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  Decline →                                  │              │
│  │  (text-sm, link, neutral-400)               │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Entry Points:**

- Email link: `https://app.promptpilot.dev/invitations/{token}`
- Direct URL: same as above

**Behavior:**

- **Unauthenticated user:** Show invitation details → "Accept" → redirect to login/register → auto-join workspace after auth
- **Authenticated user (same email):** Show invitation → "Accept" → join workspace → redirect to workspace
- **Authenticated user (different email):** Warning: "This invitation was sent to jane@acme.com. You're logged in as bob@gmail.com. Switch accounts or request a new invitation."

### 5.11 Account Locked Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │           🔒 (lock icon, 64px, red)    │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  Account Temporarily Locked                 │              │
│  │                                             │              │
│  │  Too many failed login attempts. For your   │              │
│  │  security, the account is locked.           │              │
│  │                                             │              │
│  │  ┌───────────────────────────────────────┐ │              │
│  │  │  ⏱ Try again in 14 minutes            │ │              │
│  │  │  (live countdown timer)               │ │              │
│  │  └───────────────────────────────────────┘ │              │
│  │                                             │              │
│  │  If this wasn't you, consider resetting     │              │
│  │  your password.                             │              │
│  │  [Reset Password →]                        │              │
│  │                                             │              │
│  │  ← Back to Sign In                          │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 5.12 Session Expired Screen

```
┌──────────────────────────────────────────────────────────────┐
│  AUTH LAYOUT                                                  │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  AUTH CARD (max-w-[440px], p-8)             │              │
│  │                                             │              │
│  │         ⏰ (clock icon, 64px)                │              │
│  │                                             │              │
│  │  Session Expired                            │              │
│  │                                             │              │
│  │  Your session has expired for security       │              │
│  │  reasons. Please sign in again to continue. │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Sign In →                    │   │              │
│  │  │         (primary btn)               │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
│                                                               │
│  Trigger: Token refresh failed (expired, revoked, reuse       │
│  detected). Redirect from any protected page.                 │
│  Return URL preserved in query params:                         │
│  /login?returnUrl=/project/my-project/editor                  │
└──────────────────────────────────────────────────────────────┘
```

### 5.13 Unauthorized Access Screen (403)

```
┌──────────────────────────────────────────────────────────────┐
│  APP LAYOUT (with sidebar + navbar)                           │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  CENTERED CONTENT                           │              │
│  │                                             │              │
│  │         🚫 (no-entry icon, 64px)            │              │
│  │                                             │              │
│  │  Access Denied                              │              │
│  │                                             │              │
│  │  You don't have permission to access this   │              │
│  │  resource.                                  │              │
│  │                                             │              │
│  │  If you believe this is an error, contact   │              │
│  │  your workspace administrator.              │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Go to Dashboard →           │   │              │
│  │  │         (primary btn)               │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 5.14 Delete Account Confirmation Screen

```
┌──────────────────────────────────────────────────────────────┐
│  SETTINGS LAYOUT (within app)                                 │
│                                                               │
│  ┌────────────────────────────────────────────┐              │
│  │  DANGER ZONE CARD (bg-red-50, border-red-200)│              │
│  │                                             │              │
│  │  ⚠️ Delete Account                          │              │
│  │                                             │              │
│  │  This will permanently delete your account  │              │
│  │  and all associated data.                   │              │
│  │                                             │              │
│  │  What happens:                              │              │
│  │  • Account is deactivated for 30 days       │              │
│  │  • You can recover within 30 days            │              │
│  │  • After 30 days, data is permanently deleted│              │
│  │  • Workspaces you own will be transferred   │              │
│  │    or deleted                               │              │
│  │                                             │              │
│  │  To confirm, enter your password:           │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ ••••••••••                          │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  To confirm, type DELETE:                   │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │ __________                           │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  │                                             │              │
│  │  ┌─────────────────────────────────────┐   │              │
│  │  │         Delete My Account            │   │              │
│  │  │         (danger btn, disabled until  │   │              │
│  │  │          password + DELETE entered)  │   │              │
│  │  └─────────────────────────────────────┘   │              │
│  └────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Form Validation Rules (Complete)

### Email Validation

```
Client-side (on blur + on type after first blur):
  Required:     true
  Format:       /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  Min length:   5
  Max length:   254 (RFC 5321)
  Normalization: toLowerCase().trim()
  Error messages:
    Empty:    "Email is required"
    Format:   "Please enter a valid email address"
    Too long: "Email must be less than 254 characters"

Server-side (Zod):
  z.string().email().max(254).transform(v => v.toLowerCase().trim())

Server-side uniqueness check:
  SELECT 1 FROM users WHERE email = :email AND deletedAt IS NULL
  Returns 409 if exists: "An account with this email already exists"
```

### Password Validation

```
Client-side (real-time, on every keystroke after first focus):
  Required:     true
  Min length:   8
  Max length:   128
  Rules (progressive, all must pass):
    ✓ contains [A-Z]
    ✓ contains [a-z]
    ✓ contains [0-9]
    ✓ contains [^A-Za-z0-9] (special char)
  Strength scoring:
    0-1 rules:   Weak   (0-25%)
    2 rules:     Fair   (25-50%)
    3 rules:     Good   (50-75%)
    4 rules:     Strong (75-100%)
    Bonus: 12+ characters = +1 level
  Error messages:
    Empty:    "Password is required"
    Too short: "Password must be at least 8 characters"
    Missing uppercase: "Add an uppercase letter"
    Missing lowercase: "Add a lowercase letter"
    Missing number: "Add a number"
    Missing special: "Add a special character"

Server-side (Zod):
  z.string()
    .min(8, "Must be at least 8 characters")
    .max(128, "Must be less than 128 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character")

Additional server checks:
  - Not the same as email (or contains email)
  - Not in breached passwords list (HaveIBeenPwned API — future)
  - Not in common passwords list
```

### Name Validation

```
Client-side:
  Required:     true
  Min length:   2
  Max length:   100
  Pattern:      Any Unicode letters, spaces, hyphens, apostrophes
  Error messages:
    Empty:    "Name is required"
    Too short: "Name must be at least 2 characters"
    Too long: "Name must be less than 100 characters"

Server-side (Zod):
  z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[\p{L}\p{M} \-']+$/u, "Name contains invalid characters")
```

### Workspace Slug Validation

```
Client-side (real-time, on type + async availability check):
  Auto-generated: From name input
  Pattern:        /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  Min length:     3
  Max length:     40
  Async check:    Debounced 500ms → GET /api/v1/workspaces/check-slug?slug=X
  Error messages:
    Empty:    "Workspace URL is required"
    Pattern:  "Only lowercase letters, numbers, and hyphens"
    Too short: "Must be at least 3 characters"
    Too long: "Must be less than 40 characters"
    Taken:    "This URL is already taken"
    Available: "✓ Available" (green, shown below input)

Server-side:
  Check uniqueness: WorkspaceRepository.findByOwnerAndSlug(ownerId, slug)
  If exists AND ownerId matches: can reuse (user's own workspace)
  If exists AND ownerId different: 409 "Workspace slug already taken"
```

---

## 7. Security Implementation

### Token Security

```
JWT ACCESS TOKEN:
  Algorithm:    HS256 (production) / RS256 (future, for OAuth interop)
  Signing key:  JWT_SECRET env var (min 64-char random string)
  Rotation:     Manual key rotation. Old tokens accepted for grace period.
  Payload:      { userId, email, role, jti, iat, exp, iss }
  Issuer:       "promptpilot"
  jti:          crypto.randomUUID() — unique per token
  Expiry:       7 days (dev/current) → 15 minutes (production)
  Verification: jwt.verify(token, secret, { algorithms: ['HS256'] })

JWT REFRESH TOKEN:
  Algorithm:    HS256
  Expiry:       30 days
  Rotation:     New pair on every refresh
  Reuse check:  SHA-256(token) compared with stored hash
  Reuse action: Revoke ALL sessions if mismatch (theft detection)
  Storage:      SHA-256 hash in DB (never stored raw)

COOKIE CONFIGURATION:
  Production:
    accessToken:   HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
    refreshToken:  HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=2592000
  Development:
    accessToken:   HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
    refreshToken:  HttpOnly; SameSite=Lax; Path=/api/v1/auth; Max-Age=2592000
```

### Password Security

```
HASHING:
  Algorithm:    bcrypt
  Cost factor:  12 rounds (~350ms on modern hardware)
  Future:       HMAC-SHA256(password, PEPPER) → bcrypt → DB
  Pepper:       Stored in environment variable (not database)
  Upgrade:      On login, if cost factor < current, re-hash with higher cost

VALIDATION:
  Min length:   8 characters
  Complexity:   Uppercase + lowercase + digit + special
  Common check: Against top 10,000 passwords list
  Breach check: HaveIBeenPwned k-anonymity API (future)
  History:      Cannot reuse last 5 passwords (future)

STORAGE:
  passwordHash only — never store plaintext
  toJSON() on User model strips passwordHash
  API responses NEVER include passwordHash
```

### CSRF Protection

```
Layer 1: SameSite=Strict cookies
         Cookie not sent on cross-origin requests
         Effectively prevents CSRF for cookie-based auth

Layer 2: Bearer token in Authorization header
         CSRF does not apply to header-based auth
         Browsers don't automatically attach Authorization headers cross-origin

Layer 3 (future): CSRF token
         Double-submit cookie pattern
         Custom header: X-CSRF-Token
         Server validates cookie value matches header value
         Required only for state-changing requests (POST, PUT, PATCH, DELETE)
```

### XSS Protection

```
Layer 1: HttpOnly cookies
         JavaScript cannot read accessToken/refreshToken cookies
         Even if XSS succeeds, tokens cannot be stolen

Layer 2: CSP Header (via helmet)
         Content-Security-Policy:
           default-src 'self';
           script-src 'self';
           style-src 'self' 'unsafe-inline';
           img-src 'self' data: https:;
           connect-src 'self' https://api.promptpilot.dev;
           frame-ancestors 'none';
           form-action 'self';
         Prevents inline scripts from executing (except style)

Layer 3: React's auto-escaping
         JSX automatically escapes HTML in string literals
         Prevents most XSS vectors

Layer 4: Input sanitization
         Zod validates and sanitizes all input
         SQL injection prevented by Prisma's parameterized queries
```

### Brute Force / Credential Stuffing Protection

```
LOGIN ENDPOINT:
  Rate limit: 5 attempts per 15 minutes per IP
  Rate limit: 5 attempts per 15 minutes per email
  Account lockout: 5 failed → 15 min, 10 failed → 1 hour, 20 failed → manual

REGISTRATION:
  Rate limit: 3 per hour per IP
  CAPTCHA: Not initially (friction). Added if automated signups detected.

PASSWORD RESET:
  Rate limit: 1 per 5 min per email, 3 per hour per IP
  Token: 40 random bytes, single-use, 15-minute expiry

MFA CHALLENGE:
  Rate limit: 5 per 15 minutes per user

GENERAL:
  Global rate limit: 100 requests per 15 minutes per IP (express-rate-limit)
  All errors logged with request ID
  Suspicious patterns trigger admin alerts
```

### Session Security

```
DEVICE FINGERPRINTING:
  Stored per session: IP address, User-Agent, device name
  Compared on each request (soft check — doesn't block on mismatch, just flags)
  Suspicious change triggers email notification

REMEMBER DEVICE:
  If "Remember me" checked: session expiry 90 days
  If unchecked: session expiry 30 days
  Trusted devices listed in settings

TOKEN REVOCATION:
  Individual: DELETE /api/v1/auth/sessions/:id
  All: DELETE /api/v1/auth/sessions
  Password change: Auto-revoke all sessions
  Suspicious activity: Auto-revoke all sessions (token reuse detected)

AUTOMATIC LOGOUT:
  Token expiry (access: 15 min → refresh needed)
  Refresh failure → redirect to login
  Inactivity: (future) auto-logout after configurable period
```

---

## 8. Permissions

### Role Hierarchy

```
SUPER_ADMIN (platform level)
  ├── ADMIN (platform level)
  │     └── MEMBER (platform level — all users default to this)
  │           └── Workspace-specific roles:
  │                 ├── OWNER (workspace creator, full control)
  │                 ├── ADMIN (workspace management)
  │                 ├── EDITOR (create/edit content)
  │                 └── VIEWER (read-only)
  └── Enterprise Admin (future: org-level management)
```

### Permission Matrix

```
ACTION                          SUPER_ADMIN  ADMIN  MEMBER
─────────────────────────────────────────────────────────────
View all users                  ✅           ❌     ❌
Suspend/unsuspend any user      ✅           ❌     ❌
View platform analytics         ✅           ❌     ❌
Manage platform settings        ✅           ❌     ❌
Create workspaces               ✅           ✅     ✅
Delete own account              ✅           ✅     ✅


ACTION                          OWNER  ADMIN  EDITOR  VIEWER
─────────────────────────────────────────────────────────────
View workspace                  ✅     ✅     ✅      ✅
Edit workspace settings         ✅     ✅     ❌      ❌
Delete workspace                ✅     ❌     ❌      ❌
Transfer ownership              ✅     ❌     ❌      ❌
Invite members                  ✅     ✅     ❌      ❌
Remove members                  ✅     ✅     ❌      ❌
Change member roles             ✅     ✅     ❌      ❌
Create projects                 ✅     ✅     ✅      ❌
View projects                   ✅     ✅     ✅      ✅
Edit any project                ✅     ✅     ✅(own) ❌
Delete any project              ✅     ✅     ❌      ❌
Generate documents              ✅     ✅     ✅      ❌
Edit documents                  ✅     ✅     ✅      ❌
View documents                  ✅     ✅     ✅      ✅
Comment on documents            ✅     ✅     ✅      ✅
Export documents                ✅     ✅     ✅      ✅
View version history            ✅     ✅     ✅      ✅
Restore versions                ✅     ✅     ✅      ❌
Manage API keys                 ✅     ✅     ❌      ❌
View audit log                  ✅     ✅     ❌      ❌
```

### Permission Enforcement

```
MIDDLEWARE CHAIN:
  1. authenticate — Verify JWT, extract user from token
  2. extractWorkspace — Extract workspace context from params/body
  3. authorize(roles) — Check platform-level role
  4. authorizeWorkspace(roles) — Check workspace-level role
  5. Resource ownership check — isOwner(userId, resourceId)

PROJECT-LEVEL AUTHORIZATION (future):
  Project.members: WorkspaceMember[] for direct project access
  If project is public within workspace → accessible to all workspace members
  If project is private → accessible only to owner + explicitly added members
```

---

## 9. OAuth Integration Detail

### OAuth Providers

```
PROVIDER        CLIENT ID ENV              SCOPES
───────────────────────────────────────────────────────────
Google          GOOGLE_CLIENT_ID           openid profile email
GitHub          GITHUB_CLIENT_ID           user:email read:user
Microsoft       MICROSOFT_CLIENT_ID        openid profile email User.Read
Apple           APPLE_CLIENT_ID            name email
```

### OAuth Flow (Google example)

```
1. User clicks "Continue with Google"
2. Redirect to Google:
   GET https://accounts.google.com/o/oauth2/v2/auth?
     client_id={CLIENT_ID}&
     redirect_uri={BASE_URL}/api/v1/auth/oauth/google/callback&
     response_type=code&
     scope=openid profile email&
     state={crypto.randomBytes(16).toString('hex')}

3. Google authenticates user, redirects back with ?code=...&state=...

4. Server validates state (CSRF prevention for OAuth)

5. Server exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
     code={code}&
     client_id={CLIENT_ID}&
     client_secret={CLIENT_SECRET}&
     redirect_uri={...}&
     grant_type=authorization_code

6. Server calls Google userinfo:
   GET https://www.googleapis.com/oauth2/v3/userinfo
   Authorization: Bearer {access_token}

7. Response: { sub, email, email_verified, name, picture }

8. Account resolution:
   a. Find OAuthAccount by { provider: "google", providerUserId: sub }
      → Found: Login as linked user
   b. Find User by email
      → Found: Auto-link. Create OAuthAccount record. Login as user.
      → Not found: Create User (emailVerified = true from Google),
                  Create OAuthAccount, Login, trigger onboarding.

9. Generate PromptPilot JWT tokens
10. Redirect to frontend with tokens:
    https://app.promptpilot.dev/auth/callback?accessToken=...&refreshToken=...

11. Frontend stores tokens via AuthProvider, redirects to dashboard
```

### Account Linking

```
RULE: Email is the identity anchor.
  - If OAuth email matches existing account → auto-link
  - If OAuth email is NEW → create account
  - User can link multiple providers in Settings → Connected Accounts

LINKING UI (Settings > Connected Accounts):
  ┌──────────────────────────────────────────┐
  │  Connected Accounts                       │
  │                                           │
  │  Google      jane@gmail.com    [Connected]│
  │  GitHub      janedev           [Connect]  │
  │  Microsoft   —                 [Connect]  │
  │  Apple       —                 [Connect]  │
  │                                           │
  │  Password     ********          [Change]  │
  └──────────────────────────────────────────┘

UNLINKING:
  - Cannot unlink the LAST authentication method
  - If only OAuth is linked, must set password first, then can unlink
  - "Set a password to unlink your Google account" prompt
```

---

## 10. Magic Link Detail

```
MAGIC LINK EMAIL:
  Subject: "Sign in to PromptPilot"
  Body:
    ┌──────────────────────────────────────┐
    │  [PromptPilot Logo]                  │
    │                                      │
    │  Sign in to PromptPilot              │
    │                                      │
    │  Click the button below to sign in   │
    │  to PromptPilot. This link expires   │
    │  in 10 minutes.                      │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │     Sign in to PromptPilot    │   │
    │  │     (primary btn, email-safe) │   │
    │  └──────────────────────────────┘   │
    │                                      │
    │  Or copy this link:                  │
    │  https://app.promptpilot.dev/        │
    │  magic-link?token=abc123...          │
    │                                      │
    │  If you didn't request this, you     │
    │  can safely ignore this email.       │
    └──────────────────────────────────────┘

MAGIC LINK FLOW:
  1. User enters email on login page → clicks "Send Magic Link"
     (Show "Send Magic Link" link below password field or as tab toggle)
  2. Server sends email (or returns 200 silently if email not found)
  3. Login page shows: "Check your email — we sent a magic link to j•••@example.com"
     (Same as forgot password success state)
  4. User clicks link in email → opens PromptPilot
  5. Server verifies token → generates JWT → sets cookies → redirects to dashboard
  6. If new user: Creates account (with emailVerified: true) → onboarding

TOKEN SECURITY:
  - 40 random bytes (crypto.randomBytes)
  - SHA-256 stored in DB
  - 10-minute expiry
  - Single-use (cleared after use)
  - Rate limited: 1 per 2 minutes per email
```

---

## 11. Email Templates (All Auth Emails)

```
VERIFICATION EMAIL:
  Subject: "Verify your email for PromptPilot"
  Pre-header: "Click to verify your email address"
  Header:    "Verify Your Email"
  Body:      "Thanks for signing up! Click below to verify your email address."
  CTA:       "Verify Email →"
  Expiry:    "This link expires in 24 hours."
  Security:  "If you didn't create a PromptPilot account, you can safely ignore this."

PASSWORD RESET EMAIL:
  Subject: "Reset your PromptPilot password"
  Pre-header: "Click to reset your password"
  Header:    "Reset Your Password"
  Body:      "We received a request to reset your password. Click below to choose a new one."
  CTA:       "Reset Password →"
  Expiry:    "This link expires in 15 minutes."
  Security:  "If you didn't request this, you can safely ignore this email."

MAGIC LINK EMAIL:
  Subject: "Sign in to PromptPilot"
  Pre-header: "Click to sign in instantly"
  Header:    "Sign in to PromptPilot"
  Body:      "Click below to sign in to PromptPilot instantly."
  CTA:       "Sign In →"
  Expiry:    "This link expires in 10 minutes."
  Security:  "If you didn't request this, you can safely ignore it."

PASSWORD CHANGED EMAIL:
  Subject: "Your PromptPilot password was changed"
  Header:    "Password Changed"
  Body:      "Your password was successfully changed."
  Security:  "If this wasn't you, please reset your password immediately and contact support."
  CTA:       "Reset Password →" (conditional — shown if user might need it)

NEW DEVICE LOGIN EMAIL:
  Subject: "New sign-in to your PromptPilot account"
  Header:    "New Sign-In Detected"
  Body:      "Your account was accessed from a new device or location."
  Details:   "Device: Chrome on Windows | Location: Berlin, Germany | Time: July 21, 2026 at 14:32 UTC"
  Security:  "If this was you, ignore this email. If not, secure your account immediately."
  CTA:       "Review Activity → (links to Sessions page)"

ACCOUNT DELETED EMAIL:
  Subject: "Your PromptPilot account has been deleted"
  Header:    "Account Deleted"
  Body:      "Your PromptPilot account has been deleted. You can recover it within 30 days by logging in."
  Expiry:    "After 30 days, your data will be permanently deleted."
  CTA:       "Recover Account →"

INVITATION EMAIL:
  Subject: "Jane Smith invited you to Acme Corp on PromptPilot"
  Header:    "You're Invited"
  Body:      "Jane Smith has invited you to join the Acme Corp workspace on PromptPilot as an Editor."
  CTA:       "Accept Invitation →"
  Expiry:    "This invitation expires in 7 days."

WORKSPACE JOINED EMAIL (for admin):
  Subject: "Bob Johnson accepted your invitation"
  Header:    "Invitation Accepted"
  Body:      "Bob Johnson has accepted your invitation and joined the Acme Corp workspace."
  CTA:       "View Workspace →"
```

---

## 12. Analytics Events

```
EVENT                          TRIGGER                            PROPERTIES
────────────────────────────────────────────────────────────────────────────────
signup_started                 Register form shown                source (landing_cta, nav_cta, etc.)
signup_oauth_started           OAuth button clicked               provider (google, github, etc.)
signup_completed               Registration API success           method (email, google, github)
signup_failed                  Registration API error             error_code, reason
login_started                  Login form shown                   source
login_success                  Login API success                  method (password, magic_link, oauth), mfa_used (bool)
login_failed                   Login API error                    error_code, reason (wrong_password, locked, etc.)
mfa_challenge_started          MFA screen shown
mfa_challenge_success          MFA code valid
mfa_challenge_failed           MFA code invalid
mfa_enrolled                   User enables MFA
mfa_disabled                   User disables MFA
password_reset_requested       Forgot password form submitted
password_reset_completed       Reset password API success
email_verification_sent        Verification email sent
email_verified                 Email verified successfully
magic_link_sent                Magic link email sent
magic_link_used                Magic link token verified
oauth_connected                OAuth account linked              provider
oauth_disconnected             OAuth account unlinked            provider
session_revoked                Session manually revoked
logout                         Logout API success
account_deleted                Account deletion confirmed
account_recovered              Account recovery within 30 days
```

---

## 13. Accessibility

```
WCAG 2.2 AA COMPLIANCE:
  Color contrast:     All text ≥ 4.5:1, large text ≥ 3:1
  Keyboard:           All forms navigable via Tab. Enter to submit. Space to toggle.
  Focus indication:   outline-2 outline-primary-500 outline-offset-2 on all focusable elements
  Focus order:        Logical DOM order (name → email → password → confirm → terms → submit)
  Error announcement: aria-describedby linking error messages to inputs. role="alert" on banners.
  Success state:      aria-live="polite" announces "Account created successfully"
  Loading state:      aria-busy="true" on form during submission
  OTP input:          aria-label="Digit X of 6" on each input
  Password strength:  aria-valuenow, aria-valuetext for meter. Checklist announced.
  Social buttons:     aria-label="Sign up with Google" (not just "Continue" — describes action)
  Screen reader:      All form labels properly associated. Error messages linked.
                     Headings in logical order. Success/error states announced.

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce):
    - No shake animation on errors (static red border instead)
    - No checkmark spring animation (static checkmark)
    - No OTP cursor blink
    - No password strength bar animation (instant width change)
    - No page transition animations
    - No loading spinner animation
```

---

## 14. Animations

```
PAGE TRANSITIONS:
  Auth page mount:    Fade in + slide up 12px (400ms, [0.4, 0, 0.2, 1])
  Auth page unmount:  Fade out (200ms, ease-in)
  Success redirect:   Brief white flash overlay → new page fades in

FORM INTERACTIONS:
  Input focus:        Border color transition (indigo, 150ms ease) + subtle box-shadow
  Input error:        Border color transition (red, 150ms ease) + shake (300ms, spring)
  Button hover:       bg darken + shadow strengthen (150ms ease) + translateY(-1px)
  Button active:      translateY(0) + scale(0.98) (100ms)
  Button loading:     Spinner fades in (150ms). Label stays (no collapse).
  Checkbox toggle:    Fill animation (backgroundColor + check icon, 150ms ease)
  Terms checkbox:     Scale bounce on check (200ms spring)

PASSWORD STRENGTH METER:
  Bar fill:           Width transition (300ms, ease-out)
  Color change:       RGB color interpolation (red → orange → yellow → green, 300ms)
  Checkmarks:         Spring animation (scale 0→1.2→1, 200ms each, staggered 50ms)

OTP INPUT:
  Cursor blink:       Caret color opacity alternating (1s cycle, steps(2))
  Auto-advance:       Focus transition (instant — no animation)
  Error shake:        translateX(±4px) oscillation (300ms, spring, 3 oscillations)
  Error clear:        All inputs clear simultaneously (150ms fade)
  All filled:         Subtle pulse on last input (scale 1→1.02→1, 200ms)

SUCCESS STATES:
  Checkmark icon:     drawSVG animation (line length 0→full, 400ms, ease-out)
  Success card:       Scale 0.9→1 + fade in (400ms, spring)
  Verification:       Envelope icon subtle float (translateY ±3px, 3s infinite, ease-in-out)

ERROR STATES:
  Banner appearance:  Slide down + fade in (250ms, [0.4, 0, 0.2, 1])
  Banner dismiss:     Slide up + fade out (200ms, ease-in)
  Inline error:       Fade in + slide up 4px (150ms, ease)
  Countdown timer:    Number changes instantly. Bar width interpolates linearly.

MAGIC LINK WAITING:
  Envelope animation: Float (translateY + rotate 5deg, 3s infinite)
  Resend cooldown:    Countdown timer (seconds ticking)
  Loading dot:        "Sending email" with 3 bouncing dots (staggered opacity, 1.4s cycle)

LOADING SKELETONS:
  Form skeleton:      Shimmer animation on the card content (1.5s infinite)
  Only shown on full-page load (rare — auth pages are client components, very fast)
```

---

## 15. React Component Tree

```
AuthModule
│
├── AuthLayout (template)
│   Props: children, title?, subtitle?
│   Renders: centered card with branding background
│   ├── BackLink (optional)
│   └── AuthCard
│       ├── Logo
│       ├── Heading + Subtitle
│       └── {children}
│
├── LoginPage (app/login/page.tsx) — ✅ Existing, extend
│   Uses: AuthLayout
│   ├── OAuthButtons
│   │   Props: mode ('login' | 'register')
│   │   ├── OAuthButton (per provider)
│   │   │   Props: provider, isLoading, onClick
│   │   └── Divider ("OR CONTINUE WITH")
│   ├── EmailPasswordForm (login variant)
│   │   Props: onSubmit, loading, generalError
│   │   ├── EmailInput (Atom — Input with email validation)
│   │   ├── PasswordInput (Molecule — PasswordField with visibility toggle)
│   │   ├── RememberMeCheckbox
│   │   ├── ForgotPasswordLink
│   │   └── SubmitButton
│   ├── MagicLinkToggle
│   │   Props: onSwitch
│   │   └── "Send Magic Link" button (text link)
│   ├── ErrorBanner
│   │   Props: message, type ('error' | 'warning' | 'locked')
│   │   └── LockedCountdown (conditional)
│   │       Props: lockedUntil
│   └── AuthFooter
│       Props: prompt ("Don't have an account?"), linkText, linkHref
│
├── RegisterPage (app/register/page.tsx) — ✅ Existing, extend
│   Uses: AuthLayout
│   ├── OAuthButtons
│   ├── RegisterForm
│   │   Props: onSubmit, loading, errors, generalError
│   │   ├── NameInput (Atom)
│   │   ├── EmailInput (Atom)
│   │   ├── PasswordInput (Molecule)
│   │   ├── PasswordStrengthMeter (Molecule)
│   │   │   Props: password
│   │   │   State: strength (0-100)
│   │   │   ├── StrengthBar
│   │   │   │   Props: percentage, color
│   │   │   └── RulesChecklist
│   │   │       Props: rules[] { label, met }
│   │   │       └── RuleItem (checkmark + label)
│   │   ├── ConfirmPasswordInput (Molecule)
│   │   ├── TermsCheckbox
│   │   │   Props: checked, onChange, error
│   │   └── SubmitButton
│   ├── ErrorBanner
│   └── AuthFooter
│
├── ForgotPasswordPage (NEW)
│   Uses: AuthLayout
│   ├── ForgotPasswordForm
│   │   ├── EmailInput
│   │   └── SubmitButton
│   ├── SuccessState
│   │   ├── EnvelopeIcon (animated)
│   │   ├── SuccessMessage
│   │   ├── ResendButton (with cooldown timer)
│   │   └── BackLink
│   └── ErrorBanner
│
├── ResetPasswordPage (NEW)
│   Uses: AuthLayout
│   Props: token (from query params)
│   ├── InvalidTokenState (conditional)
│   │   ├── WarningIcon
│   │   ├── Message
│   │   └── RequestNewLink
│   ├── ResetPasswordForm
│   │   ├── PasswordInput
│   │   ├── PasswordStrengthMeter
│   │   ├── ConfirmPasswordInput
│   │   └── SubmitButton
│   └── SuccessState
│
├── EmailVerificationPage (NEW)
│   Uses: AuthLayout
│   Props: token? (from query params)
│   ├── VerifyMagicLink (when token present)
│   │   └── AutoVerify + LoadingSpinner
│   ├── PendingState (post-signup)
│   │   ├── EnvelopeIcon (animated)
│   │   ├── Message
│   │   ├── ResendButton (with cooldown)
│   │   ├── ContinueToDashboardLink
│   │   └── ChangeEmailLink
│   └── VerifiedState
│       ├── CheckmarkIcon (animated)
│       └── ContinueButton
│
├── MFAVerificationPage (NEW)
│   Uses: AuthLayout
│   ├── BackLink
│   ├── LockIcon
│   ├── Heading + Description
│   ├── OTPInput
│   │   Props: length, onComplete, disabled, error
│   │   State: values[], activeIndex
│   │   ├── OTPDigit (×6)
│   │   │   Props: value, active, error
│   │   └── HiddenPasteInput (accessibility)
│   ├── ErrorMessage (conditional)
│   │   Props: message, attemptsLeft
│   ├── SubmitButton (optional — auto-submit)
│   └── RecoveryCodeLink
│
├── BackupCodesPage (NEW)
│   Uses: AuthLayout
│   ├── BackLink
│   ├── Heading + Description
│   ├── RecoveryCodeInput
│   │   Props: onSubmit, error
│   ├── ErrorMessage (remaining codes count)
│   └── SubmitButton
│
├── ProfileSetupPage (NEW — onboarding)
│   Uses: OnboardingLayout
│   ├── StepIndicator (1 of 2)
│   ├── Heading + Description
│   ├── AvatarUpload
│   │   Props: currentUrl, onUpload
│   ├── NameInput (pre-filled)
│   ├── RoleSelector
│   │   Props: options[], selected[], onChange
│   │   └── ChipOption[]
│   ├── ReferralSourceSelect
│   ├── SubmitButton
│   └── SkipLink
│
├── WorkspaceSetupPage (NEW — onboarding)
│   Uses: OnboardingLayout
│   ├── StepIndicator (2 of 2)
│   ├── Heading + Description
│   ├── WorkspaceNameInput
│   │   Props: value, onChange, error
│   ├── UseNameCheckbox
│   ├── WorkspaceSlugInput
│   │   Props: value, onChange, availability, error
│   │   └── AvailabilityIndicator
│   ├── WorkspaceTypeRadio
│   │   Props: value, onChange
│   │   ├── PersonalOption
│   │   └── TeamOption
│   ├── SubmitButton
│   └── SkipLink
│
├── InvitationAcceptPage (NEW)
│   Uses: AuthLayout
│   Props: token (from query params)
│   ├── ExpiredState
│   ├── InvitationDetails
│   │   ├── WorkspaceIcon + Name
│   │   ├── InviterInfo
│   │   ├── RoleBadge
│   │   └── MemberCount
│   ├── AcceptButton
│   ├── DeclineLink
│   └── AuthFlowIntegration (handles unauthenticated state)
│
├── SessionExpiredPage (NEW)
│   Uses: AuthLayout
│   ├── ClockIcon
│   ├── Heading + Description
│   └── SignInButton (with returnUrl preserved)
│
├── UnauthorizedPage (403) (NEW)
│   Uses: AppLayout
│   ├── NoEntryIcon
│   ├── Heading + Description
│   └── DashboardButton
│
├── AccountLockedPage (NEW)
│   Uses: AuthLayout
│   ├── LockIcon
│   ├── Heading + Description
│   ├── CountdownTimer
│   │   Props: lockedUntil
│   │   State: remaining (live countdown)
│   ├── ResetPasswordButton
│   └── BackLink
│
├── AccountDeletedPage (NEW)
│   Uses: AuthLayout
│   ├── Heading + Description
│   ├── RecoveryInfo
│   └── ContactSupportLink
│
├── DeleteAccountConfirmation (NEW — within Settings)
│   Uses: Settings section
│   ├── WarningCard
│   ├── PasswordInput (for verification)
│   ├── TextConfirmationInput ("DELETE")
│   └── DeleteButton (danger, disabled until both inputs valid)
│
└── Shared Components (across all auth screens)
    ├── OAuthButtons (reusable: login + register)
    ├── PasswordStrengthMeter (reusable: register + reset + change)
    ├── OTPInput (reusable: MFA verify + MFA enroll + recovery)
    ├── ErrorBanner (reusable: all screens)
    ├── AuthFooter (reusable: login + register)
    ├── BackLink (reusable: all screens with back navigation)
    └── CountdownTimer (reusable: locked + resend cooldown)
```

---

## 16. Implementation Phases

### Phase 3.2 — Current (✅ Built)

```
✅ Email + Password registration
✅ Email + Password login
✅ JWT access/refresh token rotation
✅ Token revocation (logout)
✅ HttpOnly cookie management
✅ bcrypt password hashing (12 rounds)
✅ Auth middleware (authenticate, authorize)
✅ Login page (with validation)
✅ Register page (with validation)
✅ AuthProvider (React Context)
✅ Next.js middleware (protected routes)
✅ Auto-create workspace on registration
✅ Rate limiting (global: 100/15min)
✅ Typed error responses
✅ CORS configured
```

### Phase 4 — Core Improvements (🔜 Next)

```
P0 — Security hardening:
  🔲 Account lockout (5 failures → 15 min)
  🔲 Password reset flow (forgot + reset pages, email, token)
  🔲 Email verification flow (send + confirm, optional but built)
  🔲 Per-endpoint rate limiting (login: 5/15min, register: 3/hr)
  🔲 Audit trail (AuditEntry model + logging on all auth events)
  🔲 Device history (DeviceHistory model for security tracking)

P0 — User experience:
  🔲 Google OAuth
  🔲 GitHub OAuth
  🔲 Magic Link (passwordless login)
  🔲 "Remember me" (extended session duration)
  🔲 Password strength meter (client-side visual feedback)

P0 — Account management:
  🔲 Change password (authenticated)
  🔲 Delete account (soft delete, 30-day recovery)
  🔲 Suspicious login detection (email notification on new device)
```

### Phase 5 — Advanced Auth (📅 Q4 2026)

```
  🔲 MFA / TOTP (enroll, verify, disable, recovery codes)
  🔲 Passkeys / WebAuthn (platform authenticator)
  🔲 Microsoft OAuth
  🔲 Apple Sign-In
  🔲 Multi-device session management (view/revoke sessions)
  🔲 Enterprise SSO (SAML/OIDC per organization)
  🔲 Organization model (multi-workspace enterprises)
  🔲 SCIM provisioning (Okta, Azure AD)
  🔲 Backup recovery codes for MFA
  🔲 Password breach detection (HaveIBeenPwned API)
```

### Phase 6+ — Enterprise Scale (📅 2027+)

```
  🔲 Custom identity providers
  🔲 Multi-tenant organizations
  🔲 Regional authentication (data residency)
  🔲 SOC 2 Type II compliance
  🔲 GDPR data processing agreements
  🔲 HIPAA compliance (if healthcare vertical)
  🔲 Just-in-time provisioning
  🔲 Adaptive MFA (risk-based authentication)
  🔲 Biometric auth (platform native)
  🔲 Hardware security keys (FIDO2/U2F)
```

---

## Appendix A: Environment Variables

```bash
# ── JWT ──
JWT_SECRET=<random-64-char-hex>           # HS256 signing key
JWT_EXPIRES_IN=15m                         # Access token TTL (production)
JWT_REFRESH_EXPIRES_IN=30d                 # Refresh token TTL
JWT_ISSUER=promptpilot

# ── Password ──
BCRYPT_SALT_ROUNDS=12
PEPPER=<random-32-char-hex>               # Future: HMAC pepper

# ── Cookies ──
COOKIE_DOMAIN=app.promptpilot.dev          # Production
# COOKIE_DOMAIN=localhost                  # Development

# ── OAuth ──
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
APPLE_CLIENT_ID=xxx
APPLE_TEAM_ID=xxx
APPLE_KEY_ID=xxx
APPLE_PRIVATE_KEY=xxx

# ── OAuth Redirect URIs ──
OAUTH_REDIRECT_BASE=https://api.promptpilot.dev/api/v1/auth/oauth

# ── MFA / TOTP ──
TOTP_ISSUER=PromptPilot
TOTP_ENCRYPTION_KEY=<random-32-byte-hex>   # For encrypting TOTP secrets at rest

# ── Rate Limiting ──
AUTH_RATE_WINDOW_MS=900000                 # 15 minutes
AUTH_RATE_MAX=5                            # Login attempts
REGISTER_RATE_WINDOW_MS=3600000            # 1 hour
REGISTER_RATE_MAX=3                        # Registration attempts
GLOBAL_RATE_WINDOW_MS=900000               # 15 minutes
GLOBAL_RATE_MAX=100                        # Global auth requests

# ── Email (Resend / SendGrid / SES) ──
EMAIL_FROM=noreply@promptpilot.dev
EMAIL_PROVIDER=resend                      # resend | sendgrid | ses
RESEND_API_KEY=xxx

# ── Account Lockout ──
LOCKOUT_THRESHOLD_1=5                      # 15-minute lock
LOCKOUT_THRESHOLD_2=10                     # 1-hour lock
LOCKOUT_THRESHOLD_3=20                     # 24-hour lock
LOCKOUT_DURATION_1_MS=900000               # 15 minutes
LOCKOUT_DURATION_2_MS=3600000              # 1 hour
LOCKOUT_DURATION_3_MS=86400000             # 24 hours

# ── Token Lifetimes ──
VERIFICATION_TOKEN_EXPIRY_MS=86400000      # 24 hours
RESET_TOKEN_EXPIRY_MS=900000               # 15 minutes
MAGIC_LINK_EXPIRY_MS=600000                # 10 minutes
INVITATION_EXPIRY_MS=604800000             # 7 days
```

---

## Appendix B: Auth Middleware Chain (Express)

```typescript
// apps/api/src/app.ts (conceptual)

// 1. Global middleware
app.use(helmet()) // Security headers
app.use(cors({ origin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(rateLimiter) // Global 100/15min
app.use(requestLogger) // Request ID + logging

// 2. Auth routers (no auth required for these)
app.use('/api/v1/auth', authRouter) // login, register, refresh, oauth, etc.
app.use('/api/v1/invitations', invitationRouter) // Accept invitation (public)

// 3. Authenticated routes
const { authenticate, optionalAuth, authorize } = createAuthMiddleware(authConfig)
app.use('/api/v1', authenticate) // All below require valid JWT

// 4. Authorized routes
app.use('/api/v1/dashboard', authorize('MEMBER', 'ADMIN', 'SUPER_ADMIN'), dashboardRouter)
app.use('/api/v1/workspaces', workspacesRouter)
app.use('/api/v1/projects', projectsRouter)
app.use('/api/v1/pipeline', pipelineRouter)
app.use('/api/v1/exports', exportsRouter)
app.use('/api/v1/conversations', conversationsRouter)
app.use('/api/v1/auth/sessions', authorize('MEMBER'), sessionsRouter)
app.use('/api/v1/auth/mfa', authorize('MEMBER'), mfaRouter)
app.use('/api/v1/auth/profile', authorize('MEMBER'), profileRouter)
app.use('/api/v1/admin', authorize('SUPER_ADMIN'), adminRouter)

// 5. Error handler
app.use(errorHandler)
```

---

_Document Version: 1.0 — PromptPilot Authentication & Onboarding System Specification_
_Last Updated: 2026-07-21_
_Status: Phase 3.2 built. Phase 4 ready for implementation._
