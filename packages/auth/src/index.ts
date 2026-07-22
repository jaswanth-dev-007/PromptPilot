export { AuthService } from './service'
export { createAuthMiddleware } from './middleware'
export type { AuthenticatedRequest } from './middleware'
export { validateBody } from './validate'
export {
  setAuthCookies,
  clearAuthCookies,
  extractAccessToken,
  extractRefreshToken,
} from './cookies'
export { hashPassword, verifyPassword } from './hash'
export { generateTokens, verifyAccessToken, verifyRefreshToken, hashToken } from './tokens'
export type { TokenPayload, AuthTokens, LoginInput, RegisterInput } from './types'
