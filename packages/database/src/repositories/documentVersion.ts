import { prisma } from '../client'

export const DocumentVersionRepository = {
  findById(id: string) {
    return prisma.documentVersion.findUnique({ where: { id } })
  },

  async create(data: {
    documentId: string
    versionNumber: number
    content: string
    modelUsed?: string
    tokensUsed?: number
  }) {
    return prisma.documentVersion.create({ data })
  },

  async listByDocument(documentId: string) {
    return prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: { versionNumber: 'desc' },
    })
  },

  async getLatest(documentId: string) {
    return prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { versionNumber: 'desc' },
    })
  },
}
