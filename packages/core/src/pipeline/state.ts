import { getFileMtime } from '@promptpilot/fs'
import { join } from 'path'
import type { PipelineStep, Artifact, PipelineState } from '../types'
import type { PipelineManifest } from '../types'

export async function detectState(
  manifest: PipelineManifest,
  outputDir: string,
): Promise<PipelineState> {
  const steps = new Map<string, PipelineStep>()
  const artifacts = new Map<string, Artifact>()
  const completed: string[] = []

  for (const step of manifest.pipeline) {
    steps.set(step.id, step)
    const artifactPath = join(outputDir, step.output)
    const mtime = await getFileMtime(artifactPath)

    if (mtime) {
      artifacts.set(step.id, {
        path: artifactPath,
        exists: true,
        lastModified: mtime,
        stale: false,
      })
      completed.push(step.id)
    } else {
      artifacts.set(step.id, {
        path: artifactPath,
        exists: false,
        lastModified: null,
        stale: false,
      })
    }
  }

  const stale = detectStaleArtifacts(steps, artifacts, completed)
  const next = findNextStep(steps, completed)
  const pending = manifest.pipeline.filter(s => !completed.includes(s.id)).map(s => s.id)
  const parallelGroups = computeParallelGroups(manifest.pipeline, completed)

  return { steps, artifacts, completed, pending, stale, next, parallelGroups }
}

function detectStaleArtifacts(
  steps: Map<string, PipelineStep>,
  artifacts: Map<string, Artifact>,
  completed: string[],
): string[] {
  const stale: string[] = []

  for (const stepId of completed) {
    const step = steps.get(stepId)!
    for (const depId of step.dependencies) {
      const depArtifact = artifacts.get(depId)
      const currentArtifact = artifacts.get(stepId)
      if (
        depArtifact?.lastModified &&
        currentArtifact?.lastModified &&
        depArtifact.lastModified > currentArtifact.lastModified
      ) {
        const a = artifacts.get(stepId)!
        a.stale = true
        a.staleReason = `Upstream artifact "${depId}" modified after this artifact was generated.`
        stale.push(stepId)
        break
      }
    }
  }

  return stale
}

function findNextStep(steps: Map<string, PipelineStep>, completed: string[]): PipelineStep | null {
  for (const [, step] of steps) {
    if (completed.includes(step.id)) continue
    if (step.dependencies.every(depId => completed.includes(depId))) return step
  }
  return null
}

function computeParallelGroups(pipeline: PipelineStep[], completed: string[]): PipelineStep[][] {
  const pending = pipeline.filter(s => !completed.includes(s.id))
  const ready = pending.filter(s => s.dependencies.every(depId => completed.includes(depId)))
  const groups: PipelineStep[][] = []
  const remaining = new Set(ready)

  while (remaining.size > 0) {
    const group: PipelineStep[] = []
    for (const step of remaining) {
      if (step.parallelSafe) {
        group.push(step)
        remaining.delete(step)
      }
    }
    if (group.length === 0) {
      const first = remaining.values().next().value!
      group.push(first)
      remaining.delete(first)
    }
    groups.push(group)
  }

  return groups
}
