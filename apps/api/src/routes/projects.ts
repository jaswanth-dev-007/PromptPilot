import { Router, type Router as RouterType, type Response, type NextFunction } from 'express'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import { ProjectRepository, DocumentRepository } from '@promptpilot/database'

export function createProjectsRouter(): RouterType {
  const router = Router()

  router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, page, limit } = req.query
      if (!workspaceId) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'workspaceId is required' },
        })
        return
      }
      const skip = Math.max(0, Number(page) - 1 || 0) * Math.min(100, Number(limit) || 20)
      const take = Math.min(100, Number(limit) || 20)
      const { data, total } = await ProjectRepository.listByWorkspace(String(workspaceId), {
        skip,
        take,
      })
      res.json({ success: true, data, meta: { total, page: Number(page) || 1, limit: take } })
    } catch (err) {
      next(err)
    }
  })

  router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const project = await ProjectRepository.findById(String(req.params.id))
      if (!project) {
        res
          .status(404)
          .json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } })
        return
      }
      res.json({ success: true, data: project })
    } catch (err) {
      next(err)
    }
  })

  router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name, slug, description, workspaceId } = req.body
      if (!name || !slug || !workspaceId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'name, slug, and workspaceId are required',
          },
        })
        return
      }
      const project = await ProjectRepository.create({
        name,
        slug,
        description,
        workspace: { connect: { id: String(workspaceId) } },
        owner: { connect: { id: String(req.user!.userId) } },
      })
      res.status(201).json({ success: true, data: project })
    } catch (err) {
      next(err)
    }
  })

  router.patch('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const project = await ProjectRepository.update(String(req.params.id), req.body)
      res.json({ success: true, data: project })
    } catch (err) {
      next(err)
    }
  })

  router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await ProjectRepository.softDelete(String(req.params.id))
      res.json({ success: true, data: { message: 'Project archived' } })
    } catch (err) {
      next(err)
    }
  })

  router.get(
    '/:id/documents',
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const docs = await DocumentRepository.listByProject(String(req.params.id))
        res.json({ success: true, data: { documents: docs } })
      } catch (err) {
        next(err)
      }
    },
  )

  return router
}
