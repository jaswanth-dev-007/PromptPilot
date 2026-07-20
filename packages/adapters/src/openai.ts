import { BaseAdapter } from './base'
import type { GenerateOptions, GenerationResult, HealthCheckResult } from './types'
import { AdapterError } from '@promptpilot/shared'
import { estimateCost } from '@promptpilot/shared'

const MODEL_CONTEXT_WINDOWS: Record<string, number> = {
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4.1': 1000000,
}

export class OpenAIAdapter extends BaseAdapter {
  readonly provider = 'openai'
  readonly maxContextTokens: number

  constructor(
    readonly model: string,
    private readonly apiKey: string,
    private readonly baseUrl: string = 'https://api.openai.com',
  ) {
    super()
    this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 128000
  }

  async generate(prompt: string, options: GenerateOptions): Promise<GenerationResult> {
    this.validatePromptSize(prompt)

    const { result: response, durationMs } = await this.measureTiming(async () => {
      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: false,
        }),
        signal: options.signal,
      })

      if (!res.ok) {
        const body = await res.text()
        throw new AdapterError(
          `OpenAI API error (${res.status})`,
          'openai',
          res.status,
          res.status === 429
            ? 'Rate limited. Retrying with backoff...'
            : res.status === 401
              ? 'Invalid API key. Run `promptpilot config set providers.openai.apiKey <key>`.'
              : 'Check your API key and try again.',
          new Error(body),
        )
      }
      return res.json() as Promise<OpenAIResponse>
    })

    const choice = response.choices[0]
    const inputTokens = response.usage?.prompt_tokens || this.countTokens(prompt)
    const outputTokens =
      response.usage?.completion_tokens || this.countTokens(choice.message.content)

    return {
      content: choice.message.content,
      inputTokens,
      outputTokens,
      model: response.model,
      durationMs,
      cost: estimateCost(inputTokens, outputTokens, this.model),
    }
  }

  async *generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string> {
    this.validatePromptSize(prompt)
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        stream: true,
      }),
      signal: options.signal,
    })

    if (!res.ok) throw new AdapterError(`OpenAI API error (${res.status})`, 'openai', res.status)

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
        if (line.startsWith('data: ') && line.slice(6).trim() !== '[DONE]') {
          try {
            const parsed = JSON.parse(line.slice(6))
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch {
            /* skip malformed SSE */
          }
        }
      }
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const start = performance.now()
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
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

interface OpenAIResponse {
  model: string
  choices: Array<{ message: { content: string } }>
  usage?: { prompt_tokens: number; completion_tokens: number }
}
