"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceRepository = void 0;
const client_1 = require("../client");
exports.WorkspaceRepository = {
    findById(id) {
        return client_1.prisma.workspace.findUnique({
            where: { id },
            include: { members: { include: { user: true } }, projects: true },
        });
    },
    findByOwnerAndSlug(ownerId, slug) {
        return client_1.prisma.workspace.findUnique({
            where: { ownerId_slug: { ownerId, slug } },
        });
    },
    async create(data) {
        return client_1.prisma.workspace.create({ data });
    },
    async update(id, data) {
        return client_1.prisma.workspace.update({ where: { id }, data });
    },
    async softDelete(id) {
        return client_1.prisma.workspace.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'ARCHIVED' },
        });
    },
    async listByOwner(ownerId, params) {
        const where = { ownerId, deletedAt: null };
        const [data, total] = await Promise.all([
            client_1.prisma.workspace.findMany({
                where,
                skip: params.skip,
                take: params.take,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { projects: true } } },
            }),
            client_1.prisma.workspace.count({ where }),
        ]);
        return { data, total };
    },
    async listByMember(userId, params) {
        const where = { members: { some: { userId } }, deletedAt: null };
        const [data, total] = await Promise.all([
            client_1.prisma.workspace.findMany({
                where,
                skip: params.skip,
                take: params.take,
                orderBy: { createdAt: 'desc' },
            }),
            client_1.prisma.workspace.count({ where }),
        ]);
        return { data, total };
    },
};
//# sourceMappingURL=workspace.js.map