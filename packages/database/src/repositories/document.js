"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const client_1 = require("../client");
exports.DocumentRepository = {
    findById(id) {
        return client_1.prisma.document.findUnique({
            where: { id },
            include: { versions: true },
        });
    },
    findByProjectAndStep(projectId, stepId) {
        return client_1.prisma.document.findUnique({
            where: { projectId_stepId: { projectId, stepId } },
        });
    },
    async create(data) {
        return client_1.prisma.document.create({ data: { ...data, status: data.status || 'DRAFT', version: data.version || 1 } });
    },
    async update(id, data) {
        return client_1.prisma.document.update({ where: { id }, data });
    },
    async updateContent(id, content, version) {
        return client_1.prisma.document.update({
            where: { id },
            data: { content, version, status: 'GENERATED' },
        });
    },
    async markStale(id, reason) {
        return client_1.prisma.document.update({
            where: { id },
            data: { stale: true, staleReason: reason, status: 'STALE' },
        });
    },
    async updateStatus(id, status) {
        return client_1.prisma.document.update({ where: { id }, data: { status } });
    },
    async softDelete(id) {
        return client_1.prisma.document.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
    async listByProject(projectId) {
        return client_1.prisma.document.findMany({
            where: { projectId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });
    },
    async listStale(projectId) {
        return client_1.prisma.document.findMany({
            where: { projectId, stale: true, deletedAt: null },
        });
    },
};
//# sourceMappingURL=document.js.map