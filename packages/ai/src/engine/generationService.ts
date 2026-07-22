import { logger, PipelineError } from '@promptpilot/shared'
import { createAdapter } from '@promptpilot/adapters'
import type { PromptPilotConfig } from '@promptpilot/config'
import type { GenerationResult } from '@promptpilot/adapters'
import {
  AIConversationRepository,
  MessageRepository,
  GenerationRepository,
  DocumentRepository,
  DocumentVersionRepository,
} from '@promptpilot/database'
import { PromptEngine } from './promptEngine'
import type { PromptTemplate, PromptContext } from './promptEngine'

export class GenerationService {
  private promptEngine: PromptEngine
  private config: PromptPilotConfig

  constructor(config: PromptPilotConfig) {
    this.config = config
    this.promptEngine = new PromptEngine(config)
  }

  async generateDocument(params: {
    projectId: string
    stepId: string
    template: PromptTemplate
    context: PromptContext
    signal?: AbortSignal
  }): Promise<{
    document: Awaited<ReturnType<typeof DocumentRepository.findById>>
    conversation: Awaited<ReturnType<typeof AIConversationRepository.findById>>
  }> {
    const adapter = createAdapter(this.config)
    const model = this.config.model || adapter.model

    const conversation = await AIConversationRepository.create({
      project: { connect: { id: params.projectId } },
      stepId: params.stepId,
      model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      status: 'ACTIVE',
      startedAt: new Date(),
    })

    try {
      const compiled = this.promptEngine.compile(
        params.template,
        params.context,
        adapter.maxContextTokens,
      )
      if (!compiled.withinLimits) {
        logger.warn(
          { estimatedTokens: compiled.estimatedTokens, contextWindow: compiled.contextWindow },
          'Prompt exceeds 90% context window — generation may be truncated',
        )
      }

      await MessageRepository.create({
        conversationId: conversation.id,
        role: 'SYSTEM',
        content: compiled.systemPrompt,
        sequence: 1,
        tokens: this.promptEngine.estimateTokens(compiled.systemPrompt),
      })

      await MessageRepository.create({
        conversationId: conversation.id,
        role: 'USER',
        content: compiled.userPrompt,
        sequence: 2,
        tokens: compiled.estimatedTokens,
      })

      let responseContent: string
      let generationResult: GenerationResult

      if (this.config.stream) {
        const chunks: string[] = []
        for await (const chunk of adapter.generateStream(compiled.userPrompt, {
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          stream: true,
          signal: params.signal,
        })) {
          chunks.push(chunk)
        }
        responseContent = chunks.join('')
        generationResult = {
          content: responseContent,
          inputTokens: compiled.estimatedTokens,
          outputTokens: adapter.countTokens(responseContent),
          model,
          durationMs: 0,
          cost: 0,
        }
      } else {
        generationResult = await adapter.generate(compiled.userPrompt, {
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          stream: false,
          signal: params.signal,
        })
        responseContent = generationResult.content
      }

      const outputTokens = adapter.countTokens(responseContent)

      await MessageRepository.create({
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: responseContent,
        sequence: 3,
        tokens: outputTokens,
      })

      await GenerationRepository.create({
        conversation: { connect: { id: conversation.id } },
        model: generationResult.model,
        provider: this.config.provider.toUpperCase() as
          'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'OLLAMA',
        promptTokens: generationResult.inputTokens,
        completionTokens: outputTokens,
        totalTokens: generationResult.inputTokens + outputTokens,
        cost: generationResult.cost || 0,
        durationMs: generationResult.durationMs,
        status: 'SUCCESS',
      })

      await AIConversationRepository.updateTokenTotals(
        conversation.id,
        generationResult.inputTokens,
        outputTokens,
        generationResult.cost,
      )

      const existingDoc = await DocumentRepository.findByProjectAndStep(
        params.projectId,
        params.stepId,
      )

      let document
      if (existingDoc) {
        document = await DocumentRepository.updateContent(
          existingDoc.id,
          responseContent,
          existingDoc.version + 1,
        )
        await DocumentVersionRepository.create({
          documentId: existingDoc.id,
          versionNumber: document.version,
          content: responseContent,
          modelUsed: model,
          tokensUsed: generationResult.inputTokens + outputTokens,
        })
      } else {
        document = await DocumentRepository.create({
          project: { connect: { id: params.projectId } },
          stepId: params.stepId,
          title: params.template.title,
          type: params.stepId.replace(/-/g, '_').toUpperCase() as
            | 'MASTER_CONTEXT'
            | 'PRD'
            | 'SRS'
            | 'ARCHITECTURE'
            | 'DATABASE'
            | 'API_SPEC'
            | 'USER_FLOWS'
            | 'WIREFRAMES'
            | 'ROADMAP',
          content: responseContent,
          status: 'GENERATED',
          version: 1,
          conversation: {
            create: {
              project: { connect: { id: params.projectId } },
              stepId: params.stepId,
              model,
              status: 'COMPLETED',
              startedAt: new Date(),
              completedAt: new Date(),
            },
          },
        })
      }

      await AIConversationRepository.updateStatus(conversation.id, 'COMPLETED')

      return { document, conversation }
    } catch (error) {
      logger.error({ error, stepId: params.stepId }, 'Generation failed')

      await AIConversationRepository.updateStatus(conversation.id, 'FAILED')

      await GenerationRepository.create({
        conversation: { connect: { id: conversation.id } },
        model,
        provider: this.config.provider.toUpperCase() as
          'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'OLLAMA',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        cost: 0,
        durationMs: 0,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new PipelineError(
        `Generation failed for step "${params.stepId}"`,
        params.stepId,
        error instanceof Error ? error.message : 'Try again or adjust generation parameters.',
      )
    }
  }
}
