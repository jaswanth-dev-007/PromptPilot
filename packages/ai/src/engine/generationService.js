"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationService = void 0;
const shared_1 = require("@promptpilot/shared");
const adapters_1 = require("@promptpilot/adapters");
const database_1 = require("@promptpilot/database");
const promptEngine_1 = require("./promptEngine");
class GenerationService {
    promptEngine;
    config;
    constructor(config) {
        this.config = config;
        this.promptEngine = new promptEngine_1.PromptEngine(config);
    }
    async generateDocument(params) {
        const adapter = (0, adapters_1.createAdapter)(this.config);
        const model = this.config.model || adapter.model;
        const conversation = await database_1.AIConversationRepository.create({
            project: { connect: { id: params.projectId } },
            stepId: params.stepId,
            model,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            status: 'ACTIVE',
            startedAt: new Date(),
        });
        try {
            const compiled = this.promptEngine.compile(params.template, params.context, adapter.maxContextTokens);
            if (!compiled.withinLimits) {
                shared_1.logger.warn({ estimatedTokens: compiled.estimatedTokens, contextWindow: compiled.contextWindow }, 'Prompt exceeds 90% context window — generation may be truncated');
            }
            await database_1.MessageRepository.create({
                conversationId: conversation.id,
                role: 'SYSTEM',
                content: compiled.systemPrompt,
                sequence: 1,
                tokens: this.promptEngine.estimateTokens(compiled.systemPrompt),
            });
            await database_1.MessageRepository.create({
                conversationId: conversation.id,
                role: 'USER',
                content: compiled.userPrompt,
                sequence: 2,
                tokens: compiled.estimatedTokens,
            });
            let responseContent;
            let generationResult;
            if (this.config.stream) {
                const chunks = [];
                for await (const chunk of adapter.generateStream(compiled.userPrompt, {
                    temperature: this.config.temperature,
                    maxTokens: this.config.maxTokens,
                    stream: true,
                    signal: params.signal,
                })) {
                    chunks.push(chunk);
                }
                responseContent = chunks.join('');
                generationResult = {
                    content: responseContent,
                    inputTokens: compiled.estimatedTokens,
                    outputTokens: adapter.countTokens(responseContent),
                    model,
                    durationMs: 0,
                    cost: 0,
                };
            }
            else {
                generationResult = await adapter.generate(compiled.userPrompt, {
                    temperature: this.config.temperature,
                    maxTokens: this.config.maxTokens,
                    stream: false,
                    signal: params.signal,
                });
                responseContent = generationResult.content;
            }
            const outputTokens = adapter.countTokens(responseContent);
            await database_1.MessageRepository.create({
                conversationId: conversation.id,
                role: 'ASSISTANT',
                content: responseContent,
                sequence: 3,
                tokens: outputTokens,
            });
            await database_1.GenerationRepository.create({
                conversation: { connect: { id: conversation.id } },
                model: generationResult.model,
                provider: this.config.provider.toUpperCase(),
                promptTokens: generationResult.inputTokens,
                completionTokens: outputTokens,
                totalTokens: generationResult.inputTokens + outputTokens,
                cost: generationResult.cost || 0,
                durationMs: generationResult.durationMs,
                status: 'SUCCESS',
            });
            await database_1.AIConversationRepository.updateTokenTotals(conversation.id, generationResult.inputTokens, outputTokens, generationResult.cost);
            const existingDoc = await database_1.DocumentRepository.findByProjectAndStep(params.projectId, params.stepId);
            let document;
            if (existingDoc) {
                document = await database_1.DocumentRepository.updateContent(existingDoc.id, responseContent, existingDoc.version + 1);
                await database_1.DocumentVersionRepository.create({
                    documentId: existingDoc.id,
                    versionNumber: document.version,
                    content: responseContent,
                    modelUsed: model,
                    tokensUsed: generationResult.inputTokens + outputTokens,
                });
            }
            else {
                document = await database_1.DocumentRepository.create({
                    project: { connect: { id: params.projectId } },
                    stepId: params.stepId,
                    title: params.template.title,
                    type: params.stepId.replace(/-/g, '_').toUpperCase(),
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
                });
            }
            await database_1.AIConversationRepository.updateStatus(conversation.id, 'COMPLETED');
            return { document, conversation };
        }
        catch (error) {
            shared_1.logger.error({ error, stepId: params.stepId }, 'Generation failed');
            await database_1.AIConversationRepository.updateStatus(conversation.id, 'FAILED');
            await database_1.GenerationRepository.create({
                conversation: { connect: { id: conversation.id } },
                model,
                provider: this.config.provider.toUpperCase(),
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0,
                cost: 0,
                durationMs: 0,
                status: 'FAILED',
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
            });
            throw new shared_1.PipelineError(`Generation failed for step "${params.stepId}"`, params.stepId, error instanceof Error ? error.message : 'Try again or adjust generation parameters.');
        }
    }
}
exports.GenerationService = GenerationService;
//# sourceMappingURL=generationService.js.map