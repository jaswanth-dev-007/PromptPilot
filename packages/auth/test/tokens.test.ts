import { describe, it, expect } from 'vitest'
import { generateTokens, verifyAccessToken, verifyRefreshToken, hashToken } from '../src/tokens'

const secret = 'test-secret-that-is-at-least-32-characters!!'

describe('tokens', () => {
  describe('generateTokens', () => {
    it('generates access and refresh tokens', () => {
      const tokens = generateTokens(
        { userId: '123', email: 'test@example.com', role: 'member' },
        secret,
        '1h',
        '7d',
      )

      expect(tokens.accessToken).toBeTruthy()
      expect(tokens.refreshToken).toBeTruthy()
      expect(tokens.expiresIn).toBe(3600)
    })
  })

  describe('verifyAccessToken', () => {
    it('verifies a valid token', () => {
      const tokens = generateTokens(
        { userId: '123', email: 'test@example.com', role: 'member' },
        secret,
        '1h',
        '7d',
      )

      const payload = verifyAccessToken(tokens.accessToken, secret)
      expect(payload.userId).toBe('123')
      expect(payload.email).toBe('test@example.com')
      expect(payload.role).toBe('member')
    })

    it('throws on invalid token', () => {
      expect(() => verifyAccessToken('invalid-token', secret)).toThrow()
    })
  })

  describe('verifyRefreshToken', () => {
    it('verifies a valid refresh token', () => {
      const tokens = generateTokens(
        { userId: '123', email: 'test@example.com', role: 'member' },
        secret,
        '1h',
        '7d',
      )

      const payload = verifyRefreshToken(tokens.refreshToken, secret)
      expect(payload.userId).toBe('123')
    })
  })

  describe('hashToken', () => {
    it('produces a consistent hash', () => {
      const hash = hashToken('some-token')
      expect(hash).toHaveLength(64)
      expect(hashToken('some-token')).toBe(hash)
    })

    it('produces different hashes for different inputs', () => {
      const h1 = hashToken('token-1')
      const h2 = hashToken('token-2')
      expect(h1).not.toBe(h2)
    })
  })
})
