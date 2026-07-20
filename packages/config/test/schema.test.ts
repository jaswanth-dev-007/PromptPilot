import { describe, it, expect } from 'vitest'
import { PromptPilotConfigSchema } from '../src/schema'

describe('PromptPilotConfigSchema', () => {
  it('applies defaults for empty input', () => {
    const result = PromptPilotConfigSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.provider).toBe('openai')
      expect(result.data.temperature).toBe(0.2)
      expect(result.data.maxTokens).toBe(16000)
      expect(result.data.stream).toBe(true)
    }
  })

  it('rejects invalid temperature', () => {
    const result = PromptPilotConfigSchema.safeParse({ temperature: 5 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid provider', () => {
    const result = PromptPilotConfigSchema.safeParse({ provider: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('accepts valid provider config', () => {
    const result = PromptPilotConfigSchema.safeParse({
      provider: 'anthropic',
      providers: {
        anthropic: { apiKey: 'sk-test' },
      },
    })
    expect(result.success).toBe(true)
  })
})
