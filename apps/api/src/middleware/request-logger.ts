import type { Request, Response, NextFunction } from 'express'
import { logger } from '@promptpilot/shared'

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now()

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: Date.now() - start,
      },
      'request',
    )
  })

  next()
}
