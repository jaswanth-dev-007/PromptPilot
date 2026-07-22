"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionRepository = void 0;
const client_1 = require("../client");
exports.DocumentVersionRepository = {
    findById(id) {
        return client_1.prisma.documentVersion.findUnique({ where: { id } });
    },
    async create(data) {
        return client_1.prisma.documentVersion.create({ data });
    },
    async listByDocument(documentId) {
        return client_1.prisma.documentVersion.findMany({
            where: { documentId },
            orderBy: { versionNumber: 'desc' },
        });
    },
    async getLatest(documentId) {
        return client_1.prisma.documentVersion.findFirst({
            where: { documentId },
            orderBy: { versionNumber: 'desc' },
        });
    },
};
//# sourceMappingURL=documentVersion.js.map