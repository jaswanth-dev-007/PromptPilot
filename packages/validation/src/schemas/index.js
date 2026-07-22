"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email();
exports.passwordSchema = zod_1.z.string().min(8, 'Password must be at least 8 characters').max(128);
exports.registerSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    name: zod_1.z.string().min(1).max(100),
});
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1),
});
//# sourceMappingURL=index.js.map