import { readJsonFile } from '@promptpilot/fs'
import { FileSystemError } from '@promptpilot/shared'
import type { PipelineManifest } from '../types'

export async function loadManifest(projectDir: string): Promise<PipelineManifest> {
  const manifestPath = `${projectDir}/promptpilot.json`
  try {
    return await readJsonFile<PipelineManifest>(manifestPath)
  } catch (error) {
    throw new FileSystemError(
      `Failed to load pipeline manifest: ${manifestPath}`,
      manifestPath,
      'Run `promptpilot init` to create a project scaffold.',
      error,
    )
  }
}
