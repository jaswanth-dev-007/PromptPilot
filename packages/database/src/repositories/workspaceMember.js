"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMemberRepository = void 0;
const client_1 = require("../client");
exports.WorkspaceMemberRepository = {
    findById(id) {
        return client_1.prisma.workspaceMember.findUnique({
            where: { id },
            include: { user: true, workspace: true },
        });
    },
    findByWorkspaceAndUser(workspaceId, userId) {
        return client_1.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
    },
    async create(data) {
        return client_1.prisma.workspaceMember.create({ data });
    },
    async updateRole(id, role) {
        return client_1.prisma.workspaceMember.update({ where: { id }, data: { role } });
    },
    async remove(id) {
        return client_1.prisma.workspaceMember.delete({ where: { id } });
    },
    async listByWorkspace(workspaceId) {
        return client_1.prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: { user: true },
            orderBy: { joinedAt: 'asc' },
        });
    },
    async listByUser(userId) {
        return client_1.prisma.workspaceMember.findMany({
            where: { userId },
            include: { workspace: true },
        });
    },
};
//# sourceMappingURL=workspaceMember.js.map