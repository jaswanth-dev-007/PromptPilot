export declare const GenerationRepository: {
    findById(id: string): any;
    create(data: {
        conversation: {
            connect: {
                id: string;
            };
        };
        model: string;
        provider: "OPENAI" | "ANTHROPIC" | "GOOGLE" | "OLLAMA";
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        cost: number;
        durationMs: number;
        status: "SUCCESS" | "FAILED" | "RETRIED";
        errorMessage?: string;
    }): Promise<any>;
    listByConversation(conversationId: string): Promise<any>;
    aggregateByProject(projectId: string): Promise<{
        totalGenerations: any;
        totalTokens: any;
        totalCost: any;
    }>;
};
//# sourceMappingURL=generation.d.ts.map