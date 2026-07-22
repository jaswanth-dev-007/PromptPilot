import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '@promptpilot/shared'
import type { AuthConfig } from '@promptpilot/config'
import { verifyAccessToken } from './tokens'
import { extractAccessToken } from './cookies'
import type { TokenPayload } from './types'

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload
}

export function createAuthMiddleware(authConfig: AuthConfig) {
  const authenticate = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    const token = extractAccessToken(req.headers.cookie, req.headers.authorization)

    if (!token) {
      next(new ForbiddenError('Authentication required', 'Provide a valid token.'))
      return
    }

    try {
      const payload = verifyAccessToken(token, authConfig.jwtSecret)
      req.user = payload
      next()
    } catch {
      next(new ForbiddenError('Invalid or expired token', 'Please log in again.'))
    }
  }

  const optionalAuth = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    const token = extractAccessToken(req.headers.cookie, req.headers.authorization)

    if (!token) {
      next()
      return
    }

    try {
      const payload = verifyAccessToken(token, authConfig.jwtSecret)
      req.user = payload
    } catch {
      // Token is invalid but this is optional — ignore
    }

    next()
  }

  const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      if (!req.user) {
        next(new ForbiddenError('Authentication required'))
        return
      }

      if (!roles.includes(req.user.role)) {
        next(
          new ForbiddenError(
            'Insufficient permissions',
            `This action requires one of: ${roles.join(', ')}`,
          ),
        )
        return
      }

      next()
    }
  }

  return { authenticate, optionalAuth, authorize }
}
