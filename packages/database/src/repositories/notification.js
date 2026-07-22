"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const client_1 = require("../client");
exports.NotificationRepository = {
    findById(id) {
        return client_1.prisma.notification.findUnique({ where: { id } });
    },
    async create(data) {
        return client_1.prisma.notification.create({ data });
    },
    async markRead(id) {
        return client_1.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    },
    async markAllRead(userId) {
        return client_1.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    },
    async listByUser(userId, params) {
        const where = { userId };
        const [data, total] = await Promise.all([
            client_1.prisma.notification.findMany({
                where,
                skip: params.skip,
                take: params.take,
                orderBy: { createdAt: 'desc' },
            }),
            client_1.prisma.notification.count({ where }),
        ]);
        return { data, total };
    },
    async countUnread(userId) {
        return client_1.prisma.notification.count({
            where: { userId, read: false },
        });
    },
};
//# sourceMappingURL=notification.js.map