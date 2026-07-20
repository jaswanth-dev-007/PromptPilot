import { z } from 'zod'

const ProviderConfigSchema = z.object({
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
