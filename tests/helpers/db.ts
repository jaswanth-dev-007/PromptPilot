import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

export async function setupTestDb() {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, { dbName: 'test' })
  return uri
}

export async function teardownTestDb() {
  await mongoose.disconnect()
  if (mongoServer) {
    await mongoServer.stop()
  }
}

export async function clearCollections() {
  const collections = mongoose.connection.collections
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({})
  }
}
