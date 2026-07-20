import { BaseAdapter } from './base'
import type { GenerateOptions, GenerationResult, HealthCheckResult } from './types'
import { AdapterError } from '@promptpilot/shared'
import { estimateCost } from '@promptpilot/shared'

const MODEL_CONTEXT_WINDOWS: Record<string, number> = {
  'claude-3-5-sonnet-20241022': 200000,
  'claude-3-5-haiku-20241022': 200000,
  'claude-opus-4-20250514': 200000,
}

export class AnthropicAdapter extends BaseAdapter {
  readonly provider = 'anthropic'
  readonly maxContextTokens: number

  constructor(
    readonly model: string,
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://api.anthropic.com',
  ) {
    super()
    this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 200000
  }

  async generate(prompt: string, options: GenerateOptions): Promise<GenerationResult> {
    this.validatePromptSize(prompt)

    const { result: response, durationMs } = await this.measureTiming(async () => {
      const res = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: options.signal,
      })

      if (!res.ok) {
        const body = await res.text()
        throw new AdapterError(
          `Anthropic API error (${res.status})`,
          'anthropic',
          res.status,
          res.status === 429
            ? 'Rate limited. Retrying...'
            : res.status === 401
              ? 'Invalid API key.'
              : 'Check your API key and try again.',
          new Error(body),
        )
      }
      return res.json() as Promise<AnthropicResponse>
    })

    const content = response.content
      .filter(c => c.type === 'text')
      .map(c => (c as { text: string }).text)
      .join('\n')

    return {
      content,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
      durationMs,
      cost: estimateCost(response.usage.input_tokens, response.usage.output_tokens, this.model),
    }
  }

  async *generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string> {
    this.validatePromptSize(prompt)
    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
      signal: options.signal,
    })

    if (!res.ok)
      throw new AdapterError(`Anthropic API error (${res.status})`, 'anthropic', res.status)

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              yield parsed.delta.text
            }
          } catch {
            /* skip malformed */
          }
        }
      }
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const start = performance.now()
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' },
      })
      return {
        ok: res.ok,
        latencyMs: Math.round(performance.now() - start),
        error: res.ok ? undefined : `HTTP ${res.status}`,
      }
    } catch (error) {
      return {
        ok: false,
        latencyMs: Math.round(performance.now() - start),
        error: (error as Error).message,
      }
    }
  }
}

interface AnthropicResponse {
  model: string
  content: Array<{ type: string; text?: string }>
  usage: { input_tokens: number; output_tokens: number }
}
