import { prisma } from '../client'

export const APIKeyRepository = {
  findById(id: string) {
    return prisma.aPIKey.findUnique({ where: { id } })
  },

  findByHash(keyHash: string) {
    return prisma.aPIKey.findFirst({ where: { keyHash, revokedAt: null } })
  },

  async create(data: {
    workspace: { connect: { id: string } }
    name: string
    keyHash: string
    prefix: string
  }) {
    return prisma.aPIKey.create({ data })
  },

  async revoke(id: string) {
    return prisma.aPIKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    })
  },

  async updateLastUsed(id: string) {
    return prisma.aPIKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    })
  },

  async listByWorkspace(workspaceId: string) {
    return prisma.aPIKey.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })
  },
}
