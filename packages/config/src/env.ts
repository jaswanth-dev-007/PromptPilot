import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/promptpilot'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/promptpilot'),
  JWT_SECRET: z.string().min(32).default('placeholder-change-me-in-production-32chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  BCRYPT_SALT_ROUNDS: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(10).max(16))
    .default('12'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:3001'),
})

export type Env = z.infer<typeof envSchema>

let cachedEnv: Env | null = null

export function loadEnv(): Env {
  if (cachedEnv) return cachedEnv

  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const formatted = result.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Environment validation failed:\n${formatted}`)
  }

  cachedEnv = result.data
  return result.data
}

export function getEnv(): Env {
  if (!cachedEnv) return loadEnv()
  return cachedEnv
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development'
}

export function isTest(): boolean {
  return getEnv().NODE_ENV === 'test'
}

export function resetEnv(): void {
  cachedEnv = null
}
