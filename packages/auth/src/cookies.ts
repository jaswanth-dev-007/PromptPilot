import type { Response, CookieOptions } from 'express'
import type { AuthTokens } from './types'

const SAME_SITE = (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as
  'strict' | 'lax' | 'none'
const SECURE = process.env.NODE_ENV === 'production'

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
  const cookieOpts: CookieOptions = {
    httpOnly: true,
    secure: SECURE,
    sameSite: SAME_SITE,
  }

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOpts,
    path: '/',
    maxAge: tokens.expiresIn * 1000,
  })

  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieOpts,
    path: '/api/v1/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', { httpOnly: true, secure: SECURE, sameSite: SAME_SITE, path: '/' })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: SECURE,
    sameSite: SAME_SITE,
    path: '/api/v1/auth',
  })
}

export function extractAccessToken(cookieHeader?: string, authHeader?: string): string | null {
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/)
    if (match) return match[1]
  }
  return null
}

export function extractRefreshToken(
  cookieHeader?: string,
  body?: { refreshToken?: string },
): string | null {
  if (body?.refreshToken) return body.refreshToken
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)refreshToken=([^;]+)/)
    if (match) return match[1]
  }
  return null
}
