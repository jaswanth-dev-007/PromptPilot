import { BaseAdapter } from './base';
import type { GenerateOptions, GenerationResult, HealthCheckResult } from './types';
export declare class OpenAIAdapter extends BaseAdapter {
    readonly model: string;
    private readonly apiKey;
    private readonly baseUrl;
    readonly provider = "openai";
    readonly maxContextTokens: number;
    constructor(model: string, apiKey: string, baseUrl?: string);
    generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>;
    generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>;
    healthCheck(): Promise<HealthCheckResult>;
}
//# sourceMappingURL=openai.d.ts.map