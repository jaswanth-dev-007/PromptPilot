import type express from 'express'
import type { AuthConfig } from '@promptpilot/config'
import type { TokenPayload } from '@promptpilot/auth'
import { generateTokens } from '@promptpilot/auth'

export function createTestConfig(overrides?: Partial<AuthConfig>): AuthConfig {
  return {
    jwtSecret: 'test-secret-that-is-at-least-32-characters!!',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    bcryptSaltRounds: 10,
    ...overrides,
  }
}

export function createAuthHeader(user: Partial<TokenPayload> = {}): string {
  const config = createTestConfig()
  const payload: TokenPayload = {
    userId: user.userId || '507f1f77bcf86cd799439011',
    email: user.email || 'test@example.com',
    role: user.role || 'member',
  }
  const tokens = generateTokens(
    payload,
    config.jwtSecret,
    config.jwtExpiresIn,
    config.jwtRefreshExpiresIn,
  )
  return `Bearer ${tokens.accessToken}`
}

export function mockAuthMiddleware(): express.RequestHandler {
  return (req: any, _res, next) => {
    req.user = {
      userId: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      role: 'member',
    }
    next()
  }
}
