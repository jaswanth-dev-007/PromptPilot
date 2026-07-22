"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIConversationRepository = void 0;
const client_1 = require("../client");
exports.AIConversationRepository = {
    findById(id) {
        return client_1.prisma.aIConversation.findUnique({
            where: { id },
            include: { messages: { orderBy: { sequence: 'asc' } }, generations: true },
        });
    },
    async create(data) {
        return client_1.prisma.aIConversation.create({
            data: { ...data, status: data.status || 'ACTIVE' },
        });
    },
    async update(id, data) {
        return client_1.prisma.aIConversation.update({ where: { id }, data });
    },
    async updateStatus(id, status) {
        const data = { status };
        if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
            data.completedAt = new Date();
        }
        return client_1.prisma.aIConversation.update({ where: { id }, data });
    },
    async updateTokenTotals(id, inputTokens, outputTokens, cost) {
        return client_1.prisma.aIConversation.update({
            where: { id },
            data: {
                totalInputTokens: { increment: inputTokens },
                totalOutputTokens: { increment: outputTokens },
                totalCost: { increment: cost },
            },
        });
    },
    async softDelete(id) {
        return client_1.prisma.aIConversation.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
    async listByProject(projectId) {
        return client_1.prisma.aIConversation.findMany({
            where: { projectId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { messages: true } } },
        });
    },
    async findByProjectAndStep(projectId, stepId) {
        return client_1.prisma.aIConversation.findFirst({
            where: { projectId, stepId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { messages: { orderBy: { sequence: 'asc' } } },
        });
    },
};
//# sourceMappingURL=aiConversation.js.map