import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import { logger } from '@promptpilot/shared'

config()

function createServer(): Express {
  const app = express()

  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    app.set('trust proxy', 1)
  }
  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  })

  return app
}

const port = process.env.PORT ? Number(process.env.PORT) : 3001
const host = process.env.HOST || '0.0.0.0'

const app = createServer()

const server = app.listen(port, host, () => {
  logger.info({ port, host }, 'PromptPilot backend started')
})

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export { app }
