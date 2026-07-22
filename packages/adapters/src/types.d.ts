export interface GenerateOptions {
  temperature: number
  maxTokens: number
  stream: boolean
  signal?: AbortSignal
}
export interface GenerationResult {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
  durationMs: number
  cost: number
}
export interface HealthCheckResult {
  ok: boolean
  latencyMs: number
  error?: string
}
export interface Adapter {
  readonly provider: string
  readonly model: string
  readonly maxContextTokens: number
  generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>
  generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>
  countTokens(text: string): number
  healthCheck(): Promise<HealthCheckResult>
}
//# sourceMappingURL=types.d.ts.map
