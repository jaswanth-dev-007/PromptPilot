"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const errors_1 = require("../src/errors");
(0, vitest_1.describe)('PromptPilotError', () => {
    (0, vitest_1.it)('creates an error with code', () => {
        const err = new errors_1.PromptPilotError('something broke', 'TEST_ERR');
        (0, vitest_1.expect)(err.message).toBe('something broke');
        (0, vitest_1.expect)(err.code).toBe('TEST_ERR');
        (0, vitest_1.expect)(err).toBeInstanceOf(Error);
    });
    (0, vitest_1.it)('formats user message with suggestion', () => {
        const err = new errors_1.PromptPilotError('config invalid', 'CFG_ERR', 500, 'Run promptpilot config init');
        (0, vitest_1.expect)(err.toUserMessage()).toContain('[CFG_ERR]');
        (0, vitest_1.expect)(err.toUserMessage()).toContain('Run promptpilot config init');
    });
    (0, vitest_1.it)('formats user message with cause', () => {
        const cause = new Error('underlying');
        const err = new errors_1.PromptPilotError('failed', 'ERR', 500, undefined, cause);
        (0, vitest_1.expect)(err.toUserMessage()).toContain('underlying');
    });
});
(0, vitest_1.describe)('ConfigError', () => {
    (0, vitest_1.it)('has correct code', () => {
        const err = new errors_1.ConfigError('bad config');
        (0, vitest_1.expect)(err.code).toBe('CONFIG_ERROR');
        (0, vitest_1.expect)(err).toBeInstanceOf(errors_1.PromptPilotError);
    });
});
(0, vitest_1.describe)('ValidationError', () => {
    (0, vitest_1.it)('includes file path', () => {
        const err = new errors_1.ValidationError('invalid', '/path/to/file.md', 42);
        (0, vitest_1.expect)(err.filePath).toBe('/path/to/file.md');
        (0, vitest_1.expect)(err.line).toBe(42);
    });
});
(0, vitest_1.describe)('AdapterError', () => {
    (0, vitest_1.it)('includes provider and status code', () => {
        const err = new errors_1.AdapterError('api error', 'openai', 429);
        (0, vitest_1.expect)(err.provider).toBe('openai');
        (0, vitest_1.expect)(err.httpStatus).toBe(429);
    });
});
(0, vitest_1.describe)('PipelineError', () => {
    (0, vitest_1.it)('includes step id', () => {
        const err = new errors_1.PipelineError('step failed', 'srs');
        (0, vitest_1.expect)(err.stepId).toBe('srs');
    });
});
(0, vitest_1.describe)('FileSystemError', () => {
    (0, vitest_1.it)('includes file path', () => {
        const err = new errors_1.FileSystemError('not found', '/tmp/test.md');
        (0, vitest_1.expect)(err.filePath).toBe('/tmp/test.md');
        (0, vitest_1.expect)(err.code).toBe('FS_ERROR');
    });
});
//# sourceMappingURL=errors.test.js.map