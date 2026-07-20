import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeTextFile, readTextFile, atomicWrite, fileExists, clearCache } from '../src/index'
import { mkdtemp, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

describe('FileSystem', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'pp-fs-test-'))
    clearCache()
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  describe('writeTextFile / readTextFile', () => {
    it('writes and reads text', async () => {
      const filePath = join(tempDir, 'test.txt')
      await writeTextFile(filePath, 'hello world')
      const content = await readTextFile(filePath)
      expect(content).toBe('hello world')
    })

    it('creates parent directories', async () => {
      const filePath = join(tempDir, 'deep', 'nested', 'file.txt')
      await writeTextFile(filePath, 'deep')
      const content = await readTextFile(filePath)
      expect(content).toBe('deep')
    })

    it('throws for missing file', async () => {
      await expect(readTextFile(join(tempDir, 'nonexistent.txt'))).rejects.toThrow()
    })
  })

  describe('atomicWrite', () => {
    it('writes atomically', async () => {
      const filePath = join(tempDir, 'atomic.txt')
      await writeFile(filePath, 'original', 'utf-8')
      await atomicWrite(filePath, 'updated')
      const content = await readTextFile(filePath)
      expect(content).toBe('updated')
    })
  })

  describe('fileExists', () => {
    it('returns true for existing files', async () => {
      const filePath = join(tempDir, 'exists.txt')
      await writeTextFile(filePath, 'exists')
      expect(await fileExists(filePath)).toBe(true)
    })

    it('returns false for missing files', async () => {
      expect(await fileExists(join(tempDir, 'nope.txt'))).toBe(false)
    })
  })
})
