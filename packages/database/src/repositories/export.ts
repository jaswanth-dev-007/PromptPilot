import { prisma } from '../client'

type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export const ExportRepository = {
  findById(id: string) {
    return prisma.export.findUnique({ where: { id } })
  },

  async create(data: {
    project: { connect: { id: string } }
    format: 'PDF' | 'MARKDOWN' | 'HTML' | 'DOCX'
    status?: ExportStatus
    documentIds: unknown
    expiresAt: Date
  }) {
    return prisma.export.create({ data: { ...data, status: data.status || 'PENDING' } })
  },

  async updateStatus(id: string, status: ExportStatus, fileUrl?: string) {
    return prisma.export.update({
      where: { id },
      data: { status, ...(fileUrl ? { fileUrl } : {}) },
    })
  },

  async listByProject(projectId: string) {
    return prisma.export.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  },
}
