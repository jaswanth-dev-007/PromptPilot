"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateParams = paginateParams;
exports.paginatedResult = paginatedResult;
function paginateParams(params) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;
    return { skip, take: limit };
}
function paginatedResult(data, total, params) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
//# sourceMappingURL=pagination.js.map