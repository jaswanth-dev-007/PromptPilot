import { describe, it, expect } from 'vitest'
import { countTokens, estimateCost, formatCost } from '../src/tokens'

describe('countTokens', () => {
  it('counts simple text', () => {
    const count = countTokens('hello world')
    expect(count).toBeGreaterThan(0)
  })

  it('returns 0 for empty string', () => {
    expect(countTokens('')).toBe(0)
  })
})

describe('estimateCost', () => {
  it('calculates GPT-4o cost', () => {
    const cost = estimateCost(1000, 500, 'gpt-4o')
    expect(cost).toBeCloseTo(0.0075, 4)
  })

  it('falls back to GPT-4o pricing for unknown models', () => {
    const cost = estimateCost(1000, 0, 'unknown-model')
    expect(cost).toBeGreaterThan(0)
  })
})

describe('formatCost', () => {
  it('shows < $0.01 for tiny costs', () => {
    expect(formatCost(0.005)).toBe('< $0.01')
  })

  it('shows dollar amount', () => {
    expect(formatCost(0.05)).toBe('$0.05')
  })
})
