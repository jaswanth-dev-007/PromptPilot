import { encode } from 'gpt-tokenizer'

export function countTokens(text: string): number {
  return encode(text).length
}

const PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-3-5-haiku-20241022': { input: 0.0008, output: 0.004 },
  'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
}

export function estimateCost(inputTokens: number, outputTokens: number, model: string): number {
  const p = PRICING[model] || PRICING['gpt-4o']
  return (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return '< $0.01'
  return `$${cost.toFixed(2)}`
}
