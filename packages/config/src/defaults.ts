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
}
