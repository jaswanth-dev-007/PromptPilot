import { readTextFile } from '@promptpilot/fs'
import type { PipelineStep, Artifact } from '../types'

export async function assembleContext(
  step: PipelineStep,
  artifacts: Map<string, Artifact>,
  _maxTokens: number = 128000,
): Promise<string> {
  let context = ''

  for (const depId of step.dependencies) {
    const artifact = artifacts.get(depId)
    if (!artifact?.exists) continue
    const content = await readTextFile(artifact.path)
    context += `\n\n---\n## Context: ${depId}\n---\n\n${content}`
  }

  return context
}
