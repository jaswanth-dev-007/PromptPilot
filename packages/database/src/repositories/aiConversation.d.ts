type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export declare const AIConversationRepository: {
  findById(id: string): any
  create(data: {
    project: {
      connect: {
        id: string
      }
    }
    stepId: string
    model: string
    temperature?: number
    maxTokens?: number
    status?: ConversationStatus
    startedAt?: Date
    completedAt?: Date
    totalInputTokens?: number
    totalOutputTokens?: number
    totalCost?: number
  }): Promise<any>
  update(
    id: string,
    data: {
      status?: ConversationStatus
      model?: string
      temperature?: number
      maxTokens?: number
    },
  ): Promise<any>
  updateStatus(id: string, status: ConversationStatus): Promise<any>
  updateTokenTotals(
    id: string,
    inputTokens: number,
    outputTokens: number,
    cost: number,
  ): Promise<any>
  softDelete(id: string): Promise<any>
  listByProject(projectId: string): Promise<any>
  findByProjectAndStep(projectId: string, stepId: string): Promise<any>
}
export {}
//# sourceMappingURL=aiConversation.d.ts.map
