export declare function isRetryable(error: unknown): boolean;
export declare function withRetry<T>(fn: () => Promise<T>, options?: {
    maxRetries?: number;
    baseDelayMs?: number;
}): Promise<T>;
//# sourceMappingURL=retry.d.ts.map