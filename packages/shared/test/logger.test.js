"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const logger_1 = require("../src/logger");
(0, vitest_1.describe)('redactSensitive', () => {
    (0, vitest_1.it)('redacts apiKey', () => {
        const result = (0, logger_1.redactSensitive)({ apiKey: 'sk-secret', name: 'test' });
        (0, vitest_1.expect)(result.apiKey).toBe('[REDACTED]');
        (0, vitest_1.expect)(result.name).toBe('test');
    });
    (0, vitest_1.it)('redacts nested keys', () => {
        const result = (0, logger_1.redactSensitive)({
            providers: { openai: { apiKey: 'sk-secret' } },
        });
        (0, vitest_1.expect)(result.providers.openai).toEqual({ apiKey: '[REDACTED]' });
    });
    (0, vitest_1.it)('redacts authorization', () => {
        const result = (0, logger_1.redactSensitive)({ headers: { authorization: 'Bearer token' } });
        (0, vitest_1.expect)(result.headers.authorization).toBe('[REDACTED]');
    });
    (0, vitest_1.it)('handles empty objects', () => {
        (0, vitest_1.expect)((0, logger_1.redactSensitive)({})).toEqual({});
    });
});
//# sourceMappingURL=logger.test.js.map