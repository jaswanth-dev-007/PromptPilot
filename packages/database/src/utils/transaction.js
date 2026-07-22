"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = transaction;
exports.getClient = getClient;
const client_1 = require("../client");
async function transaction(fn) {
    return client_1.prisma.$transaction(fn);
}
function getClient() {
    return client_1.prisma;
}
//# sourceMappingURL=transaction.js.map