import type { PromptPilotConfig } from './schema'

export const DEFAULT_CONFIG: PromptPilotConfig = {
  provider: 'openai',
  temperature: 0.2,
  maxTokens: 16000,
  outputDir: './docs-output',
  promptDir: './docs',
  stream: true,
  parallel: false,
  providers: {},
  database: {
    uri: 'mongodb://localhost:27017/promptpilot',
    name: 'promptpilot',
  },
  auth: {
    jwtSecret: 'placeholder-change-me-in-production-32chars',
    jwtExpiresIn: '7d',
    jwtRefreshExpiresIn: '30d',
    bcryptSaltRounds: 12,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    corsOrigin: 'http://localhost:5173',
    trustProxy: false,
  },
}
