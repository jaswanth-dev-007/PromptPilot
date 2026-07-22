import { prisma } from '../client'

export const ProjectRepository = {
  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: { documents: true, aiConversations: true },
    })
  },

  findByWorkspaceAndSlug(workspaceId: string, slug: string) {
    return prisma.project.findUnique({
      where: { workspaceId_slug: { workspaceId, slug } },
    })
  },

  async create(data: {
    id?: string
    name: string
    slug: string
    description?: string
    workspace: { connect: { id: string } }
    owner: { connect: { id: string } }
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  }) {
    return prisma.project.create({ data: { ...data, status: data.status || 'DRAFT' } })
  },

  async update(
    id: string,
    data: {
      name?: string
      slug?: string
      description?: string | null
      status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
      settings?: Record<string, unknown>
    },
  ) {
    return prisma.project.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })
  },

  async listByWorkspace(workspaceId: string, params: { skip: number; take: number }) {
    const where = { workspaceId, deletedAt: null }
    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { documents: true } } },
      }),
      prisma.project.count({ where }),
    ])
    return { data, total }
  },
}
