"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationRepository = void 0;
const client_1 = require("../client");
exports.GenerationRepository = {
    findById(id) {
        return client_1.prisma.generation.findUnique({ where: { id } });
    },
    async create(data) {
        return client_1.prisma.generation.create({ data });
    },
    async listByConversation(conversationId) {
        return client_1.prisma.generation.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    },
    async aggregateByProject(projectId) {
        const result = await client_1.prisma.generation.aggregate({
            _sum: { totalTokens: true, cost: true },
            _count: { _all: true },
            where: {
                conversation: { projectId },
            },
        });
        return {
            totalGenerations: result._count._all,
            totalTokens: result._sum.totalTokens || 0,
            totalCost: result._sum.cost || 0,
        };
    },
};
//# sourceMappingURL=generation.js.map