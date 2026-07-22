import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { User } from '../src/models/user'
import { Project } from '../src/models/project'

describe('models', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), { dbName: 'test' })
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Project.deleteMany({})
  })

  describe('User', () => {
    it('creates a user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
      })

      expect(user._id).toBeDefined()
      expect(user.email).toBe('test@example.com')

      const json = user.toJSON()
      expect(json.passwordHash).toBeUndefined()
      expect(json.refreshTokenHash).toBeUndefined()
    })

    it('enforces unique email', async () => {
      await User.create({
        email: 'dupe@example.com',
        passwordHash: 'hashed',
        name: 'First',
      })

      await expect(
        User.create({
          email: 'dupe@example.com',
          passwordHash: 'hashed',
          name: 'Second',
        }),
      ).rejects.toThrow()
    })

    it('defaults role to member', async () => {
      const user = await User.create({
        email: 'role@example.com',
        passwordHash: 'hashed',
        name: 'Role Test',
      })

      expect(user.role).toBe('member')
    })
  })

  describe('Project', () => {
    it('creates a project with an owner', async () => {
      const user = await User.create({
        email: 'owner@example.com',
        passwordHash: 'hashed',
        name: 'Owner',
      })

      const project = await Project.create({
        name: 'Test Project',
        slug: 'test-project',
        ownerId: user._id,
        settings: { theme: 'dark' },
      })

      expect(project._id).toBeDefined()
      expect(project.name).toBe('Test Project')
      expect(project.settings.theme).toBe('dark')
    })

    it('prevents duplicate slug for same owner', async () => {
      const user = await User.create({
        email: 'slug@example.com',
        passwordHash: 'hashed',
        name: 'Slug Test',
      })

      await Project.create({
        name: 'First',
        slug: 'my-project',
        ownerId: user._id,
      })

      await expect(
        Project.create({
          name: 'Second',
          slug: 'my-project',
          ownerId: user._id,
        }),
      ).rejects.toThrow()
    })

    it('stores members with roles', async () => {
      const owner = await User.create({
        email: 'team-owner@example.com',
        passwordHash: 'hashed',
        name: 'Team Owner',
      })

      const member = await User.create({
        email: 'team-member@example.com',
        passwordHash: 'hashed',
        name: 'Team Member',
      })

      const project = await Project.create({
        name: 'Team Project',
        slug: 'team-project',
        ownerId: owner._id,
        members: [{ userId: member._id, role: 'editor' }],
      })

      expect(project.members).toHaveLength(1)
      expect(project.members[0].role).toBe('editor')
    })
  })
})
