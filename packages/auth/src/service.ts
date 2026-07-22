import { AuthError, ConflictError, NotFoundError } from '@promptpilot/shared'
import type { PromptPilotConfig } from '@promptpilot/config'
import { User } from '@promptpilot/db'
import type { IUserDocument } from '@promptpilot/db'
import { hashPassword, verifyPassword } from './hash'
import { generateTokens, verifyRefreshToken, hashToken } from './tokens'
import type { RegisterInput, LoginInput, AuthTokens } from './types'

export class AuthService {
  private config: PromptPilotConfig

  constructor(config: PromptPilotConfig) {
    this.config = config
  }

  async register(input: RegisterInput): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() })
    if (existing) {
      throw new ConflictError('A user with this email already exists', 'Try logging in instead.')
    }

    const passwordHash = await hashPassword(input.password, this.config.auth.bcryptSaltRounds)

    const user = await User.create({
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
    })

    const tokens = generateTokens(
      { userId: user._id.toString(), email: user.email, role: user.role },
      this.config.auth.jwtSecret,
      this.config.auth.jwtExpiresIn,
      this.config.auth.jwtRefreshExpiresIn,
    )

    user.refreshTokenHash = hashToken(tokens.refreshToken)
    await user.save()

    return { user, tokens }
  }

  async login(input: LoginInput): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    const user = await User.findOne({ email: input.email.toLowerCase() })
    if (!user) {
      throw new AuthError('Invalid email or password', 'Check your credentials and try again.')
    }

    if (!user.isActive) {
      throw new AuthError('Account is deactivated', 'Contact support for assistance.')
    }

    const valid = await verifyPassword(input.password, user.passwordHash)
    if (!valid) {
      throw new AuthError('Invalid email or password', 'Check your credentials and try again.')
    }

    const tokens = generateTokens(
      { userId: user._id.toString(), email: user.email, role: user.role },
      this.config.auth.jwtSecret,
      this.config.auth.jwtExpiresIn,
      this.config.auth.jwtRefreshExpiresIn,
    )

    user.refreshTokenHash = hashToken(tokens.refreshToken)
    user.lastLoginAt = new Date()
    await user.save()

    return { user, tokens }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload
    try {
      payload = verifyRefreshToken(refreshToken, this.config.auth.jwtSecret)
    } catch {
      throw new AuthError('Invalid or expired refresh token', 'Please log in again.')
    }

    const user = await User.findById(payload.userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const tokenHash = hashToken(refreshToken)
    if (user.refreshTokenHash !== tokenHash) {
      throw new AuthError('Refresh token has been revoked', 'Please log in again.')
    }

    const tokens = generateTokens(
      { userId: user._id.toString(), email: user.email, role: user.role },
      this.config.auth.jwtSecret,
      this.config.auth.jwtExpiresIn,
      this.config.auth.jwtRefreshExpiresIn,
    )

    user.refreshTokenHash = hashToken(tokens.refreshToken)
    await user.save()

    return tokens
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: '' } })
  }

  async getUser(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }
}
