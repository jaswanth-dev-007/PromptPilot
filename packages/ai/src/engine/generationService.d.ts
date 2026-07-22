import type { PromptPilotConfig } from '@promptpilot/config';
import { AIConversationRepository, DocumentRepository } from '@promptpilot/database';
import type { PromptTemplate, PromptContext } from './promptEngine';
export declare class GenerationService {
    private promptEngine;
    private config;
    constructor(config: PromptPilotConfig);
    generateDocument(params: {
        projectId: string;
        stepId: string;
        template: PromptTemplate;
        context: PromptContext;
        signal?: AbortSignal;
    }): Promise<{
        document: Awaited<ReturnType<typeof DocumentRepository.findById>>;
        conversation: Awaited<ReturnType<typeof AIConversationRepository.findById>>;
    }>;
}
//# sourceMappingURL=generationService.d.ts.map