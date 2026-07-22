"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIAdapter = void 0;
const base_1 = require("./base");
const shared_1 = require("@promptpilot/shared");
const shared_2 = require("@promptpilot/shared");
const MODEL_CONTEXT_WINDOWS = {
    'gpt-4o': 128000,
    'gpt-4o-mini': 128000,
    'gpt-4.1': 1000000,
};
class OpenAIAdapter extends base_1.BaseAdapter {
    model;
    apiKey;
    baseUrl;
    provider = 'openai';
    maxContextTokens;
    constructor(model, apiKey, baseUrl = 'https://api.openai.com') {
        super();
        this.model = model;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.maxContextTokens = MODEL_CONTEXT_WINDOWS[model] || 128000;
    }
    async generate(prompt, options) {
        this.validatePromptSize(prompt);
        const { result: response, durationMs } = await this.measureTiming(async () => {
            const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: options.temperature,
                    max_tokens: options.maxTokens,
                    stream: false,
                }),
                signal: options.signal,
            });
            if (!res.ok) {
                const body = await res.text();
                throw new shared_1.AdapterError(`OpenAI API error (${res.status})`, 'openai', res.status, res.status === 429
                    ? 'Rate limited. Retrying with backoff...'
                    : res.status === 401
                        ? 'Invalid API key. Run `promptpilot config set providers.openai.apiKey <key>`.'
                        : 'Check your API key and try again.', new Error(body));
            }
            return res.json();
        });
        const choice = response.choices[0];
        const inputTokens = response.usage?.prompt_tokens || this.countTokens(prompt);
        const outputTokens = response.usage?.completion_tokens || this.countTokens(choice.message.content);
        return {
            content: choice.message.content,
            inputTokens,
            outputTokens,
            model: response.model,
            durationMs,
            cost: (0, shared_2.estimateCost)(inputTokens, outputTokens, this.model),
        };
    }
    async *generateStream(prompt, options) {
        this.validatePromptSize(prompt);
        const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature,
                max_tokens: options.maxTokens,
                stream: true,
            }),
            signal: options.signal,
        });
        if (!res.ok)
            throw new shared_1.AdapterError(`OpenAI API error (${res.status})`, 'openai', res.status);
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
                if (line.startsWith('data: ') && line.slice(6).trim() !== '[DONE]') {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content)
                            yield content;
                    }
                    catch {
                        /* skip malformed SSE */
                    }
                }
            }
        }
    }
    async healthCheck() {
        const start = performance.now();
        try {
            const res = await fetch(`${this.baseUrl}/v1/models`, {
                headers: { Authorization: `Bearer ${this.apiKey}` },
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
exports.OpenAIAdapter = OpenAIAdapter;
//# sourceMappingURL=openai.js.map