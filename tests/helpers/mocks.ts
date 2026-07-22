import { vi } from 'vitest'

export function mockLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  }
}

export function mockApiResponse<T>(data: T, success = true) {
  if (!success) {
    return {
      ok: false,
      json: () =>
        Promise.resolve({ success: false, error: { code: 'TEST_ERROR', message: 'Mock error' } }),
      status: 500,
    }
  }
  return {
    ok: true,
    json: () => Promise.resolve({ success: true, data }),
    status: 200,
  }
}

export function withMockConsole<T extends (...args: any[]) => any>(fn: T): ReturnType<T> {
  const original = { log: console.log, warn: console.warn, error: console.error }
  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()
  try {
    return fn()
  } finally {
    console.log = original.log
    console.warn = original.warn
    console.error = original.error
  }
}
