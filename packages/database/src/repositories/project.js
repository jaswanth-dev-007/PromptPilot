"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const client_1 = require("../client");
exports.ProjectRepository = {
    findById(id) {
        return client_1.prisma.project.findUnique({
            where: { id },
            include: { documents: true, aiConversations: true },
        });
    },
    findByWorkspaceAndSlug(workspaceId, slug) {
        return client_1.prisma.project.findUnique({
            where: { workspaceId_slug: { workspaceId, slug } },
        });
    },
    async create(data) {
        return client_1.prisma.project.create({ data: { ...data, status: data.status || 'DRAFT' } });
    },
    async update(id, data) {
        return client_1.prisma.project.update({ where: { id }, data });
    },
    async softDelete(id) {
        return client_1.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'ARCHIVED' },
        });
    },
    async listByWorkspace(workspaceId, params) {
        const where = { workspaceId, deletedAt: null };
        const [data, total] = await Promise.all([
            client_1.prisma.project.findMany({
                where,
                skip: params.skip,
                take: params.take,
                orderBy: { updatedAt: 'desc' },
                include: { _count: { select: { documents: true } } },
            }),
            client_1.prisma.project.count({ where }),
        ]);
        return { data, total };
    },
};
//# sourceMappingURL=project.js.map