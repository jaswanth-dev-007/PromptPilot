import { Router, type Router as RouterType, type Response, type NextFunction } from 'express'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import { WorkspaceRepository } from '@promptpilot/database'

export function createWorkspacesRouter(): RouterType {
  const router = Router()

  router.get('/', async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query
      const skip = Math.max(0, Number(page) - 1 || 0) * Math.min(100, Number(limit) || 20)
      const take = Math.min(100, Number(limit) || 20)
      const { data, total } = await WorkspaceRepository.listByOwner(String(req.user!.userId), { skip, take })
      _res.json({ success: true, data, meta: { total, page: Number(page) || 1, limit: take } })
    } catch (err) {
      next(err)
    }
  })

  router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const ws = await WorkspaceRepository.findById(String(req.params.id))
      if (!ws) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Workspace not found' } })
        return
      }
      res.json({ success: true, data: ws })
    } catch (err) {
      next(err)
    }
  })

  router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name, slug } = req.body
      if (!name || !slug) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'name and slug are required' } })
        return
      }
      const ws = await WorkspaceRepository.create({
        name,
        slug,
        owner: { connect: { id: req.user!.userId } },
        type: 'TEAM',
      })
      res.status(201).json({ success: true, data: ws })
    } catch (err) {
      next(err)
    }
  })

  router.patch('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const ws = await WorkspaceRepository.update(String(req.params.id), req.body)
      res.json({ success: true, data: ws })
    } catch (err) {
      next(err)
    }
  })

  router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await WorkspaceRepository.softDelete(String(req.params.id))
      res.json({ success: true, data: { message: 'Workspace archived' } })
    } catch (err) {
      next(err)
    }
  })

  return router
}
