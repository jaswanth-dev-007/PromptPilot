"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportRepository = void 0;
const client_1 = require("../client");
exports.ExportRepository = {
    findById(id) {
        return client_1.prisma.export.findUnique({ where: { id } });
    },
    async create(data) {
        return client_1.prisma.export.create({ data: { ...data, status: data.status || 'PENDING' } });
    },
    async updateStatus(id, status, fileUrl) {
        return client_1.prisma.export.update({
            where: { id },
            data: { status, ...(fileUrl ? { fileUrl } : {}) },
        });
    },
    async listByProject(projectId) {
        return client_1.prisma.export.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
//# sourceMappingURL=export.js.map