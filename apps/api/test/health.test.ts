import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { DEFAULT_CONFIG } from '@promptpilot/config'
import { createApp } from '../src/app'

const testConfig = {
  ...DEFAULT_CONFIG,
  server: { ...DEFAULT_CONFIG.server, port: 3001, corsOrigin: '*' },
  auth: {
    ...DEFAULT_CONFIG.auth,
    jwtSecret: 'test-secret-that-is-at-least-32-characters!!',
  },
}

const app = createApp(testConfig)

describe('Health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.status).toBe('ok')
    expect(res.body.data.uptime).toBeGreaterThan(0)
  })
})
