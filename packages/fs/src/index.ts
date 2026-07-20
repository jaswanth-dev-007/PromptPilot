import { readFile, stat, writeFile, rename, mkdir, unlink } from 'fs/promises'
import { dirname } from 'path'
import { FileSystemError } from '@promptpilot/shared'

const cache = new Map<string, { content: string; mtime: Date }>()

export async function readTextFile(filePath: string): Promise<string> {
  try {
    const stats = await stat(filePath)
    const cached = cache.get(filePath)
    if (cached && cached.mtime.getTime() === stats.mtimeMs) {
      return cached.content
    }
    const content = await readFile(filePath, 'utf-8')
    cache.set(filePath, { content, mtime: new Date(stats.mtimeMs) })
    return content
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileSystemError(
        `File not found: ${filePath}`,
        filePath,
        'Ensure the file exists. Run `promptpilot validate` to check your project structure.',
      )
    }
    throw new FileSystemError(
      `Failed to read file: ${filePath}`,
      filePath,
      'Check file permissions and disk space.',
      error,
    )
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readTextFile(filePath)
  try {
    return JSON.parse(content) as T
  } catch (error) {
    throw new FileSystemError(
      `Invalid JSON in file: ${filePath}`,
      filePath,
      'Check the file for syntax errors.',
      error,
    )
  }
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath))
  try {
    await writeFile(filePath, content, 'utf-8')
  } catch (error) {
    throw new FileSystemError(
      `Failed to write file: ${filePath}`,
      filePath,
      'Check disk space and directory permissions.',
      error,
    )
  }
}

export async function atomicWrite(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath))
  const tmpPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`
  try {
    await writeFile(tmpPath, content, 'utf-8')
    await rename(tmpPath, filePath)
  } catch (error) {
    try {
      await unlink(tmpPath)
    } catch {
      /* ignore */
    }
    throw new FileSystemError(
      `Failed to write file atomically: ${filePath}`,
      filePath,
      'Check disk space and directory permissions.',
      error,
    )
  }
}

export function clearCache(): void {
  cache.clear()
}

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    throw new FileSystemError(
      `Failed to create directory: ${dirPath}`,
      dirPath,
      'Check parent directory permissions.',
      error,
    )
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

export async function getFileMtime(filePath: string): Promise<Date | null> {
  try {
    const stats = await stat(filePath)
    return stats.mtime
  } catch {
    return null
  }
}
