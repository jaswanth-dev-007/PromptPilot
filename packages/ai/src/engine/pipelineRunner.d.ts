import type { PromptPilotConfig } from '@promptpilot/config';
import type { PipelineManifest, PipelineResult } from '@promptpilot/core';
import type { PromptContext } from './promptEngine';
export declare class PipelineRunner {
    private generationService;
    constructor(config: PromptPilotConfig);
    run(projectId: string, manifest: PipelineManifest, context: PromptContext, options?: {
        parallel?: boolean;
        force?: boolean;
        signal?: AbortSignal;
    }): Promise<PipelineResult>;
    private orderSteps;
    private buildStepContext;
}
//# sourceMappingURL=pipelineRunner.d.ts.map