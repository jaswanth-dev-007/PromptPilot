import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { DEFAULT_CONFIG } from '@promptpilot/config'
import { User } from '@promptpilot/db'
import { createApp } from '../src/app'

let mongoServer: MongoMemoryServer
let config: typeof DEFAULT_CONFIG
let app: ReturnType<typeof createApp>

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test-api' })

  config = {
    ...DEFAULT_CONFIG,
    server: { ...DEFAULT_CONFIG.server, corsOrigin: '*' },
    auth: {
      ...DEFAULT_CONFIG.auth,
      jwtSecret: 'test-secret-that-is-at-least-32-characters!!',
    },
  }

  app = createApp(config)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
})

function extractCookie(res: request.Response, name: string): string | null {
  const cookies = res.headers['set-cookie'] as string[] | undefined
  if (!cookies) return null
  for (const c of cookies) {
    const match = c.match(new RegExp(`^${name}=([^;]+)`))
    if (match) return match[1]
  }
  return null
}

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('creates a user and sets auth cookies', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.email).toBe('test@example.com')
      expect(res.body.data.user.passwordHash).toBeUndefined()
      expect(res.body.data.expiresIn).toBeGreaterThan(0)

      const accessCookie = extractCookie(res, 'accessToken')
      const refreshCookie = extractCookie(res, 'refreshToken')
      expect(accessCookie).toBeTruthy()
      expect(refreshCookie).toBeTruthy()
    })

    it('rejects duplicate email', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'dupe@example.com',
        password: 'password123',
        name: 'First',
      })

      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'dupe@example.com',
        password: 'password123',
        name: 'Second',
      })

      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
    })

    it('rejects invalid input', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'not-an-email',
        password: 'short',
        name: '',
      })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('logs in and sets cookies', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User',
      })

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)

      const accessCookie = extractCookie(res, 'accessToken')
      expect(accessCookie).toBeTruthy()
    })

    it('rejects invalid password', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: 'badpw@example.com',
        password: 'password123',
        name: 'Bad PW',
      })

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'badpw@example.com',
        password: 'wrongpassword',
      })

      expect(res.status).toBe(401)
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    it('refreshes tokens', async () => {
      const registerRes = await request(app).post('/api/v1/auth/register').send({
        email: 'refresh@example.com',
        password: 'password123',
        name: 'Refresh',
      })

      const refreshToken = extractCookie(registerRes, 'refreshToken')!
      expect(refreshToken).toBeTruthy()

      const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken })

      expect(res.status).toBe(200)
      expect(res.body.data.expiresIn).toBeGreaterThan(0)

      const newRefreshCookie = extractCookie(res, 'refreshToken')
      expect(newRefreshCookie).toBeTruthy()
      expect(newRefreshCookie).not.toBe(refreshToken)
    })
  })

  describe('GET /api/v1/auth/me', () => {
    it('returns user with valid Bearer token', async () => {
      const registerRes = await request(app).post('/api/v1/auth/register').send({
        email: 'me@example.com',
        password: 'password123',
        name: 'Me User',
      })

      const accessToken = extractCookie(registerRes, 'accessToken')!

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.email).toBe('me@example.com')
    })

    it('rejects without token', async () => {
      const res = await request(app).get('/api/v1/auth/me')
      expect(res.status).toBe(403)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('logs out and invalidates refresh token', async () => {
      const registerRes = await request(app).post('/api/v1/auth/register').send({
        email: 'logout@example.com',
        password: 'password123',
        name: 'Logout User',
      })

      const accessToken = extractCookie(registerRes, 'accessToken')!
      const refreshToken = extractCookie(registerRes, 'refreshToken')!

      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(logoutRes.status).toBe(200)

      const clearCookie = logoutRes.headers['set-cookie'] as string[]
      expect(clearCookie.some(c => c.includes('accessToken=;'))).toBe(true)

      const refreshRes = await request(app).post('/api/v1/auth/refresh').send({ refreshToken })

      expect(refreshRes.status).toBe(401)
    })
  })
})
