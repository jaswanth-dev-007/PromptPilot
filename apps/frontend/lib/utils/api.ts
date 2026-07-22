import type { ApiResponse } from '@promptpilot/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_PREFIX = '/api/v1'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${API_PREFIX}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new ApiRequestError(
      data.error?.code || 'UNKNOWN',
      data.error?.message || 'Request failed',
      res.status,
    )
  }

  return data
}

export class ApiRequestError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}
