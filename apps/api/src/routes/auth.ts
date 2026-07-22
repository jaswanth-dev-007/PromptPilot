import { Router, type Router as RouterType, type Response, type NextFunction } from 'express'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import type { AuthService } from '@promptpilot/auth'
import { validateBody, setAuthCookies, clearAuthCookies, extractRefreshToken } from '@promptpilot/auth'
import { registerSchema, loginSchema } from '@promptpilot/validation'
import { createDefaultWorkspace } from '../services/onboarding'

export function createAuthRouter(
  authService: AuthService,
  authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void,
): RouterType {
  const router = Router()

  router.post('/auth/register', validateBody(registerSchema), async (req, res, next) => {
    try {
      const result = await authService.register(req.body)
      await createDefaultWorkspace(result.user._id.toString(), result.user.email)
      setAuthCookies(res, result.tokens)
      res.status(201).json({
        success: true,
        data: { user: result.user.toJSON(), expiresIn: result.tokens.expiresIn },
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/auth/login', validateBody(loginSchema), async (req, res, next) => {
    try {
      const result = await authService.login(req.body)
      setAuthCookies(res, result.tokens)
      res.json({
        success: true,
        data: { user: result.user.toJSON(), expiresIn: result.tokens.expiresIn },
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/auth/refresh', async (req, res, next) => {
    try {
      const refreshToken = extractRefreshToken(req.headers.cookie, req.body)
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'refreshToken is required' },
        })
        return
      }

      const tokens = await authService.refreshTokens(refreshToken)
      setAuthCookies(res, tokens)
      res.json({ success: true, data: { expiresIn: tokens.expiresIn } })
    } catch (err) {
      next(err)
    }
  })

  router.post('/auth/logout', authenticate, async (req: AuthenticatedRequest, res, next) => {
    try {
      await authService.logout(req.user!.userId)
      clearAuthCookies(res)
      res.json({ success: true, data: { message: 'Logged out' } })
    } catch (err) {
      next(err)
    }
  })

  router.get('/auth/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await authService.getUser(req.user!.userId)
      res.json({ success: true, data: user.toJSON() })
    } catch (err) {
      next(err)
    }
  })

  return router
}
