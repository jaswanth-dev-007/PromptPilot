import { countTokens } from '@promptpilot/shared'
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

export class PromptEngine {
  private config: PromptPilotConfig

  constructor(config: PromptPilotConfig) {
    this.config = config
  }

  compile(template: PromptTemplate, context: PromptContext, contextWindow: number): CompiledPrompt {
    const userPrompt = this.resolveVariables(template.userPromptTemplate, context)
    const upstreamContent = this.formatUpstreamArtifacts(context.upstreamArtifacts)

    let fullUserPrompt = `${template.systemPrompt}\n\n---\n\n## Context\n\n`

    if (context.masterContext) {
      fullUserPrompt += `### Master Context\n${context.masterContext}\n\n`
    }
    if (context.projectDescription) {
      fullUserPrompt += `### Project Description\n${context.projectDescription}\n\n`
    }
    if (context.technologyStack?.length) {
      fullUserPrompt += `### Technology Stack\n${context.technologyStack.join(', ')}\n\n`
    }
    if (context.constraints?.length) {
      fullUserPrompt += `### Constraints\n${context.constraints.map(c => `- ${c}`).join('\n')}\n\n`
    }
    if (upstreamContent) {
      fullUserPrompt += `### Upstream Artifacts\n${upstreamContent}\n\n`
    }
    fullUserPrompt += `---\n\n## Instructions\n\n${userPrompt}`

    const tokens = countTokens(fullUserPrompt)
    const withinLimits = tokens <= contextWindow * 0.9

    return {
      systemPrompt: template.systemPrompt,
      userPrompt: fullUserPrompt,
      estimatedTokens: tokens,
      contextWindow,
      withinLimits,
    }
  }

  private resolveVariables(template: string, context: PromptContext): string {
    return template
      .replace(/\{MASTER_CONTEXT\}/g, context.masterContext || '')
      .replace(/\{PROJECT_DESCRIPTION\}/g, context.projectDescription || '')
      .replace(/\{TECH_STACK\}/g, context.technologyStack?.join(', ') || '')
      .replace(/\{CONSTRAINTS\}/g, context.constraints?.join(', ') || '')
      .replace(/\{USER_INPUT\}/g, context.userInput || '')
  }

  private formatUpstreamArtifacts(artifacts: Map<string, string>): string {
    if (!artifacts.size) return ''
    let result = ''
    for (const [stepId, content] of artifacts) {
      const truncated = content.length > 8000 ? content.slice(0, 8000) + '\n\n... (truncated)' : content
      result += `\n#### ${stepId}\n${truncated}\n`
    }
    return result
  }

  validateTemplate(template: PromptTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    if (!template.systemPrompt) errors.push('System prompt is required')
    if (!template.userPromptTemplate) errors.push('User prompt template is required')
    if (!template.id) errors.push('Template ID is required')
    if (!template.title) errors.push('Template title is required')

    const declaredVars = template.variables || []
    const usedVars = template.userPromptTemplate.match(/\{(\w+)\}/g)?.map(v => v.slice(1, -1)) || []
    const missing = usedVars.filter(v => !declaredVars.includes(v))
    const unused = declaredVars.filter(v => !usedVars.includes(v))

    if (missing.length) errors.push(`Missing variable declarations: ${missing.join(', ')}`)
    if (unused.length) errors.push(`Unused variable declarations: ${unused.join(', ')}`)

    return { valid: errors.length === 0, errors }
  }

  estimateTokens(text: string): number {
    return countTokens(text)
  }
}
