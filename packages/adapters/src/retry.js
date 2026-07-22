"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRetryable = isRetryable;
exports.withRetry = withRetry;
const shared_1 = require("@promptpilot/shared");
const shared_2 = require("@promptpilot/shared");
function isRetryable(error) {
    if (error instanceof shared_1.AdapterError) {
        if (error.httpStatus === 429 || (error.httpStatus && error.httpStatus >= 500))
            return true;
    }
    if (error instanceof TypeError && error.message.includes('fetch'))
        return true;
    return false;
}
async function withRetry(fn, options = {}) {
    const maxRetries = options.maxRetries ?? 3;
    const baseDelayMs = options.baseDelayMs ?? 1000;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries || !isRetryable(error))
                throw error;
            const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 16000);
            shared_2.logger.warn({ attempt: attempt + 1, delayMs: delay }, 'Retrying after error');
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map