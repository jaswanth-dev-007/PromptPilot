import { readJsonFile } from '@promptpilot/fs'
import { ConfigError } from '@promptpilot/shared'
import { PromptPilotConfigSchema, type PromptPilotConfig } from './schema'
import { DEFAULT_CONFIG } from './defaults'
import { join } from 'path'
import { homedir } from 'os'

export async function loadConfig(
  projectDir: string,
  cliOverrides: Partial<PromptPilotConfig> = {},
): Promise<PromptPilotConfig> {
  let config: Record<string, unknown> = { ...DEFAULT_CONFIG }

  try {
    const global = await readJsonFile(join(homedir(), '.promptpilot', 'config.json'))
    config = deepMerge(config, global as Record<string, unknown>)
  } catch {
    // Optional
  }

  try {
    const project = await readJsonFile(join(projectDir, 'promptpilot.json'))
    config = deepMerge(config, project as Record<string, unknown>)
  } catch {
    // Optional
  }

  config = mergeEnvVars(config as PromptPilotConfig) as unknown as Record<string, unknown>

  config = deepMerge(config, cliOverrides as unknown as Record<string, unknown>)

  const result = PromptPilotConfigSchema.safeParse(config)
  if (!result.success) {
    throw new ConfigError(
      `Invalid configuration: ${result.error.message}`,
      'Run `promptpilot config init` to reconfigure.',
    )
  }

  return result.data
}

export function detectAvailableProviders(): string[] {
  const available: string[] = []
  if (process.env.OPENAI_API_KEY) available.push('openai')
  if (process.env.ANTHROPIC_API_KEY) available.push('anthropic')
  if (process.env.GOOGLE_API_KEY) available.push('google')
  available.push('ollama')
  return available
}

function mergeEnvVars(config: PromptPilotConfig): PromptPilotConfig {
  const env = { ...config, providers: { ...config.providers } }
  if (process.env.OPENAI_API_KEY) {
    env.providers.openai = { ...env.providers.openai, apiKey: process.env.OPENAI_API_KEY }
  }
  if (process.env.ANTHROPIC_API_KEY) {
    env.providers.anthropic = { ...env.providers.anthropic, apiKey: process.env.ANTHROPIC_API_KEY }
  }
  if (process.env.GOOGLE_API_KEY) {
    env.providers.google = { ...env.providers.google, apiKey: process.env.GOOGLE_API_KEY }
  }
  if (process.env.OLLAMA_BASE_URL) {
    env.providers.ollama = { ...env.providers.ollama, baseUrl: process.env.OLLAMA_BASE_URL }
  }

  if (process.env.MONGODB_URI) {
    env.database = { ...env.database, uri: process.env.MONGODB_URI }
  }
  if (process.env.JWT_SECRET) {
    env.auth = { ...env.auth, jwtSecret: process.env.JWT_SECRET }
  }
  if (process.env.JWT_EXPIRES_IN) {
    env.auth = { ...env.auth, jwtExpiresIn: process.env.JWT_EXPIRES_IN }
  }
  if (process.env.JWT_REFRESH_EXPIRES_IN) {
    env.auth = { ...env.auth, jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  }
  if (process.env.BCRYPT_SALT_ROUNDS) {
    env.auth = { ...env.auth, bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) }
  }
  if (process.env.PORT) {
    env.server = { ...env.server, port: Number(process.env.PORT) }
  }
  if (process.env.CORS_ORIGIN) {
    env.server = { ...env.server, corsOrigin: process.env.CORS_ORIGIN }
  }
  if (process.env.NODE_ENV === 'production') {
    env.server = { ...env.server, trustProxy: true }
  }

  return env
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      )
    } else {
      result[key] = source[key]
    }
  }
  return result
}
