"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.disconnect = disconnect;
exports.healthCheck = healthCheck;
const client_1 = require("@prisma/client");
const shared_1 = require("@promptpilot/shared");
const globalForPrisma = globalThis;
function createPrismaClient() {
    const client = new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'warn', 'error']
            : ['warn', 'error'],
    });
    client.$connect().catch((err) => {
        shared_1.logger.error({ err }, 'Failed to connect to database');
        process.exit(1);
    });
    return client;
}
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
async function disconnect() {
    await exports.prisma.$disconnect();
}
async function healthCheck() {
    try {
        await exports.prisma.$queryRawUnsafe('SELECT 1');
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=index.js.map