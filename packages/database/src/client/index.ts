import { PrismaClient } from '@prisma/client'
import { logger } from '@promptpilot/shared'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  })

  client.$connect().catch((err: Error) => {
    logger.error({ err }, 'Failed to connect to database')
    process.exit(1)
  })

  return client
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function disconnect(): Promise<void> {
  await prisma.$disconnect()
}

export async function healthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe('SELECT 1')
    return true
  } catch {
    return false
  }
}
