import { prisma } from '../client'

export const WorkspaceMemberRepository = {
  findById(id: string) {
    return prisma.workspaceMember.findUnique({
      where: { id },
      include: { user: true, workspace: true },
    })
  },

  findByWorkspaceAndUser(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    })
  },

  async create(data: { workspaceId: string; userId: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER' }) {
    return prisma.workspaceMember.create({ data })
  },

  async updateRole(id: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER') {
    return prisma.workspaceMember.update({ where: { id }, data: { role } })
  },

  async remove(id: string) {
    return prisma.workspaceMember.delete({ where: { id } })
  },

  async listByWorkspace(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    })
  },

  async listByUser(userId: string) {
    return prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    })
  },
}
