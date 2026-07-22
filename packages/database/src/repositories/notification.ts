import { prisma } from '../client'

export const NotificationRepository = {
  findById(id: string) {
    return prisma.notification.findUnique({ where: { id } })
  },

  async create(data: {
    user: { connect: { id: string } }
    type: 'PIPELINE_COMPLETED' | 'GENERATION_FAILED' | 'MEMBER_INVITED' | 'DOCUMENT_REVIEWED' | 'EXPORT_COMPLETED'
    title: string
    body: string
    projectId?: string
  }) {
    return prisma.notification.create({ data })
  },

  async markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    })
  },

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  },

  async listByUser(userId: string, params: { skip: number; take: number }) {
    const where = { userId }
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ])
    return { data, total }
  },

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  },
}
