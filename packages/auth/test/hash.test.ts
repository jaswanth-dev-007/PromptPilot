import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../src/hash'

describe('hashPassword', () => {
  it('hashes a password', async () => {
    const hash = await hashPassword('mypassword')
    expect(hash).not.toBe('mypassword')
    expect(hash.startsWith('$2')).toBe(true)
  })

  it('verifies a correct password', async () => {
    const hash = await hashPassword('correct')
    const result = await verifyPassword('correct', hash)
    expect(result).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct')
    const result = await verifyPassword('wrong', hash)
    expect(result).toBe(false)
  })
})
