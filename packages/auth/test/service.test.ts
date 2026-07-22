import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { User } from '@promptpilot/db'
import { AuthService } from '../src/service'

const mockConfig = {
  auth: {
    jwtSecret: 'test-secret-that-is-at-least-32-characters!!',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    bcryptSaltRounds: 10,
  },
} as any

describe('AuthService', () => {
  let mongoServer: MongoMemoryServer
  let authService: AuthService

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), { dbName: 'test' })
    authService = new AuthService(mockConfig)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('register', () => {
    it('creates a new user and returns tokens', async () => {
      const { user, tokens } = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      })

      expect(user.email).toBe('new@example.com')
      expect(user.name).toBe('New User')
      expect(tokens.accessToken).toBeTruthy()
      expect(tokens.refreshToken).toBeTruthy()
    })

    it('rejects duplicate email', async () => {
      await authService.register({
        email: 'dupe@example.com',
        password: 'password123',
        name: 'First',
      })

      await expect(
        authService.register({
          email: 'dupe@example.com',
          password: 'password123',
          name: 'Second',
        }),
      ).rejects.toThrow('already exists')
    })
  })

  describe('login', () => {
    it('authenticates with valid credentials', async () => {
      await authService.register({
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User',
      })

      const { user, tokens } = await authService.login({
        email: 'login@example.com',
        password: 'password123',
      })

      expect(user.email).toBe('login@example.com')
      expect(tokens.accessToken).toBeTruthy()
    })

    it('rejects invalid password', async () => {
      await authService.register({
        email: 'wrong@example.com',
        password: 'password123',
        name: 'Wrong Pass',
      })

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow('Invalid email or password')
    })

    it('rejects non-existent user', async () => {
      await expect(
        authService.login({
          email: 'nobody@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid email or password')
    })

    it('rejects deactivated user', async () => {
      await authService.register({
        email: 'deactivated@example.com',
        password: 'password123',
        name: 'Deactivated',
      })

      await User.updateOne({ email: 'deactivated@example.com' }, { isActive: false })

      await expect(
        authService.login({
          email: 'deactivated@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('deactivated')
    })
  })

  describe('refreshTokens', () => {
    it('refreshes tokens with a valid refresh token', async () => {
      const { tokens } = await authService.register({
        email: 'refresh@example.com',
        password: 'password123',
        name: 'Refresh User',
      })

      const newTokens = await authService.refreshTokens(tokens.refreshToken)
      expect(newTokens.accessToken).toBeTruthy()
      expect(newTokens.refreshToken).toBeTruthy()
      expect(newTokens.accessToken).not.toBe(tokens.accessToken)
    })

    it('rejects an already-used refresh token', async () => {
      const { tokens } = await authService.register({
        email: 'reuse@example.com',
        password: 'password123',
        name: 'Reuse User',
      })

      await authService.refreshTokens(tokens.refreshToken)

      await expect(authService.refreshTokens(tokens.refreshToken)).rejects.toThrow('revoked')
    })
  })

  describe('logout', () => {
    it('clears the refresh token hash', async () => {
      const { user, tokens } = await authService.register({
        email: 'logout@example.com',
        password: 'password123',
        name: 'Logout User',
      })

      await authService.logout(user._id.toString())

      await expect(authService.refreshTokens(tokens.refreshToken)).rejects.toThrow()
    })
  })
})
