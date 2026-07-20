import { describe, it, expect } from 'vitest'
import { logger, redactSensitive } from '../src/logger'

describe('redactSensitive', () => {
  it('redacts apiKey', () => {
    const result = redactSensitive({ apiKey: 'sk-secret', name: 'test' })
    expect(result.apiKey).toBe('[REDACTED]')
    expect(result.name).toBe('test')
  })

  it('redacts nested keys', () => {
    const result = redactSensitive({
      providers: { openai: { apiKey: 'sk-secret' } },
    })
    expect((result.providers as Record<string, unknown>).openai).toEqual({ apiKey: '[REDACTED]' })
  })

  it('redacts authorization', () => {
    const result = redactSensitive({ headers: { authorization: 'Bearer token' } })
    expect((result.headers as Record<string, unknown>).authorization).toBe('[REDACTED]')
  })

  it('handles empty objects', () => {
    expect(redactSensitive({})).toEqual({})
  })
})
