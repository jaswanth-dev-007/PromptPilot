import { prisma } from '../client'

export const WorkspaceRepository = {
  findById(id: string) {
    return prisma.workspace.findUnique({
      where: { id },
      include: { members: { include: { user: true } }, projects: true },
    })
  },

  findByOwnerAndSlug(ownerId: string, slug: string) {
    return prisma.workspace.findUnique({
      where: { ownerId_slug: { ownerId, slug } },
    })
  },

  async create(data: { id?: string; name: string; slug: string; owner: { connect: { id: string } }; type?: 'PERSONAL' | 'TEAM'; settings?: Record<string, unknown> }) {
    return prisma.workspace.create({ data })
  },

  async update(id: string, data: { name?: string; slug?: string; settings?: Record<string, unknown> }) {
    return prisma.workspace.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return prisma.workspace.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })
  },

  async listByOwner(ownerId: string, params: { skip: number; take: number }) {
    const where = { ownerId, deletedAt: null }
    const [data, total] = await Promise.all([
      prisma.workspace.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { projects: true } } },
      }),
      prisma.workspace.count({ where }),
    ])
    return { data, total }
  },

  async listByMember(userId: string, params: { skip: number; take: number }) {
    const where = { members: { some: { userId } }, deletedAt: null }
    const [data, total] = await Promise.all([
      prisma.workspace.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workspace.count({ where }),
    ])
    return { data, total }
  },
}
