import type { Request, Response, NextFunction } from 'express'
import { PromptPilotError } from '@promptpilot/shared'

const statusMap: Record<string, number> = {
  VALIDATION_ERROR: 400,
  AUTH_ERROR: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  CONFIG_ERROR: 500,
  DATABASE_ERROR: 500,
  ADAPTER_ERROR: 502,
  PIPELINE_ERROR: 500,
  FS_ERROR: 500,
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof PromptPilotError) {
    const status = statusMap[err.code] || 500
    res.status(status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.suggestion,
      },
    })
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  })
}
