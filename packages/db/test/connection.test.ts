import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { connectDatabase, disconnectDatabase, isConnected } from '../src/connection'

describe('connectDatabase', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
  })

  afterAll(async () => {
    await disconnectDatabase()
    await mongoServer.stop()
  })

  it('connects to the database', async () => {
    const connection = await connectDatabase({
      database: {
        uri: mongoServer.getUri(),
        name: 'test',
      },
    } as any)

    expect(connection).toBeDefined()
    expect(isConnected()).toBe(true)
  })

  it('returns the existing connection on subsequent calls', async () => {
    const connection = await connectDatabase({
      database: {
        uri: mongoServer.getUri(),
        name: 'test',
      },
    } as any)

    expect(connection).toBeDefined()
  })

  it('disconnects cleanly', async () => {
    await disconnectDatabase()
    expect(isConnected()).toBe(false)
  })
})
