import { AdapterError } from '@promptpilot/shared'
import { logger } from '@promptpilot/shared'

export function isRetryable(error: unknown): boolean {
  if (error instanceof AdapterError) {
    if (error.httpStatus === 429 || (error.httpStatus && error.httpStatus >= 500)) return true
  }
  if (error instanceof TypeError && error.message.includes('fetch')) return true
  return false
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3
  const baseDelayMs = options.baseDelayMs ?? 1000
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === maxRetries || !isRetryable(error)) throw error
      const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 16000)
      logger.warn({ attempt: attempt + 1, delayMs: delay }, 'Retrying after error')
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw lastError
}
