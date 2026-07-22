export interface PipelineStep {
  id: string
  name: string
  promptPath: string
  output: string
  dependencies: string[]
  parallelSafe: boolean
  recommendedModels: string[]
}
export interface Artifact {
  path: string
  exists: boolean
  lastModified: Date | null
  stale: boolean
  staleReason?: string
}
export interface PipelineState {
  steps: Map<string, PipelineStep>
  artifacts: Map<string, Artifact>
  completed: string[]
  pending: string[]
  stale: string[]
  next: PipelineStep | null
  parallelGroups: PipelineStep[][]
}
export interface PipelineManifest {
  version: string
  pipeline: PipelineStep[]
}
export interface PipelineResult {
  completedSteps: string[]
  failedSteps: string[]
  totalTokens: number
  totalCost: number
  totalDurationMs: number
  artifacts: Map<string, string>
}
export interface RunOptions {
  all: boolean
  parallel: boolean
  yes: boolean
  force: boolean
  dryRun: boolean
  verbose: boolean
  step?: number
}
//# sourceMappingURL=types.d.ts.map
