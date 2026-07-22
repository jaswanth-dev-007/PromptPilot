import { Router, type Router as RouterType, type Response, type NextFunction } from 'express'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import { prisma } from '@promptpilot/database'

export function createDashboardRouter(): RouterType {
  const router = Router()

  router.get('/stats', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = String(req.user!.userId)

      const [workspaceCount, projectCount, documentCount, generationStats, notificationCount] = await Promise.all([
        prisma.workspace.count({ where: { ownerId: userId, deletedAt: null } }),
        prisma.project.count({ where: { ownerId: userId, deletedAt: null } }),
        prisma.document.count({ where: { project: { ownerId: userId }, deletedAt: null } }),
        prisma.generation.aggregate({
          _sum: { totalTokens: true, cost: true },
          _count: { _all: true },
          where: { conversation: { project: { ownerId: userId } } },
        }),
        prisma.notification.count({ where: { userId, read: false } }),
      ])

      res.json({
        success: true,
        data: {
          workspaces: workspaceCount,
          projects: projectCount,
          documents: documentCount,
          generations: generationStats._count._all,
          tokensUsed: generationStats._sum.totalTokens || 0,
          totalCost: generationStats._sum.cost || 0,
          unreadNotifications: notificationCount,
        },
      })
    } catch (err) {
      next(err)
    }
  })

  return router
}
