"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdapter = createAdapter;
const shared_1 = require("@promptpilot/shared");
const openai_1 = require("./openai");
const anthropic_1 = require("./anthropic");
function createAdapter(config) {
    const provider = config.provider;
    const model = config.model || getDefaultModel(provider);
    switch (provider) {
        case 'openai': {
            const apiKey = config.providers.openai?.apiKey || process.env.OPENAI_API_KEY;
            if (!apiKey)
                throw new shared_1.ConfigError('OpenAI API key not configured.', 'Set OPENAI_API_KEY or run `promptpilot config set providers.openai.apiKey <key>`.');
            return new openai_1.OpenAIAdapter(model, apiKey, config.providers.openai?.baseUrl);
        }
        case 'anthropic': {
            const apiKey = config.providers.anthropic?.apiKey || process.env.ANTHROPIC_API_KEY;
            if (!apiKey)
                throw new shared_1.ConfigError('Anthropic API key not configured.', 'Set ANTHROPIC_API_KEY or run `promptpilot config set providers.anthropic.apiKey <key>`.');
            return new anthropic_1.AnthropicAdapter(model, apiKey, config.providers.anthropic?.baseUrl);
        }
        default:
            throw new shared_1.ConfigError(`Provider "${provider}" is not yet implemented.`, 'Use "openai" or "anthropic".');
    }
}
function getDefaultModel(provider) {
    switch (provider) {
        case 'openai':
            return 'gpt-4o';
        case 'anthropic':
            return 'claude-3-5-sonnet-20241022';
        default:
            return 'gpt-4o';
    }
}
//# sourceMappingURL=factory.js.map