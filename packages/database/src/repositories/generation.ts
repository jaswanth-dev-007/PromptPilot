import { prisma } from '../client'

export const GenerationRepository = {
  findById(id: string) {
    return prisma.generation.findUnique({ where: { id } })
  },

  async create(data: {
    conversation: { connect: { id: string } }
    model: string
    provider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'OLLAMA'
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost: number
    durationMs: number
    status: 'SUCCESS' | 'FAILED' | 'RETRIED'
    errorMessage?: string
  }) {
    return prisma.generation.create({ data })
  },

  async listByConversation(conversationId: string) {
    return prisma.generation.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })
  },

  async aggregateByProject(projectId: string) {
    const result = await prisma.generation.aggregate({
      _sum: { totalTokens: true, cost: true },
      _count: { _all: true },
      where: {
        conversation: { projectId },
      },
    })
    return {
      totalGenerations: result._count._all,
      totalTokens: result._sum.totalTokens || 0,
      totalCost: result._sum.cost || 0,
    }
  },
}
