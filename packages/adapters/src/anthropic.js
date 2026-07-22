"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicAdapter = void 0;
const base_1 = require("./base");
const shared_1 = require("@promptpilot/shared");
const shared_2 = require("@promptpilot/shared");
const MODEL_CONTEXT_WINDOWS = {
    'claude-3-5-sonnet-20241022': 200000,
    'claude-3-5-haiku-20241022': 200000,
    'claude-opus-4-20250514': 200000,
};
class AnthropicAdapter extends base_1.BaseAdapter {
    model;
    apiKey;
    baseUrl;
    provider = 'anthropic';
    maxContextTokens;
    constructor(model, apiKey, baseUrl = 'https://api.anthropic.com') {
        super();
        this.model = model;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 200000;
    }
    async generate(prompt, options) {
        this.validatePromptSize(prompt);
        const { result: response, durationMs } = await this.measureTiming(async () => {
            const res = await fetch(`${this.baseUrl}/v1/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: options.maxTokens,
                    temperature: options.temperature,
                    messages: [{ role: 'user', content: prompt }],
                }),
                signal: options.signal,
            });
            if (!res.ok) {
                const body = await res.text();
                throw new shared_1.AdapterError(`Anthropic API error (${res.status})`, 'anthropic', res.status, res.status === 429
                    ? 'Rate limited. Retrying...'
                    : res.status === 401
                        ? 'Invalid API key.'
                        : 'Check your API key and try again.', new Error(body));
            }
            return res.json();
        });
        const content = response.content
            .filter(c => c.type === 'text')
            .map(c => c.text)
            .join('\n');
        return {
            content,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            model: response.model,
            durationMs,
            cost: (0, shared_2.estimateCost)(response.usage.input_tokens, response.usage.output_tokens, this.model),
        };
    }
    async *generateStream(prompt, options) {
        this.validatePromptSize(prompt);
        const res = await fetch(`${this.baseUrl}/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
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
        });
        if (!res.ok)
            throw new shared_1.AdapterError(`Anthropic API error (${res.status})`, 'anthropic', res.status);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                            yield parsed.delta.text;
                        }
                    }
                    catch {
                        /* skip malformed */
                    }
                }
            }
        }
    }
    async healthCheck() {
        const start = performance.now();
        try {
            const res = await fetch(`${this.baseUrl}/v1/models`, {
                headers: { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' },
            });
            return {
                ok: res.ok,
                latencyMs: Math.round(performance.now() - start),
                error: res.ok ? undefined : `HTTP ${res.status}`,
            };
        }
        catch (error) {
            return {
                ok: false,
                latencyMs: Math.round(performance.now() - start),
                error: error.message,
            };
        }
    }
}
exports.AnthropicAdapter = AnthropicAdapter;
//# sourceMappingURL=anthropic.js.map