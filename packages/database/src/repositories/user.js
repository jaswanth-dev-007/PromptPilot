"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("../client");
exports.UserRepository = {
    findById(id) {
        return client_1.prisma.user.findUnique({ where: { id } });
    },
    findByEmail(email) {
        return client_1.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    },
    async create(data) {
        return client_1.prisma.user.create({ data: { ...data, role: data.role || 'MEMBER' } });
    },
    async update(id, data) {
        return client_1.prisma.user.update({ where: { id }, data });
    },
    async softDelete(id) {
        return client_1.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
    },
    async list(params) {
        const [data, total] = await Promise.all([
            client_1.prisma.user.findMany({
                where: { deletedAt: null },
                skip: params.skip,
                take: params.take,
                orderBy: { createdAt: 'desc' },
            }),
            client_1.prisma.user.count({ where: { deletedAt: null } }),
        ]);
        return { data, total };
    },
    async updateRefreshToken(id, refreshTokenHash) {
        return client_1.prisma.user.update({
            where: { id },
            data: { refreshTokenHash },
        });
    },
    async updateLastLogin(id) {
        return client_1.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    },
};
//# sourceMappingURL=user.js.map