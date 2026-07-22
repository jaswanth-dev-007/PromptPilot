import mongoose from 'mongoose'
import { DatabaseError } from '@promptpilot/shared'
import type { PromptPilotConfig } from '@promptpilot/config'

let connection: typeof mongoose | null = null

export async function connectDatabase(config: PromptPilotConfig): Promise<typeof mongoose> {
  if (connection) return connection

  try {
    connection = await mongoose.connect(config.database.uri, {
      dbName: config.database.name,
      maxPoolSize: 10,
    })

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })

    return connection
  } catch (cause) {
    throw new DatabaseError(
      'Failed to connect to MongoDB',
      `Ensure MongoDB is running at ${config.database.uri}`,
      cause,
    )
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (connection) {
    await mongoose.disconnect()
    connection = null
  }
}

export function getConnection(): typeof mongoose | null {
  return connection
}

export function isConnected(): boolean {
  return mongoose.connection.readyState === 1
}
