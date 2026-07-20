# Backend Development Guide · PromptPilot

**Version:** 1.0.0
**Status:** Approved
**Author:** Chief Software Architect
**Last Updated:** 2026-07-19
**Source of Truth:** `docs/00_Master_Context.md` v1.0.0, `docs-output/PRD.md` v1.0.0, `docs-output/09_Implementation_Plan.md` v1.0.0

---

## 1. Backend Architecture Overview

PromptPilot's backend is a TypeScript CLI application distributed via npm. It is stateless, local-first, and has no server component in the open-source tier. The hosted tier (P3) adds a Node.js web server with PostgreSQL and Redis.

### 1.1 Technology Stack

| Layer                   | Technology               | Version      | Rationale                                                   | Reference                 |
| ----------------------- | ------------------------ | ------------ | ----------------------------------------------------------- | ------------------------- |
| **Runtime**             | Node.js                  | ≥ 20.x (LTS) | Active LTS, ES2022 support, wide platform compatibility     | Master Context §21        |
| **Language**            | TypeScript               | 5.x          | Type safety, strict mode, developer productivity            | Master Context §12        |
| **CLI Framework**       | Commander.js             | 13.x         | Most popular Node.js CLI framework, mature, well-documented | PRD FR-001 through FR-025 |
| **Interactive Prompts** | @inquirer/prompts        | 7.x          | Modern, typed, accessible interactive CLI prompts           | PRD FR-008                |
| **Output Formatting**   | chalk                    | 5.x          | Terminal color output with automatic color detection        | PRD FR-017, FR-018        |
| **Progress Indicators** | ora                      | 8.x          | Elegant terminal spinners with auto-disable for CI          | PRD §9 UX Principles      |
| **Markdown Parsing**    | marked                   | 15.x         | Fast CommonMark parser for validation                       | PRD FR-082                |
| **Validation**          | zod                      | 3.x          | Runtime type validation for config, CLI args, manifest      | PRD FR-007, FR-081        |
| **Logging**             | pino                     | 9.x          | Fast structured JSON logger, pretty-print for dev           | Shared package            |
| **HTTP Client**         | undici (built-in)        | —            | Zero-dependency HTTP client for LLM API calls               | Master Context §15.5      |
| **Token Counting**      | tiktoken / gpt-tokenizer | —            | Accurate token counting for OpenAI and Anthropic models     | PRD FR-059                |
| **File Watching**       | chokidar                 | 4.x          | Cross-platform file watching for `--watch` command          | PRD FR-011                |
| **Diff Generation**     | diff                     | 7.x          | Text diff for `diff` command                                | PRD FR-010                |
| **Testing**             | vitest                   | 2.x          | Fast, modern test runner with TypeScript support            | PRD §16                   |

### 1.2 Project Conventions

All code must follow the conventions established in the Master Context:

- **No semicolons** (Prettier default config).
- **Single quotes** for strings.
- **Trailing commas** in multi-line objects and arrays.
- **ES module syntax** (`import`/`export`, not `require`/`module.exports`).
- **Path aliases** for cross-package imports: `@promptpilot/core`, `@promptpilot/adapters`, etc.
- **TypeScript strict mode** enabled. No exceptions.
- **No `any`** without a documented justification comment.
- **Functions ≤ 30 lines.** Extract helpers when needed.
- **Pure functions preferred.** Side effects isolated to command handlers.

### 1.3 Package Dependency Graph

```
┌──────────┐
│   cli    │  → @promptpilot/core, @promptpilot/adapters, @promptpilot/validators,
└────┬─────┘    @promptpilot/fs, @promptpilot/config, @promptpilot/shared
     │
┌────▼─────┐
│   core   │  → @promptpilot/adapters, @promptpilot/validators,
└────┬─────┘    @promptpilot/fs, @promptpilot/config, @promptpilot/shared
     │
┌────▼──────┐
│ adapters  │  → @promptpilot/config, @promptpilot/shared
└───────────┘

┌───────────┐
│ validators│  → @promptpilot/fs, @promptpilot/shared
└───────────┘

┌──────────┐
│    fs    │  → @promptpilot/shared
└──────────┘

┌──────────┐
│  config  │  → @promptpilot/fs, @promptpilot/shared
└──────────┘

┌──────────┐
│  shared  │  → No internal dependencies (leaf package)
└──────────┘
```

The graph is strictly acyclic. `shared` is the leaf. `cli` is the root. This constraint is enforced by ESLint rules.

---

## 2. Shared Package (`packages/shared`)

The shared package is the foundation. Every other package depends on it. It must remain dependency-free (no external npm packages beyond devDependencies).

### 2.1 Module: Errors (`src/errors.ts`)

Every error thrown by PromptPilot must extend `PromptPilotError`.

```typescript
export class PromptPilotError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestion?: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'PromptPilotError'
  }

  toUserMessage(): string {
    let msg = `[ERROR] ${this.message}`
    if (this.suggestion) {
      msg += `\n  Suggestion: ${this.suggestion}`
    }
    if (this.cause instanceof Error) {
      msg += `\n  Cause: ${this.cause.message}`
    }
    return msg
  }
}

export class ConfigError extends PromptPilotError {
  constructor(message: string, suggestion?: string, cause?: unknown) {
    super(message, 'CONFIG_ERROR', suggestion, cause)
    this.name = 'ConfigError'
  }
}

export class ValidationError extends PromptPilotError {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly line?: number,
    suggestion?: string,
  ) {
    super(message, 'VALIDATION_ERROR', suggestion)
    this.name = 'ValidationError'
  }
}

export class AdapterError extends PromptPilotError {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    suggestion?: string,
    cause?: unknown,
  ) {
    super(message, 'ADAPTER_ERROR', suggestion, cause)
    this.name = 'AdapterError'
  }
}

export class PipelineError extends PromptPilotError {
  constructor(
    message: string,
    public readonly stepId: string,
    suggestion?: string,
  ) {
    super(message, 'PIPELINE_ERROR', suggestion)
    this.name = 'PipelineError'
  }
}

export class FileSystemError extends PromptPilotError {
  constructor(
    message: string,
    public readonly filePath: string,
    suggestion?: string,
    cause?: unknown,
  ) {
    super(message, 'FS_ERROR', suggestion, cause)
    this.name = 'FileSystemError'
  }
}
```

### 2.2 Module: Logger (`src/logger.ts`)

Use pino for structured logging. Pretty-print in development, JSON in production (CI).

```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss' },
        },
})

// Never log these keys — they may contain API keys or sensitive data
const REDACTED_KEYS = ['apiKey', 'api_key', 'authorization', 'token', 'secret']

export function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (REDACTED_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      result[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = redactSensitive(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result
}
```

### 2.3 Module: Token Counter (`src/tokens.ts`)

Accurate token counting for cost estimation and context window management.

```typescript
import { getEncoding } from 'js-tiktoken'

// Cache encodings — they're expensive to create
const encodingCache = new Map<string, ReturnType<typeof getEncoding>>()

function getEncodingForModel(model: string) {
  const key = model.startsWith('gpt') ? 'cl100k_base' : 'cl100k_base'
  if (!encodingCache.has(key)) {
    encodingCache.set(key, getEncoding(key))
  }
  return encodingCache.get(key)!
}

export function countTokens(text: string, model: string = 'gpt-4o'): number {
  const encoding = getEncodingForModel(model)
  return encoding.encode(text).length
}

export function estimateCost(inputTokens: number, outputTokens: number, model: string): number {
  // Pricing in USD per 1K tokens as of 2026-07
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-5-haiku': { input: 0.0008, output: 0.004 },
    'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
  }
  const p = pricing[model] || pricing['gpt-4o']
  return (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return '< $0.01'
  return `$${cost.toFixed(2)}`
}
```

---

## 3. Configuration Package (`packages/config`)

### 3.1 Configuration Resolution

Configuration is resolved from 5 sources in priority order (later overrides earlier):

1. **Hardcoded defaults** in `src/defaults.ts`.
2. **Global config file** at `~/.promptpilot/config.json`.
3. **Project config file** at `<project>/promptpilot.json`.
4. **Environment variables** (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.).
5. **CLI flags** (`--model`, `--temperature`, etc.).

```typescript
import { z } from 'zod'

export const ProviderConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  defaultModel: z.string().optional(),
})

export const PromptPilotConfigSchema = z.object({
  version: z.string().optional(),
  provider: z.enum(['openai', 'anthropic', 'google', 'ollama']).default('openai'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.2),
  maxTokens: z.number().min(100).max(200000).default(16000),
  outputDir: z.string().default('./docs-output'),
  promptDir: z.string().default('./docs'),
  stream: z.boolean().default(true),
  parallel: z.boolean().default(false),
  providers: z
    .object({
      openai: ProviderConfigSchema.optional(),
      anthropic: ProviderConfigSchema.optional(),
      google: ProviderConfigSchema.optional(),
      ollama: ProviderConfigSchema.optional(),
    })
    .default({}),
  hooks: z
    .object({
      preGenerate: z.string().optional(),
      postGenerate: z.string().optional(),
    })
    .optional(),
})

export type PromptPilotConfig = z.infer<typeof PromptPilotConfigSchema>
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>
```

### 3.2 Config Loader

```typescript
import { readJsonFile } from '@promptpilot/fs'
import { ConfigError } from '@promptpilot/shared'
import { PromptPilotConfigSchema, type PromptPilotConfig } from './schema'
import { DEFAULT_CONFIG } from './defaults'

export async function loadConfig(
  projectDir: string,
  cliOverrides: Partial<PromptPilotConfig> = {},
): Promise<PromptPilotConfig> {
  // 1. Start with defaults
  let config = { ...DEFAULT_CONFIG }

  // 2. Merge global config
  try {
    const global = await readJsonFile(`${process.env.HOME}/.promptpilot/config.json`)
    config = deepMerge(config, global)
  } catch {
    // Global config is optional — no error if missing
  }

  // 3. Merge project config
  try {
    const project = await readJsonFile(`${projectDir}/promptpilot.json`)
    config = deepMerge(config, project)
  } catch {
    // Project config is optional — no error if missing
  }

  // 4. Merge environment variables
  config = mergeEnvVars(config)

  // 5. Merge CLI overrides
  config = deepMerge(config, cliOverrides)

  // 6. Validate
  const result = PromptPilotConfigSchema.safeParse(config)
  if (!result.success) {
    throw new ConfigError(
      `Invalid configuration: ${result.error.message}`,
      'Run `promptpilot config init` to reconfigure.',
    )
  }

  return result.data
}

function mergeEnvVars(config: PromptPilotConfig): PromptPilotConfig {
  const env = { ...config }
  if (process.env.OPENAI_API_KEY) {
    env.providers.openai = { ...env.providers.openai, apiKey: process.env.OPENAI_API_KEY }
  }
  if (process.env.ANTHROPIC_API_KEY) {
    env.providers.anthropic = { ...env.providers.anthropic, apiKey: process.env.ANTHROPIC_API_KEY }
  }
  if (process.env.GOOGLE_API_KEY) {
    env.providers.google = { ...env.providers.google, apiKey: process.env.GOOGLE_API_KEY }
  }
  return env
}
```

### 3.3 Adding a New Config Value

When adding a new configuration value, follow this checklist:

1. Add the field to `PromptPilotConfigSchema` in `schema.ts` with a sensible default.
2. Add the default value to `DEFAULT_CONFIG` in `defaults.ts`.
3. If it can be set via environment variable, add parsing logic in `mergeEnvVars`.
4. If it can be set via CLI flag, add the flag to the appropriate command in `packages/cli`.
5. Add a test case in `test/config.test.ts` for each resolution priority.
6. Update `config list` output to display the new value.

---

## 4. File System Package (`packages/fs`)

### 4.1 Design Principles

- All file I/O is async (promise-based `fs/promises`).
- Paths are normalized to use forward slashes regardless of OS.
- Atomic writes prevent corruption on process termination (NFR-R04).
- File reading includes caching for repeated reads during pipeline execution.

### 4.2 Module: Reader (`src/reader.ts`)

```typescript
import { readFile, stat } from 'fs/promises'
import { FileSystemError } from '@promptpilot/shared'

// Simple in-memory cache scoped to the current pipeline execution
const cache = new Map<string, { content: string; mtime: Date }>()

export async function readTextFile(filePath: string): Promise<string> {
  try {
    const stats = await stat(filePath)
    const cached = cache.get(filePath)

    // Return cached content if file hasn't changed
    if (cached && cached.mtime.getTime() === stats.mtimeMs) {
      return cached.content
    }

    const content = await readFile(filePath, 'utf-8')
    cache.set(filePath, { content, mtime: new Date(stats.mtimeMs) })
    return content
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileSystemError(
        `File not found: ${filePath}`,
        filePath,
        'Ensure the file exists. Run `promptpilot validate` to check your project structure.',
      )
    }
    throw new FileSystemError(
      `Failed to read file: ${filePath}`,
      filePath,
      'Check file permissions and disk space.',
      error,
    )
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readTextFile(filePath)
  try {
    return JSON.parse(content) as T
  } catch (error) {
    throw new FileSystemError(
      `Invalid JSON in file: ${filePath}`,
      filePath,
      'Check the file for syntax errors. Use a JSON validator.',
      error,
    )
  }
}

export function clearCache(): void {
  cache.clear()
}
```

### 4.3 Module: Writer (`src/writer.ts`)

```typescript
import { writeFile, rename, mkdir, unlink } from 'fs/promises'
import { dirname } from 'path'
import { FileSystemError } from '@promptpilot/shared'

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath))
  try {
    await writeFile(filePath, content, 'utf-8')
  } catch (error) {
    throw new FileSystemError(
      `Failed to write file: ${filePath}`,
      filePath,
      'Check disk space and directory permissions.',
      error,
    )
  }
}

export async function atomicWrite(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath))
  const tmpPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`

  try {
    // Write to temp file first
    await writeFile(tmpPath, content, 'utf-8')
    // Atomic rename (on same filesystem)
    await rename(tmpPath, filePath)
  } catch (error) {
    // Clean up temp file on failure
    try {
      await unlink(tmpPath)
    } catch {
      /* ignore cleanup errors */
    }
    throw new FileSystemError(
      `Failed to write file atomically: ${filePath}`,
      filePath,
      'Check disk space and directory permissions.',
      error,
    )
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    throw new FileSystemError(
      `Failed to create directory: ${dirPath}`,
      dirPath,
      'Check parent directory permissions.',
      error,
    )
  }
}
```

### 4.4 Module: Scaffold (`src/scaffold.ts`)

```typescript
import { join } from 'path'
import { writeTextFile } from './writer'

interface ScaffoldOptions {
  projectName: string
  description: string
  audience: string
  platform: string
  domain: string
}

export async function scaffoldProject(
  targetDir: string,
  options: ScaffoldOptions,
): Promise<string[]> {
  const created: string[] = []

  // Create docs-output/ directory with .gitkeep
  await writeTextFile(join(targetDir, 'docs-output', '.gitkeep'), '')
  created.push('docs-output/.gitkeep')

  // Copy and populate prompt templates
  const templates = getTemplatePaths()
  for (const template of templates) {
    const content = populateTemplate(template, options)
    const destPath = join(targetDir, 'docs', template.fileName)
    await writeTextFile(destPath, content)
    created.push(`docs/${template.fileName}`)
  }

  // Create promptpilot.json with default config
  const manifestContent = generateManifest(options)
  await writeTextFile(join(targetDir, 'promptpilot.json'), manifestContent)
  created.push('promptpilot.json')

  // Create output placeholders
  const artifacts = [
    'PRD.md',
    'SRS.md',
    'Architecture.md',
    'Database.md',
    'API.md',
    'UserFlow.md',
    'Wireframes.md',
    'Roadmap.md',
  ]
  for (const artifact of artifacts) {
    const content = generateArtifactPlaceholder(artifact)
    await writeTextFile(join(targetDir, 'docs-output', artifact), content)
    created.push(`docs-output/${artifact}`)
  }

  return created
}
```

---

## 5. Adapters Package (`packages/adapters`)

### 5.1 Adapter Interface (`src/base.ts`)

```typescript
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
```

### 5.2 Base Adapter (`src/base.ts`)

```typescript
import { countTokens } from '@promptpilot/shared'
import type { Adapter, GenerateOptions, GenerationResult } from './types'

export abstract class BaseAdapter implements Adapter {
  abstract readonly provider: string
  abstract readonly model: string
  abstract readonly maxContextTokens: number

  abstract generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>
  abstract generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>
  abstract healthCheck(): Promise<{ ok: boolean; latencyMs: number; error?: string }>

  countTokens(text: string): number {
    return countTokens(text, this.model)
  }

  protected measureTiming<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
    const start = performance.now()
    return fn().then(result => ({
      result,
      durationMs: Math.round(performance.now() - start),
    }))
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
```

### 5.3 OpenAI Adapter (`src/openai.ts`)

```typescript
import { BaseAdapter } from './base'
import type { GenerateOptions, GenerationResult } from './types'
import { AdapterError } from '@promptpilot/shared'
import { estimateCost } from '@promptpilot/shared'

interface OpenAIConfig {
  apiKey: string
  baseUrl?: string
}

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
    private readonly config: OpenAIConfig,
  ) {
    super()
    this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 128000
  }

  async generate(prompt: string, options: GenerateOptions): Promise<GenerationResult> {
    this.validatePromptSize(prompt)

    const { result: response, durationMs } = await this.measureTiming(async () => {
      const res = await fetch(
        `${this.config.baseUrl || 'https://api.openai.com'}/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            stream: false,
          }),
          signal: options.signal,
        },
      )

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

    const res = await fetch(
      `${this.config.baseUrl || 'https://api.openai.com'}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: true,
        }),
        signal: options.signal,
      },
    )

    if (!res.ok) {
      const body = await res.text()
      throw new AdapterError(
        `OpenAI API error (${res.status})`,
        'openai',
        res.status,
        'Check your API key and try again.',
        new Error(body),
      )
    }

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
          const data = line.slice(6).trim()
          if (data === '[DONE]') return
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    }
  }

  async healthCheck() {
    const start = performance.now()
    try {
      const res = await fetch(`${this.config.baseUrl || 'https://api.openai.com'}/v1/models`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
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
```

### 5.4 Anthropic Adapter (`src/anthropic.ts`)

```typescript
import { BaseAdapter } from './base'
import type { GenerateOptions, GenerationResult } from './types'
import { AdapterError } from '@promptpilot/shared'
import { estimateCost } from '@promptpilot/shared'

interface AnthropicConfig {
  apiKey: string
  baseUrl?: string
}

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
    private readonly config: AnthropicConfig,
  ) {
    super()
    this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 200000
  }

  async generate(prompt: string, options: GenerateOptions): Promise<GenerationResult> {
    this.validatePromptSize(prompt)

    const { result: response, durationMs } = await this.measureTiming(async () => {
      const res = await fetch(`${this.config.baseUrl || 'https://api.anthropic.com'}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
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
            ? 'Rate limited. Retrying with backoff...'
            : res.status === 401
              ? 'Invalid API key. Run `promptpilot config set providers.anthropic.apiKey <key>`.'
              : 'Check your API key and try again.',
          new Error(body),
        )
      }

      return res.json() as Promise<AnthropicResponse>
    })

    const content = response.content
      .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
      .map(block => block.text)
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

    const res = await fetch(`${this.config.baseUrl || 'https://api.anthropic.com'}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
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

    if (!res.ok) {
      const body = await res.text()
      throw new AdapterError(
        `Anthropic API error (${res.status})`,
        'anthropic',
        res.status,
        'Check your API key and try again.',
        new Error(body),
      )
    }

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
          const data = line.slice(6).trim()
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              yield parsed.delta.text
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    }
  }

  async healthCheck() {
    const start = performance.now()
    try {
      // Anthropic doesn't have a lightweight health endpoint, so we list models
      const res = await fetch(`${this.config.baseUrl || 'https://api.anthropic.com'}/v1/models`, {
        headers: { 'x-api-key': this.config.apiKey, 'anthropic-version': '2023-06-01' },
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
```

### 5.5 Retry Logic (`src/retry.ts`)

```typescript
import { AdapterError } from '@promptpilot/shared'
import { logger } from '@promptpilot/shared'

export interface RetryOptions {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 16000,
}

export function isRetryable(error: unknown): boolean {
  if (error instanceof AdapterError) {
    // Retry on rate limits and server errors
    if (error.statusCode === 429 || (error.statusCode && error.statusCode >= 500)) {
      return true
    }
  }
  // Retry on network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }
  return false
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }
  let lastError: unknown

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === opts.maxRetries || !isRetryable(error)) {
        throw error
      }
      const delay = Math.min(opts.baseDelayMs * Math.pow(2, attempt), opts.maxDelayMs)
      logger.warn({ attempt: attempt + 1, delayMs: delay }, 'Retrying after error')
      await sleep(delay)
    }
  }

  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 5.6 Adapter Factory (`src/factory.ts`)

```typescript
import type { Adapter } from './types'
import type { PromptPilotConfig } from '@promptpilot/config'
import { ConfigError } from '@promptpilot/shared'
import { OpenAIAdapter } from './openai'
import { AnthropicAdapter } from './anthropic'

export function createAdapter(config: PromptPilotConfig): Adapter {
  const provider = config.provider
  const model = config.model || getDefaultModel(provider)

  switch (provider) {
    case 'openai': {
      const apiKey = config.providers.openai?.apiKey
      if (!apiKey) {
        throw new ConfigError(
          'OpenAI API key not configured.',
          'Set OPENAI_API_KEY environment variable or run `promptpilot config set providers.openai.apiKey <key>`.',
        )
      }
      return new OpenAIAdapter(model, { apiKey, baseUrl: config.providers.openai?.baseUrl })
    }
    case 'anthropic': {
      const apiKey = config.providers.anthropic?.apiKey
      if (!apiKey) {
        throw new ConfigError(
          'Anthropic API key not configured.',
          'Set ANTHROPIC_API_KEY environment variable or run `promptpilot config set providers.anthropic.apiKey <key>`.',
        )
      }
      return new AnthropicAdapter(model, { apiKey, baseUrl: config.providers.anthropic?.baseUrl })
    }
    case 'google':
      throw new ConfigError(
        'Google AI adapter is not yet implemented (P2 feature).',
        'Use "openai" or "anthropic" as your provider for now.',
      )
    case 'ollama':
      throw new ConfigError(
        'Ollama adapter is not yet implemented (P1 feature).',
        'Use "openai" or "anthropic" as your provider for now.',
      )
  }
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case 'openai':
      return 'gpt-4o'
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022'
    case 'google':
      return 'gemini-2.0-flash'
    case 'ollama':
      return 'llama3.1'
    default:
      return 'gpt-4o'
  }
}

// Auto-detect available providers from environment
export function detectAvailableProviders(): string[] {
  const available: string[] = []
  if (process.env.OPENAI_API_KEY) available.push('openai')
  if (process.env.ANTHROPIC_API_KEY) available.push('anthropic')
  if (process.env.GOOGLE_API_KEY) available.push('google')
  // Ollama is always "available" — we check connectivity at runtime
  available.push('ollama')
  return available
}
```

### 5.7 Adding a New Adapter

When adding a new LLM provider adapter, follow this checklist:

1. Create `src/<provider>.ts` extending `BaseAdapter`.
2. Implement `generate()`, `generateStream()`, and `healthCheck()`.
3. Add the provider to the `PROVIDERS` enum in config schema.
4. Add pricing to `estimateCost()` in `packages/shared/src/tokens.ts`.
5. Add the case to `createAdapter()` in `src/factory.ts`.
6. Add the provider to `detectAvailableProviders()`.
7. Write unit tests with mocked HTTP responses.
8. Write an integration test that calls the real API (skipped in CI without API key).
9. Update `config init` to prompt for the new provider.
10. Update README with provider setup instructions.

---

## 6. Pipeline Engine (`packages/core`)

### 6.1 Pipeline Types

```typescript
export interface PipelineStep {
  id: string
  name: string
  promptPath: string
  outputPath: string
  dependencies: string[]
  parallelSafe: boolean
  recommendedModels: string[]
}

export interface Artifact {
  path: string
  exists: boolean
  lastModified: Date | null
  stale: boolean
  staleReason?: string
}

export interface PipelineState {
  steps: Map<string, PipelineStep>
  artifacts: Map<string, Artifact>
  completed: string[]
  pending: string[]
  stale: string[]
  next: PipelineStep | null
  parallelGroups: PipelineStep[][]
}

export interface PipelineResult {
  completedSteps: string[]
  failedSteps: string[]
  totalTokens: number
  totalCost: number
  totalDurationMs: number
  artifacts: Map<string, string>
}
```

### 6.2 State Detector

```typescript
import { stat } from 'fs/promises'
import { join } from 'path'
import type { PipelineStep, Artifact, PipelineState } from './types'
import type { PipelineManifest } from '../manifest/types'

export async function detectState(
  manifest: PipelineManifest,
  outputDir: string,
): Promise<PipelineState> {
  const steps = new Map<string, PipelineStep>()
  const artifacts = new Map<string, Artifact>()
  const completed: string[] = []

  // Check each artifact
  for (const step of manifest.pipeline) {
    steps.set(step.id, step)
    const artifactPath = join(outputDir, step.output)

    try {
      const stats = await stat(artifactPath)
      const artifact: Artifact = {
        path: artifactPath,
        exists: true,
        lastModified: stats.mtime,
        stale: false,
      }
      artifacts.set(step.id, artifact)
      completed.push(step.id)
    } catch {
      // Artifact doesn't exist — not completed
      artifacts.set(step.id, {
        path: artifactPath,
        exists: false,
        lastModified: null,
        stale: false,
      })
    }
  }

  // Check for stale artifacts
  const stale: string[] = []
  for (const stepId of completed) {
    const step = steps.get(stepId)!
    for (const depId of step.dependencies) {
      const depArtifact = artifacts.get(depId)
      const currentArtifact = artifacts.get(stepId)
      if (
        depArtifact?.lastModified &&
        currentArtifact?.lastModified &&
        depArtifact.lastModified > currentArtifact.lastModified
      ) {
        currentArtifact.stale = true
        currentArtifact.staleReason = `Upstream artifact "${depId}" was modified after this artifact was generated.`
        stale.push(stepId)
        break
      }
    }
  }

  // Find next step
  const next = findNextStep(steps, completed, stale)

  // Compute parallel groups
  const pending = manifest.pipeline.filter(s => !completed.includes(s.id)).map(s => s.id)
  const parallelGroups = computeParallelGroups(manifest, completed)

  return { steps, artifacts, completed, pending, stale, next, parallelGroups }
}

function findNextStep(
  steps: Map<string, PipelineStep>,
  completed: string[],
  _stale: string[],
): PipelineStep | null {
  for (const [id, step] of steps) {
    if (completed.includes(id)) continue
    const depsSatisfied = step.dependencies.every(depId => completed.includes(depId))
    if (depsSatisfied) return step
  }
  return null
}

function computeParallelGroups(manifest: PipelineManifest, completed: string[]): PipelineStep[][] {
  const pending = manifest.pipeline.filter(s => !completed.includes(s.id))
  const ready = pending.filter(s => s.dependencies.every(depId => completed.includes(depId)))

  // Group parallel-safe steps that are independent
  const groups: PipelineStep[][] = []
  const remaining = new Set(ready)

  while (remaining.size > 0) {
    const group: PipelineStep[] = []
    for (const step of remaining) {
      if (step.parallelSafe) {
        group.push(step)
        remaining.delete(step)
      }
    }
    // If no parallel-safe steps, take the first remaining step
    if (group.length === 0) {
      const first = remaining.values().next().value!
      group.push(first)
      remaining.delete(first)
    }
    groups.push(group)
  }

  return groups
}
```

### 6.3 Context Assembler

```typescript
import { readTextFile } from '@promptpilot/fs'
import { countTokens } from '@promptpilot/shared'
import type { PipelineStep, Artifact } from './types'
import type { PromptTemplate } from '../prompts/types'

export interface ContextAssemblyOptions {
  maxTokens: number
  truncate: boolean
}

export async function assembleContext(
  step: PipelineStep,
  artifacts: Map<string, Artifact>,
  template: PromptTemplate,
  options: ContextAssemblyOptions,
): Promise<string> {
  let context = ''

  // Read all upstream artifacts in dependency order
  for (const depId of step.dependencies) {
    const artifact = artifacts.get(depId)
    if (!artifact?.exists) continue

    const content = await readTextFile(artifact.path)
    context += `\n\n---\n## Context: ${depId}\n---\n\n${content}`
  }

  // Combine template instructions with context
  let prompt = template.content.replace('{CONTEXT}', context)

  // Truncate if needed
  if (options.truncate) {
    const tokens = countTokens(prompt)
    if (tokens > options.maxTokens * 0.9) {
      prompt = truncateContext(prompt, options.maxTokens)
    }
  }

  return prompt
}

function truncateContext(prompt: string, maxTokens: number): string {
  // Preserve headers and first paragraph of each section
  // Truncate body text to fit within token budget
  const sections = prompt.split(/\n(?=###?\s)/)
  const headerSection = sections[0] // Always keep the first section (instructions)
  let result = headerSection
  let currentTokens = countTokens(result)

  for (let i = 1; i < sections.length; i++) {
    const sectionTokens = countTokens(sections[i])
    if (currentTokens + sectionTokens > maxTokens * 0.9) {
      // Truncate this section to fit
      const lines = sections[i].split('\n')
      const header = lines[0]
      const body = lines.slice(1).join('\n')
      const availableTokens = maxTokens * 0.9 - currentTokens - countTokens(header) - 50

      if (availableTokens > 0) {
        const truncatedBody = body.slice(0, availableTokens * 4) // Rough char estimate
        result += `\n${header}\n${truncatedBody}\n\n[Content truncated due to context window limits. The most recent sections are preserved.]`
      } else {
        result += `\n\n[Additional context truncated — ${sections.length - i} sections omitted due to context window limits.]`
      }
      break
    }
    result += `\n${sections[i]}`
    currentTokens += sectionTokens
  }

  return result
}
```

---

## 7. Prompt Manager (`packages/core/src/prompts`)

### 7.1 Template Loader

```typescript
import { readTextFile } from '@promptpilot/fs'
import { FileSystemError } from '@promptpilot/shared'

export interface PromptTemplate {
  path: string
  content: string
  variables: string[]
  sections: string[]
}

export async function loadTemplate(
  templatePath: string,
  variables: Record<string, string>,
): Promise<PromptTemplate> {
  let content = await readTextFile(templatePath)

  // Inject variables
  const variableNames = extractVariables(content)
  for (const name of variableNames) {
    const value = variables[name] || ''
    content = content.replaceAll(`{${name}}`, sanitizeVariable(value))
  }

  // Warn about unresolved variables
  const unresolved = extractVariables(content)
  if (unresolved.length > 0) {
    // Don't throw — the LLM may infer reasonable defaults
    // But log a warning for the user
  }

  // Extract section headers for validation
  const sections = extractSections(content)

  return { path: templatePath, content, variables: variableNames, sections }
}

function extractVariables(content: string): string[] {
  const matches = content.matchAll(/\{([A-Z_][A-Z0-9_]*)\}/g)
  return [...new Set([...matches].map(m => m[1]))]
}

function sanitizeVariable(value: string): string {
  return value.replace(/`/g, '\\`').replace(/\{/g, '\\{').replace(/\}/g, '\\}').trim()
}

function extractSections(content: string): string[] {
  const matches = content.matchAll(/^#{1,4}\s+(.+)$/gm)
  return [...matches].map(m => m[1])
}
```

---

## 8. Validation Engine (`packages/validators`)

### 8.1 Structural Validator

```typescript
import type { PromptTemplate } from '@promptpilot/core'
import { ValidationError } from '@promptpilot/shared'

interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  filePath: string
  line?: number
  message: string
  rule: string
}

interface ValidationReport {
  issues: ValidationIssue[]
  score: number
  passed: boolean
}

export function validateStructure(
  artifactPath: string,
  content: string,
  template: PromptTemplate,
): ValidationReport {
  const issues: ValidationIssue[] = []

  // Required sections check
  for (const section of template.sections) {
    if (!content.includes(section)) {
      issues.push({
        type: 'error',
        filePath: artifactPath,
        message: `Missing required section: "${section}"`,
        rule: 'required-section',
      })
    }
  }

  // Heading hierarchy check
  issues.push(...validateHeadingHierarchy(artifactPath, content))

  // Empty section check
  issues.push(...validateEmptySections(artifactPath, content))

  // Placeholder check (TBD, TODO, Lorem ipsum)
  issues.push(...validateNoPlaceholders(artifactPath, content))

  const errors = issues.filter(i => i.type === 'error').length
  const warnings = issues.filter(i => i.type === 'warning').length
  const score = Math.max(0, 100 - errors * 20 - warnings * 5)
  const passed = errors === 0

  return { issues, score, passed }
}

function validateHeadingHierarchy(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const headers = content.matchAll(/^(#{1,6})\s+(.+)$/gm)
  let prevLevel = 0

  for (const match of headers) {
    const level = match[1].length
    const text = match[2]
    if (level > prevLevel + 1 && prevLevel > 0) {
      issues.push({
        type: 'warning',
        filePath,
        message: `Heading "${text}" jumps from H${prevLevel} to H${level}. Skipped heading levels are an accessibility issue.`,
        rule: 'heading-hierarchy',
      })
    }
    prevLevel = level
  }

  return issues
}

function validateEmptySections(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  // Find sections that have a header but no content before the next header
  const sections = content.split(/\n(?=#{1,4}\s)/)
  for (const section of sections) {
    const lines = section.split('\n')
    if (lines.length <= 2) {
      issues.push({
        type: 'warning',
        filePath,
        message: `Section appears to be empty or very short: "${lines[0]?.replace(/^#+\s*/, '')}"`,
        rule: 'empty-section',
      })
    }
  }
  return issues
}

function validateNoPlaceholders(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const patterns = [
    { pattern: /\bTODO\b/g, label: 'TODO' },
    { pattern: /\bTBD\b/g, label: 'TBD' },
    { pattern: /Lorem ipsum/gi, label: 'Lorem ipsum placeholder text' },
    { pattern: /\[PLACEHOLDER\]/g, label: '[PLACEHOLDER] tag' },
  ]

  for (const { pattern, label } of patterns) {
    const matches = content.match(pattern)
    if (matches) {
      issues.push({
        type: 'warning',
        filePath,
        message: `Found ${matches.length} instance(s) of "${label}" — may indicate incomplete content.`,
        rule: 'no-placeholders',
      })
    }
  }

  return issues
}
```

### 8.2 Markdown Validator

````typescript
import { marked } from 'marked'
import { ValidationError } from '@promptpilot/shared'

export function validateMarkdown(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check for unclosed code blocks
  const codeBlockStarts = (content.match(/```/g) || []).length
  if (codeBlockStarts % 2 !== 0) {
    issues.push({
      type: 'error',
      filePath,
      message: 'Unclosed code block detected. Every ``` must have a matching ```.',
      rule: 'markdown-code-block',
    })
  }

  // Check for broken tables
  const tableRows = content.match(/^\|.+\|$/gm) || []
  if (tableRows.length > 0) {
    // A table must have at least a header row and separator row
    if (tableRows.length < 2) {
      issues.push({
        type: 'error',
        filePath,
        message:
          'Incomplete table detected. Tables require at least a header row and a separator row.',
        rule: 'markdown-table',
      })
    }
  }

  // Check for valid links
  const brokenLinks = content.match(/\[([^\]]+)\]\(\s*\)/g)
  if (brokenLinks) {
    issues.push({
      type: 'warning',
      filePath,
      message: `Found ${brokenLinks.length} link(s) with empty URLs.`,
      rule: 'markdown-empty-link',
    })
  }

  // Validate with marked parser
  try {
    marked.parse(content)
  } catch (error) {
    issues.push({
      type: 'error',
      filePath,
      message: `Markdown parsing failed: ${(error as Error).message}`,
      rule: 'markdown-parse',
    })
  }

  return issues
}
````

---

## 9. CLI Layer (`packages/cli`)

### 9.1 Entry Point (`src/cli.ts`)

```typescript
#!/usr/bin/env node
import { Command } from 'commander'
import { registerInitCommand } from './commands/init'
import { registerRunCommand } from './commands/run'
import { registerValidateCommand } from './commands/validate'
import { registerConfigCommand } from './commands/config'
import { registerStatusCommand } from './commands/status'
import { checkNodeVersion } from './middleware/checks'

const program = new Command()

program
  .name('promptpilot')
  .description('AI-powered software planning pipeline')
  .version('1.0.0')
  .option('--no-color', 'Disable color output')
  .option('--plain', 'Plain text output (screen-reader friendly)')
  .hook('preAction', async () => {
    await checkNodeVersion()
  })

registerInitCommand(program)
registerRunCommand(program)
registerValidateCommand(program)
registerConfigCommand(program)
registerStatusCommand(program)

program.parse()
```

### 9.2 Command Pattern: `init`

```typescript
import { Command } from 'commander'
import { input, select } from '@inquirer/prompts'
import { scaffoldProject } from '@promptpilot/fs'
import { loadConfig } from '@promptpilot/config'
import { logger } from '@promptpilot/shared'
import chalk from 'chalk'

export function registerInitCommand(program: Command): void {
  program
    .command('init [project-name]')
    .description('Scaffold a new PromptPilot project')
    .option('-d, --description <desc>', 'One-line product description')
    .option('-a, --audience <audience>', 'Target audience')
    .option('-p, --platform <platform>', 'Target platform')
    .option('--domain <domain>', 'Industry domain')
    .option('--yes', 'Skip prompts, use defaults or flag values')
    .action(async (projectName, options) => {
      const { noColor, plain } = program.opts()
      const c = noColor ? new chalk.Instance({ level: 0 }) : chalk

      // Collect inputs
      const name =
        projectName ||
        (await input({
          message: 'Project name:',
          default: 'my-project',
        }))

      const description =
        options.description ||
        (await input({
          message: 'One-line description:',
          default: 'A new software project',
        }))

      const audience =
        options.audience ||
        (await select({
          message: 'Target audience:',
          choices: [
            { value: 'developers', name: 'Developers' },
            { value: 'product-managers', name: 'Product Managers' },
            { value: 'business-users', name: 'Business Users' },
            { value: 'general-public', name: 'General Public' },
          ],
        }))

      const platform =
        options.platform ||
        (await select({
          message: 'Platform:',
          choices: [
            { value: 'web', name: 'Web Application' },
            { value: 'mobile', name: 'Mobile App' },
            { value: 'api', name: 'API / Backend Service' },
            { value: 'cli', name: 'CLI Tool' },
            { value: 'desktop', name: 'Desktop Application' },
          ],
        }))

      const domain =
        options.domain ||
        (await input({
          message: 'Industry / Domain:',
          default: 'Technology',
        }))

      // Scaffold
      const targetDir = `./${name}`
      console.log(c.blue(`\nScaffolding project in ${targetDir}...\n`))

      const files = await scaffoldProject(targetDir, {
        projectName: name,
        description,
        audience,
        platform,
        domain,
      })

      console.log(c.green(`\n[SUCCESS] Project "${name}" created with ${files.length} files:\n`))
      for (const file of files) {
        console.log(`  ${file}`)
      }

      console.log(c.blue('\nNext step:'))
      console.log(`  cd ${name}`)
      console.log(`  promptpilot run          # Generate your first artifact (PRD)\n`)
    })
}
```

### 9.3 Command Pattern: `run`

```typescript
import { Command } from 'commander'
import { detectState, assembleContext, PipelineRunner } from '@promptpilot/core'
import { loadManifest } from '@promptpilot/core'
import { loadTemplate } from '@promptpilot/core'
import { loadConfig } from '@promptpilot/config'
import { createAdapter } from '@promptpilot/adapters'
import { validateStructure, validateMarkdown } from '@promptpilot/validators'
import { atomicWrite } from '@promptpilot/fs'
import { logger, formatCost } from '@promptpilot/shared'
import chalk from 'chalk'
import ora from 'ora'

export function registerRunCommand(program: Command): void {
  const runCmd = program
    .command('run [step]')
    .description('Execute pipeline steps')
    .option('--all', 'Run the entire pipeline')
    .option('--parallel', 'Run independent steps in parallel')
    .option('--yes', 'Skip confirmation prompts')
    .option('--force', 'Overwrite existing artifacts')
    .option('--dry-run', 'Simulate without calling LLM')
    .option('--verbose', 'Show detailed output')
    .option('--model <model>', 'Override LLM model')
    .option('--temperature <temp>', 'Override temperature', parseFloat)
    .action(async (step, options) => {
      // Implementation follows the pipeline execution flow:
      // 1. Load config
      // 2. Load manifest
      // 3. Detect pipeline state
      // 4. Determine steps to run
      // 5. For each step:
      //    a. Load prompt template
      //    b. Assemble context from upstream artifacts
      //    c. Create adapter
      //    d. Call LLM (or skip for dry-run)
      //    e. Validate output
      //    f. Write to docs-output/
      // 6. Report summary
    })
}
```

### 9.4 Output Formatters

```typescript
import chalk from 'chalk'

export interface FormatterOptions {
  noColor: boolean
  plain: boolean
}

export function createFormatter(options: FormatterOptions) {
  const c = options.noColor ? new chalk.Instance({ level: 0 }) : chalk

  return {
    success(message: string): string {
      return options.plain ? `[SUCCESS] ${message}` : c.green(`[SUCCESS] ${message}`)
    },
    error(message: string): string {
      return options.plain ? `[ERROR] ${message}` : c.red(`[ERROR] ${message}`)
    },
    warning(message: string): string {
      return options.plain ? `[WARNING] ${message}` : c.yellow(`[WARNING] ${message}`)
    },
    info(message: string): string {
      return options.plain ? `[INFO] ${message}` : c.blue(`[INFO] ${message}`)
    },
    step(stepNum: number, total: number, name: string): string {
      return options.plain
        ? `Step ${stepNum}/${total}: ${name}`
        : c.cyan(`[${stepNum}/${total}]`) + ` ${c.bold(name)}`
    },
    path(filePath: string): string {
      return options.plain ? filePath : c.dim(filePath)
    },
  }
}
```

---

## 10. Hosted Backend (P3 — Future)

The hosted backend is built when Phase 6 (Growth) begins. It is a separate service from the CLI.

### 10.1 Architecture

```
┌────────────────────────────────────────────────────┐
│                   Load Balancer                     │
└────────┬───────────────────────────┬───────────────┘
         │                           │
┌────────▼────────┐         ┌───────▼────────┐
│   API Server    │         │   API Server    │
│   (Node.js)     │         │   (Node.js)     │
└────────┬────────┘         └───────┬────────┘
         │                          │
         └──────────┬───────────────┘
                    │
         ┌──────────▼──────────┐
         │    PostgreSQL 16    │
         └─────────────────────┘
         ┌──────────▼──────────┐
         │     Redis 7.x       │
         └─────────────────────┘
         ┌──────────▼──────────┐
         │   S3 / R2 Storage   │
         └─────────────────────┘
```

### 10.2 Technology Stack (Hosted)

| Layer             | Technology        | Purpose                                           |
| ----------------- | ----------------- | ------------------------------------------------- |
| **Web Framework** | Hono or Fastify   | Lightweight, fast, TypeScript-first               |
| **ORM**           | Drizzle ORM       | Type-safe, SQL-first, migration support           |
| **Auth**          | Lucia Auth        | Session-based auth with OAuth support             |
| **Validation**    | Zod               | Request/response validation (shared with CLI)     |
| **Queue**         | BullMQ + Redis    | Background jobs (email, notifications, analytics) |
| **Email**         | Resend or AWS SES | Transactional email                               |
| **Payments**      | Stripe            | Subscription billing                              |

### 10.3 API Structure

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
DELETE /api/workspaces/:id

GET    /api/workspaces/:id/members
POST   /api/workspaces/:id/invites
DELETE /api/workspaces/:id/members/:userId

GET    /api/workspaces/:id/projects
POST   /api/workspaces/:id/projects
GET    /api/projects/:id

GET    /api/projects/:id/artifacts
GET    /api/artifacts/:id
POST   /api/projects/:id/generate

POST   /api/artifacts/:id/reviews
GET    /api/artifacts/:id/reviews

GET    /api/workspaces/:id/analytics
GET    /api/workspaces/:id/analytics/costs

GET    /api/packs
GET    /api/packs/:name
POST   /api/packs
POST   /api/workspaces/:id/packs/install

GET    /api/billing/plans
POST   /api/billing/subscribe
GET    /api/billing/invoices
```

---

## 11. Development Workflow

### 11.1 Setting Up Locally

```bash
git clone https://github.com/promptpilot/promptpilot.git
cd promptpilot
npm install
npm run build
npm test
node packages/cli/dist/cli.js init --help
```

### 11.2 Development Loop

```bash
# Terminal 1: Watch and rebuild on changes
npm run dev

# Terminal 2: Run commands against the dev build
node packages/cli/dist/cli.js init test-project
node packages/cli/dist/cli.js run 1 --model gpt-4o-mini

# Terminal 3: Run tests in watch mode
npm run test:watch
```

### 11.3 Debugging

Add a VS Code launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug CLI",
      "program": "${workspaceFolder}/packages/cli/dist/cli.js",
      "args": ["init", "test-project"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter", "verbose"],
      "console": "integratedTerminal"
    }
  ]
}
```

### 11.4 Common Development Tasks

**Adding a new CLI command:**

1. Create `packages/cli/src/commands/<name>.ts`.
2. Export a `register<Name>Command(program: Command)` function.
3. Register it in `packages/cli/src/cli.ts`.
4. Add unit tests in `packages/cli/test/unit/<name>.test.ts`.
5. Add integration tests in `packages/cli/test/integration/<name>.test.ts`.
6. Update `--help` output and README.

**Changing a prompt template:**

1. Edit the markdown file in `docs/` (for the project) or `packages/cli/templates/docs/` (shipped with CLI).
2. Run `npm run test:prompts` to update snapshots.
3. Run the full prompt validation suite to verify output quality.
4. Update CHANGELOG.

**Adding a new validation rule:**

1. Add the rule function to `packages/validators/src/<category>.ts`.
2. Register it in the appropriate validation pipeline.
3. Add test cases with known-bad and known-good inputs.
4. Update the validation report format if adding new issue types.

---

**End of Backend Development Guide**
