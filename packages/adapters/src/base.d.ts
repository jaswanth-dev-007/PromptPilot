import type { Adapter, GenerateOptions, GenerationResult, HealthCheckResult } from './types'
export declare abstract class BaseAdapter implements Adapter {
  abstract readonly provider: string
  abstract readonly model: string
  abstract readonly maxContextTokens: number
  abstract generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>
  abstract generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>
  abstract healthCheck(): Promise<HealthCheckResult>
  countTokens(text: string): number
  protected measureTiming<T>(fn: () => Promise<T>): Promise<{
    result: T
    durationMs: number
  }>
  protected validatePromptSize(prompt: string): void
}
//# sourceMappingURL=base.d.ts.map
