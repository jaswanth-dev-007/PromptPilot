import { prisma } from '../client'

type DocumentStatus = 'DRAFT' | 'GENERATED' | 'REVIEWED' | 'STALE'
type DocumentType = 'MASTER_CONTEXT' | 'PRD' | 'SRS' | 'ARCHITECTURE' | 'DATABASE' | 'API_SPEC' | 'USER_FLOWS' | 'WIREFRAMES' | 'ROADMAP'

export const DocumentRepository = {
  findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: { versions: true },
    })
  },

  findByProjectAndStep(projectId: string, stepId: string) {
    return prisma.document.findUnique({
      where: { projectId_stepId: { projectId, stepId } },
    })
  },

  async create(data: {
    id?: string
    project: { connect: { id: string } }
    stepId: string
    title: string
    type: DocumentType
    content: string
    status?: DocumentStatus
    version?: number
    conversation: { create: { project: { connect: { id: string } }; stepId: string; model: string; status?: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED'; startedAt?: Date; completedAt?: Date } }
  }) {
    return prisma.document.create({ data: { ...data, status: data.status || 'DRAFT', version: data.version || 1 } })
  },

  async update(id: string, data: { title?: string; status?: DocumentStatus; stale?: boolean; staleReason?: string | null }) {
    return prisma.document.update({ where: { id }, data })
  },

  async updateContent(id: string, content: string, version: number) {
    return prisma.document.update({
      where: { id },
      data: { content, version, status: 'GENERATED' },
    })
  },

  async markStale(id: string, reason: string) {
    return prisma.document.update({
      where: { id },
      data: { stale: true, staleReason: reason, status: 'STALE' },
    })
  },

  async updateStatus(id: string, status: DocumentStatus) {
    return prisma.document.update({ where: { id }, data: { status } })
  },

  async softDelete(id: string) {
    return prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },

  async listByProject(projectId: string) {
    return prisma.document.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    })
  },

  async listStale(projectId: string) {
    return prisma.document.findMany({
      where: { projectId, stale: true, deletedAt: null },
    })
  },
}
