import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from '@promptpilot/shared'
import type { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
      next(
        new ValidationError(messages, 'request.body', undefined, 'Check your input and try again.'),
      )
      return
    }
    req.body = result.data
    next()
  }
}
