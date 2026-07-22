"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResult = exports.paginateParams = exports.getClient = exports.transaction = exports.healthCheck = exports.disconnect = exports.prisma = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
Object.defineProperty(exports, "disconnect", { enumerable: true, get: function () { return client_1.disconnect; } });
Object.defineProperty(exports, "healthCheck", { enumerable: true, get: function () { return client_1.healthCheck; } });
__exportStar(require("./repositories"), exports);
var transaction_1 = require("./utils/transaction");
Object.defineProperty(exports, "transaction", { enumerable: true, get: function () { return transaction_1.transaction; } });
Object.defineProperty(exports, "getClient", { enumerable: true, get: function () { return transaction_1.getClient; } });
var pagination_1 = require("./utils/pagination");
Object.defineProperty(exports, "paginateParams", { enumerable: true, get: function () { return pagination_1.paginateParams; } });
Object.defineProperty(exports, "paginatedResult", { enumerable: true, get: function () { return pagination_1.paginatedResult; } });
//# sourceMappingURL=index.js.map