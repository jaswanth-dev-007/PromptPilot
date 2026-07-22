"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const client_1 = require("../client");
exports.MessageRepository = {
    async create(data) {
        return client_1.prisma.message.create({ data });
    },
    async createMany(messages) {
        return client_1.prisma.message.createMany({ data: messages });
    },
    async listByConversation(conversationId) {
        return client_1.prisma.message.findMany({
            where: { conversationId },
            orderBy: { sequence: 'asc' },
        });
    },
    async getLastSequence(conversationId) {
        const last = await client_1.prisma.message.findFirst({
            where: { conversationId },
            orderBy: { sequence: 'desc' },
            select: { sequence: true },
        });
        return last?.sequence ?? 0;
    },
};
//# sourceMappingURL=message.js.map