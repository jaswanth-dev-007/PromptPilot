import { prisma } from '../client'

export const UserRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  },

  async create(data: { email: string; passwordHash: string; name: string; role?: 'ADMIN' | 'MEMBER'; id?: string }) {
    return prisma.user.create({ data: { ...data, role: data.role || 'MEMBER' } })
  },

  async update(id: string, data: { name?: string; avatarUrl?: string | null; isActive?: boolean }) {
    return prisma.user.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    })
  },

  async list(params: { skip: number; take: number }) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: { deletedAt: null },
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { deletedAt: null } }),
    ])
    return { data, total }
  },

  async updateRefreshToken(id: string, refreshTokenHash: string | null) {
    return prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    })
  },

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    })
  },
}
