"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdapter = void 0;
const shared_1 = require("@promptpilot/shared");
class BaseAdapter {
    countTokens(text) {
        return (0, shared_1.countTokens)(text);
    }
    async measureTiming(fn) {
        const start = performance.now();
        const result = await fn();
        return { result, durationMs: Math.round(performance.now() - start) };
    }
    validatePromptSize(prompt) {
        const tokens = this.countTokens(prompt);
        if (tokens > this.maxContextTokens * 0.9) {
            throw new Error(`Prompt size (${tokens} tokens) exceeds 90% of model context window (${this.maxContextTokens} tokens)`);
        }
    }
}
exports.BaseAdapter = BaseAdapter;
//# sourceMappingURL=base.js.map