import { z } from 'zod'

const ProviderConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  defaultModel: z.string().optional(),
})

const DatabaseConfigSchema = z.object({
  uri: z.string().default('mongodb://localhost:27017/promptpilot'),
  name: z.string().default('promptpilot'),
})

const AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default('7d'),
  jwtRefreshExpiresIn: z.string().default('30d'),
  bcryptSaltRounds: z.number().int().min(10).max(16).default(12),
})

const ServerConfigSchema = z.object({
  port: z.number().int().default(3000),
  host: z.string().default('0.0.0.0'),
  corsOrigin: z.string().default('http://localhost:5173'),
  trustProxy: z.boolean().default(false),
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
  database: DatabaseConfigSchema.default({}),
  auth: AuthConfigSchema.default({
    jwtSecret: 'placeholder-change-me-in-production-32chars',
  }),
  server: ServerConfigSchema.default({}),
})

export type PromptPilotConfig = z.infer<typeof PromptPilotConfigSchema>
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>
export type AuthConfig = z.infer<typeof AuthConfigSchema>
export type ServerConfig = z.infer<typeof ServerConfigSchema>
