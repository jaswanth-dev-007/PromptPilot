import { prisma } from '../client'

type MessageRole = 'SYSTEM' | 'USER' | 'ASSISTANT'

export const MessageRepository = {
  async create(data: {
    conversationId: string
    role: MessageRole
    content: string
    sequence: number
    tokens?: number
  }) {
    return prisma.message.create({ data })
  },

  async createMany(
    messages: Array<{
      conversationId: string
      role: MessageRole
      content: string
      sequence: number
      tokens?: number
    }>,
  ) {
    return prisma.message.createMany({ data: messages })
  },

  async listByConversation(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { sequence: 'asc' },
    })
  },

  async getLastSequence(conversationId: string): Promise<number> {
    const last = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    })
    return last?.sequence ?? 0
  },
}
