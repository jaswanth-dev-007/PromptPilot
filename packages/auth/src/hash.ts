import bcrypt from 'bcrypt'

export async function hashPassword(plain: string, rounds = 12): Promise<string> {
  return bcrypt.hash(plain, rounds)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
