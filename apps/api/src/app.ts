import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import type { PromptPilotConfig } from '@promptpilot/config'
import { createAuthMiddleware } from '@promptpilot/auth'
import { errorHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'
import { createRoutes } from './routes'

export function createApp(config: PromptPilotConfig): Express {
  const app = express()

  app.set('trust proxy', config.server.trustProxy)
  app.use(helmet())
  app.use(
    cors({
      origin: config.server.corsOrigin,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

  app.use(requestLogger)

  const authMiddleware = createAuthMiddleware(config.auth)
  app.use('/api/v1', createRoutes(config, authMiddleware.authenticate))

  app.use(errorHandler)

  return app
}
