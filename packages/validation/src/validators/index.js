"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
    const errors = [];
    if (password.length < 8)
        errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password))
        errors.push('One uppercase letter');
    if (!/[a-z]/.test(password))
        errors.push('One lowercase letter');
    if (!/[0-9]/.test(password))
        errors.push('One number');
    return { valid: errors.length === 0, errors };
}
//# sourceMappingURL=index.js.map