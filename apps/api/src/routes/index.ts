import { Router, type Router as RouterType, type NextFunction, type Response } from 'express'
import { AuthService } from '@promptpilot/auth'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import type { PromptPilotConfig } from '@promptpilot/config'
import { createHealthRouter } from './health'
import { createAuthRouter } from './auth'
import { createPipelineRouter } from './pipeline'
import { createProjectsRouter } from './projects'
import { createWorkspacesRouter } from './workspaces'
import { createDashboardRouter } from './dashboard'

export function createRoutes(
  config: PromptPilotConfig,
  authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void,
): RouterType {
  const router = Router()

  const authService = new AuthService(config)

  router.use(createHealthRouter())
  router.use(createAuthRouter(authService, authenticate))
  router.use('/projects', authenticate, createProjectsRouter())
  router.use('/workspaces', authenticate, createWorkspacesRouter())
  router.use('/dashboard', authenticate, createDashboardRouter())
  router.use(createPipelineRouter(config))

  return router
}
