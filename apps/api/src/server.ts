import { loadConfig } from '@promptpilot/config'
import { connectDatabase, disconnectDatabase } from '@promptpilot/db'
import { logger } from '@promptpilot/shared'
import { createApp } from './app'

async function main() {
  const config = await loadConfig(process.cwd())

  await connectDatabase(config)

  const app = createApp(config)

  const server = app.listen(config.server.port, config.server.host, () => {
    logger.info({ port: config.server.port }, 'PromptPilot API server started')
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down')
    server.close(() => {
      logger.info('HTTP server closed')
    })
    await disconnectDatabase()
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
