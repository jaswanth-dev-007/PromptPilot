import { Router, type Router as RouterType } from 'express'
import { isConnected } from '@promptpilot/db'

export function createHealthRouter(): RouterType {
  const router = Router()

  router.get('/health', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        dbStatus: isConnected() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      },
    })
  })

  return router
}
