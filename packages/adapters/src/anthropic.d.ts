import { BaseAdapter } from './base';
import type { GenerateOptions, GenerationResult, HealthCheckResult } from './types';
export declare class AnthropicAdapter extends BaseAdapter {
    readonly model: string;
    private readonly apiKey;
    private readonly baseUrl;
    readonly provider = "anthropic";
    readonly maxContextTokens: number;
    constructor(model: string, apiKey: string, baseUrl?: string);
    generate(prompt: string, options: GenerateOptions): Promise<GenerationResult>;
    generateStream(prompt: string, options: GenerateOptions): AsyncIterable<string>;
    healthCheck(): Promise<HealthCheckResult>;
}
//# sourceMappingURL=anthropic.d.ts.map