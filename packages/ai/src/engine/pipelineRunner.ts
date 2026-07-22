import { logger, PipelineError } from '@promptpilot/shared'
import type { PromptPilotConfig } from '@promptpilot/config'
import type { PipelineManifest, PipelineStep, PipelineResult } from '@promptpilot/core'
import { DocumentRepository } from '@promptpilot/database'
import { GenerationService } from './generationService'
import type { PromptContext } from './promptEngine'

const DEFAULT_TEMPLATES: Record<string, { id: string; title: string; category: string; systemPrompt: string; userPromptTemplate: string; variables: string[]; tags: string[]; version: number }> = {
  'master-context': {
    id: 'master-context', title: 'Master Context', category: 'foundation',
    systemPrompt: 'You are an expert product strategist.',
    userPromptTemplate: 'Create a master context document for: {USER_INPUT}\n\nDefine the product vision, target audience, platform, and industry domain.',
    variables: ['USER_INPUT'], tags: ['foundation', 'context'], version: 1,
  },
  prd: {
    id: 'prd', title: 'Product Requirements Document', category: 'specification',
    systemPrompt: 'You are a senior product manager creating a PRD.',
    userPromptTemplate: 'Generate a complete Product Requirements Document based on the Master Context above.\n\nInclude functional requirements, non-functional requirements, and user stories.',
    variables: [], tags: ['specification', 'product'], version: 1,
  },
  srs: {
    id: 'srs', title: 'Software Requirements Specification', category: 'specification',
    systemPrompt: 'You are a software architect creating an SRS document.',
    userPromptTemplate: 'Generate a Software Requirements Specification based on the PRD and Master Context.\n\nInclude system architecture, API design, data models, and deployment strategy.',
    variables: [], tags: ['specification', 'architecture'], version: 1,
  },
  architecture: {
    id: 'architecture', title: 'System Architecture', category: 'architecture',
    systemPrompt: 'You are a principal software architect.',
    userPromptTemplate: 'Design the complete system architecture based on the SRS.\n\nInclude component diagrams, technology choices, data flow, and scaling strategy.',
    variables: [], tags: ['architecture', 'design'], version: 1,
  },
  database: {
    id: 'database', title: 'Database Schema', category: 'design',
    systemPrompt: 'You are a database architect.',
    userPromptTemplate: 'Design the database schema based on the SRS and Architecture.\n\nInclude entity definitions, relationships, indexes, and migration strategy.',
    variables: [], tags: ['design', 'database'], version: 1,
  },
  'api-spec': {
    id: 'api-spec', title: 'API Specification', category: 'design',
    systemPrompt: 'You are an API architect.',
    userPromptTemplate: 'Design the REST API based on the SRS and Architecture.\n\nInclude endpoints, request/response schemas, authentication, and rate limiting.',
    variables: [], tags: ['design', 'api'], version: 1,
  },
  'user-flows': {
    id: 'user-flows', title: 'User Flows', category: 'design',
    systemPrompt: 'You are a UX architect.',
    userPromptTemplate: 'Map the complete user flows based on the PRD.\n\nInclude registration, main workflows, edge cases, and error states.',
    variables: [], tags: ['design', 'ux'], version: 1,
  },
  wireframes: {
    id: 'wireframes', title: 'UI Wireframes', category: 'design',
    systemPrompt: 'You are a UI designer creating wireframes.',
    userPromptTemplate: 'Generate UI wireframe descriptions based on the User Flows.\n\nInclude layouts for landing page, dashboard, and key screens.',
    variables: [], tags: ['design', 'ui'], version: 1,
  },
  roadmap: {
    id: 'roadmap', title: 'Feature Roadmap', category: 'planning',
    systemPrompt: 'You are a product strategist creating a roadmap.',
    userPromptTemplate: 'Create a feature roadmap based on the PRD and Architecture.\n\nInclude MVP, growth, and enterprise phases with priorities.',
    variables: [], tags: ['planning', 'roadmap'], version: 1,
  },
}

export class PipelineRunner {
  private generationService: GenerationService

  constructor(config: PromptPilotConfig) {
    this.generationService = new GenerationService(config)
  }

  async run(
    projectId: string,
    manifest: PipelineManifest,
    context: PromptContext,
    options: { parallel?: boolean; force?: boolean; signal?: AbortSignal } = {},
  ): Promise<PipelineResult> {
    const completedSteps: string[] = []
    const failedSteps: string[] = []
    let totalTokens = 0
    let totalCost = 0
    const totalDurationMs = 0

    const runnableSteps = this.orderSteps(manifest)

    for (const step of runnableSteps) {
      if (options.signal?.aborted) {
        failedSteps.push(step.id)
        break
      }

      try {
        const stepContext = await this.buildStepContext(step, context, projectId)
        const result = await this.generationService.generateDocument({
          projectId,
          stepId: step.id,
          template: DEFAULT_TEMPLATES[step.id] || DEFAULT_TEMPLATES.prd,
          context: stepContext,
          signal: options.signal,
        })

        if (result.conversation) {
          totalTokens += (result.conversation.totalInputTokens || 0) + (result.conversation.totalOutputTokens || 0)
          totalCost += result.conversation.totalCost || 0
        }

        completedSteps.push(step.id)
        logger.info({ stepId: step.id }, 'Step completed')
      } catch (error) {
        failedSteps.push(step.id)
        logger.error({ error, stepId: step.id }, 'Step failed')
        if (!options.force) {
          throw new PipelineError(`Pipeline aborted at step "${step.id}"`, step.id)
        }
      }
    }

    return { completedSteps, failedSteps, totalTokens, totalCost, totalDurationMs, artifacts: new Map() }
  }

  private orderSteps(manifest: PipelineManifest): PipelineStep[] {
    const stepMap = new Map(manifest.pipeline.map(s => [s.id, s]))
    const inDegree = new Map<string, number>()
    const order: PipelineStep[] = []

    for (const step of manifest.pipeline) {
      if (!inDegree.has(step.id)) inDegree.set(step.id, 0)
      for (const dep of step.dependencies) {
        if (!inDegree.has(dep)) inDegree.set(dep, 0)
        inDegree.set(step.id, (inDegree.get(step.id) || 0) + 1)
      }
    }

    const queue = Array.from(inDegree.entries()).filter(([, d]: [string, number]) => d === 0).map(([id]: [string, number]) => id)

    while (queue.length) {
      const id = queue.shift()!
      const step = stepMap.get(id)
      if (step) {
        order.push(step)
        for (const s of manifest.pipeline) {
          if (s.dependencies.includes(id)) {
            const newDegree = (inDegree.get(s.id) || 1) - 1
            inDegree.set(s.id, newDegree)
            if (newDegree === 0) queue.push(s.id)
          }
        }
      }
    }

    return order
  }

  private async buildStepContext(step: PipelineStep, context: PromptContext, projectId: string): Promise<PromptContext> {
    const docs = await DocumentRepository.listByProject(projectId)
    const upstreamArtifacts = new Map<string, string>()
    for (const depId of step.dependencies) {
      const doc = docs.find((d: { stepId: string; content?: string | null }) => d.stepId === depId)
      if (doc?.content) upstreamArtifacts.set(depId, doc.content)
    }
    return { ...context, upstreamArtifacts }
  }
}
