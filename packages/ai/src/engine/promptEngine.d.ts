import type { PromptPilotConfig } from '@promptpilot/config'
export interface PromptTemplate {
  id: string
  title: string
  category: string
  systemPrompt: string
  userPromptTemplate: string
  variables: string[]
  tags: string[]
  version: number
}
export interface PromptContext {
  masterContext?: string
  upstreamArtifacts: Map<string, string>
  projectDescription?: string
  technologyStack?: string[]
  constraints?: string[]
  userInput?: string
}
export interface CompiledPrompt {
  systemPrompt: string
  userPrompt: string
  estimatedTokens: number
  contextWindow: number
  withinLimits: boolean
}
export declare class PromptEngine {
  private config
  constructor(config: PromptPilotConfig)
  compile(template: PromptTemplate, context: PromptContext, contextWindow: number): CompiledPrompt
  private resolveVariables
  private formatUpstreamArtifacts
  validateTemplate(template: PromptTemplate): {
    valid: boolean
    errors: string[]
  }
  estimateTokens(text: string): number
}
//# sourceMappingURL=promptEngine.d.ts.map
