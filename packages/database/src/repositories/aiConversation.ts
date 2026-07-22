import { prisma } from '../client'

type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export const AIConversationRepository = {
  findById(id: string) {
    return prisma.aIConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { sequence: 'asc' } }, generations: true },
    })
  },

  async create(data: {
    project: { connect: { id: string } }
    stepId: string
    model: string
    temperature?: number
    maxTokens?: number
    status?: ConversationStatus
    startedAt?: Date
    completedAt?: Date
    totalInputTokens?: number
    totalOutputTokens?: number
    totalCost?: number
  }) {
    return prisma.aIConversation.create({
      data: { ...data, status: data.status || 'ACTIVE' },
    })
  },

  async update(
    id: string,
    data: { status?: ConversationStatus; model?: string; temperature?: number; maxTokens?: number },
  ) {
    return prisma.aIConversation.update({ where: { id }, data })
  },

  async updateStatus(id: string, status: ConversationStatus) {
    const data: Record<string, unknown> = { status }
    if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
      data.completedAt = new Date()
    }
    return prisma.aIConversation.update({ where: { id }, data })
  },

  async updateTokenTotals(id: string, inputTokens: number, outputTokens: number, cost: number) {
    return prisma.aIConversation.update({
      where: { id },
      data: {
        totalInputTokens: { increment: inputTokens },
        totalOutputTokens: { increment: outputTokens },
        totalCost: { increment: cost },
      },
    })
  },

  async softDelete(id: string) {
    return prisma.aIConversation.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },

  async listByProject(projectId: string) {
    return prisma.aIConversation.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    })
  },

  async findByProjectAndStep(projectId: string, stepId: string) {
    return prisma.aIConversation.findFirst({
      where: { projectId, stepId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { messages: { orderBy: { sequence: 'asc' } } },
    })
  },
}
