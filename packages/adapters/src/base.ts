import { countTokens } from '@promptpilot/shared'
import type { Adapter, GenerateOptions, GenerationResult, HealthCheckResult } from './types'

export abstract class BaseAdapter implements Adapter {
  abstract readonly provider: string
  abstract readonly model: string
  abstract readonly maxContextTokens: number

  abstract generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>
  abstract generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>
  abstract healthCheck(): Promise<HealthCheckResult>

  countTokens(text: string): number {
    return countTokens(text)
  }

  protected async measureTiming<T>(
    fn: () => Promise<T>,
  ): Promise<{ result: T; durationMs: number }> {
    const start = performance.now()
    const result = await fn()
    return { result, durationMs: Math.round(performance.now() - start) }
  }

  protected validatePromptSize(prompt: string): void {
    const tokens = this.countTokens(prompt)
    if (tokens > this.maxContextTokens * 0.9) {
      throw new Error(
        `Prompt size (${tokens} tokens) exceeds 90% of model context window (${this.maxContextTokens} tokens)`,
      )
    }
  }
}
