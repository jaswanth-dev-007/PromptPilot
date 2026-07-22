"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tokens_1 = require("../src/tokens");
(0, vitest_1.describe)('countTokens', () => {
    (0, vitest_1.it)('counts simple text', () => {
        const count = (0, tokens_1.countTokens)('hello world');
        (0, vitest_1.expect)(count).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('returns 0 for empty string', () => {
        (0, vitest_1.expect)((0, tokens_1.countTokens)('')).toBe(0);
    });
});
(0, vitest_1.describe)('estimateCost', () => {
    (0, vitest_1.it)('calculates GPT-4o cost', () => {
        const cost = (0, tokens_1.estimateCost)(1000, 500, 'gpt-4o');
        (0, vitest_1.expect)(cost).toBeCloseTo(0.0075, 4);
    });
    (0, vitest_1.it)('falls back to GPT-4o pricing for unknown models', () => {
        const cost = (0, tokens_1.estimateCost)(1000, 0, 'unknown-model');
        (0, vitest_1.expect)(cost).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('formatCost', () => {
    (0, vitest_1.it)('shows < $0.01 for tiny costs', () => {
        (0, vitest_1.expect)((0, tokens_1.formatCost)(0.005)).toBe('< $0.01');
    });
    (0, vitest_1.it)('shows dollar amount', () => {
        (0, vitest_1.expect)((0, tokens_1.formatCost)(0.05)).toBe('$0.05');
    });
});
//# sourceMappingURL=tokens.test.js.map