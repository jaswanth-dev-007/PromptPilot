import { prisma } from '../client'
import type { Prisma } from '@prisma/client'

export async function transaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(fn)
}

export function getClient(): Prisma.TransactionClient | typeof prisma {
  return prisma
}
