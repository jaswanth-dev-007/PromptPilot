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
      const apiKey = config.providers.openai?.apiKey || process.env.OPENAI_API_KEY
      if (!apiKey)
        throw new ConfigError(
          'OpenAI API key not configured.',
          'Set OPENAI_API_KEY or run `promptpilot config set providers.openai.apiKey <key>`.',
        )
      return new OpenAIAdapter(model, apiKey, config.providers.openai?.baseUrl)
    }
    case 'anthropic': {
      const apiKey = config.providers.anthropic?.apiKey || process.env.ANTHROPIC_API_KEY
      if (!apiKey)
        throw new ConfigError(
          'Anthropic API key not configured.',
          'Set ANTHROPIC_API_KEY or run `promptpilot config set providers.anthropic.apiKey <key>`.',
        )
      return new AnthropicAdapter(model, apiKey, config.providers.anthropic?.baseUrl)
    }
    default:
      throw new ConfigError(
        `Provider "${provider}" is not yet implemented.`,
        'Use "openai" or "anthropic".',
      )
  }
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case 'openai':
      return 'gpt-4o'
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022'
    default:
      return 'gpt-4o'
  }
}
