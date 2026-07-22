import { Router, type Router as RouterType, type Response, type NextFunction } from 'express'
import type { AuthenticatedRequest } from '@promptpilot/auth'
import type { PromptPilotConfig } from '@promptpilot/config'
import { GenerationService } from '@promptpilot/ai'
import { createAdapter } from '@promptpilot/adapters'
import { ProjectRepository, DocumentRepository } from '@promptpilot/database'

const SIMPLE_TEMPLATE = {
  id: 'generate',
  title: 'Generate Document',
  category: 'generation',
  systemPrompt: 'You are an expert software engineer. Generate a high-quality, well-structured engineering document based on the provided context and instructions.',
  userPromptTemplate: '{USER_INPUT}',
  variables: ['USER_INPUT'],
  tags: [],
  version: 1,
}

export function createPipelineRouter(config: PromptPilotConfig): RouterType {
  const router = Router()
  const generationService = new GenerationService(config)

  router.post('/pipeline/generate', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { projectId, stepId, userInput } = req.body
      if (!projectId || !stepId) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectId and stepId are required' } })
        return
      }

      const project = await ProjectRepository.findById(projectId)
      if (!project) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } })
        return
      }

      const result = await generationService.generateDocument({
        projectId,
        stepId,
        template: SIMPLE_TEMPLATE,
        context: {
          userInput: userInput || 'Generate a complete engineering document.',
          upstreamArtifacts: new Map(),
          projectDescription: project.description || undefined,
        },
      })

      const doc = await DocumentRepository.findById(result.document?.id || '')
      res.json({
        success: true,
        data: {
          document: doc ? { id: doc.id, title: doc.title, stepId: doc.stepId, status: doc.status, version: doc.version, content: doc.content } : null,
        },
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/pipeline/run', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { projectId, userInput } = req.body
      if (!projectId) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectId is required' } })
        return
      }

      const project = await ProjectRepository.findById(projectId)
      if (!project) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } })
        return
      }

      const steps = ['master-context', 'prd', 'srs', 'architecture', 'database', 'api-spec', 'user-flows', 'wireframes', 'roadmap']
      const results: Array<{ stepId: string; status: string; tokens?: number }> = []

      for (const stepId of steps) {
        try {
          const result = await generationService.generateDocument({
            projectId,
            stepId,
            template: SIMPLE_TEMPLATE,
            context: {
              userInput: userInput || 'Generate a complete engineering document.',
              upstreamArtifacts: new Map(),
              projectDescription: project.description || undefined,
            },
          })
          results.push({ stepId, status: 'completed', tokens: result.conversation?.totalInputTokens })
        } catch {
          results.push({ stepId, status: 'failed' })
        }
      }

      res.json({ success: true, data: { results } })
    } catch (err) {
      next(err)
    }
  })

  router.post('/pipeline/generate/stream', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { projectId, stepId, userInput } = req.body
      if (!projectId || !stepId) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectId and stepId are required' } })
        return
      }

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      const adapter = createAdapter(config)
      const prompt = `Generate a ${SIMPLE_TEMPLATE.title.toLowerCase()}.\n\n${userInput || 'Generate a complete engineering document.'}`

      try {
        for await (const chunk of adapter.generateStream(prompt, {
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          stream: true,
        })) {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
        }
        res.write(`data: [DONE]\n\n`)
      } catch (streamErr) {
        res.write(`data: ${JSON.stringify({ error: streamErr instanceof Error ? streamErr.message : 'Stream error' })}\n\n`)
      }

      res.end()
    } catch (err) {
      next(err)
    }
  })

  return router
}
