"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeyRepository = void 0;
const client_1 = require("../client");
exports.APIKeyRepository = {
    findById(id) {
        return client_1.prisma.aPIKey.findUnique({ where: { id } });
    },
    findByHash(keyHash) {
        return client_1.prisma.aPIKey.findFirst({ where: { keyHash, revokedAt: null } });
    },
    async create(data) {
        return client_1.prisma.aPIKey.create({ data });
    },
    async revoke(id) {
        return client_1.prisma.aPIKey.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    },
    async updateLastUsed(id) {
        return client_1.prisma.aPIKey.update({
            where: { id },
            data: { lastUsedAt: new Date() },
        });
    },
    async listByWorkspace(workspaceId) {
        return client_1.prisma.aPIKey.findMany({
            where: { workspaceId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
//# sourceMappingURL=apiKey.js.map