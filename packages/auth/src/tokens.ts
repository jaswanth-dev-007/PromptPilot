import jwt from 'jsonwebtoken'
import { createHash, randomUUID } from 'crypto'
import type { TokenPayload, AuthTokens } from './types'

export function generateTokens(
  payload: TokenPayload,
  secret: string,
  expiresIn: string,
  refreshExpiresIn: string,
): AuthTokens {
  const accessToken = jwt.sign({ ...payload, jti: randomUUID() }, secret, {
    expiresIn,
  } as jwt.SignOptions)
  const refreshToken = jwt.sign({ ...payload, jti: randomUUID() }, secret, {
    expiresIn: refreshExpiresIn,
  } as jwt.SignOptions)

  const expiresInSeconds = parseExpiresIn(expiresIn)

  return { accessToken, refreshToken, expiresIn: expiresInSeconds }
}

export function verifyAccessToken(token: string, secret: string): TokenPayload {
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload
  return { userId: decoded.userId, email: decoded.email, role: decoded.role }
}

export function verifyRefreshToken(token: string, secret: string): TokenPayload {
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload
  return { userId: decoded.userId, email: decoded.email, role: decoded.role }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/)
  if (!match) return 604800

  const value = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 'd':
      return value * 86400
    case 'h':
      return value * 3600
    case 'm':
      return value * 60
    case 's':
      return value
    default:
      return 604800
  }
}
