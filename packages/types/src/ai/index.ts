export interface GenerationRequest {
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface GenerationResult {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
  }
}
