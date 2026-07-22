type MessageRole = 'SYSTEM' | 'USER' | 'ASSISTANT'
export declare const MessageRepository: {
  create(data: {
    conversationId: string
    role: MessageRole
    content: string
    sequence: number
    tokens?: number
  }): Promise<any>
  createMany(
    messages: Array<{
      conversationId: string
      role: MessageRole
      content: string
      sequence: number
      tokens?: number
    }>,
  ): Promise<any>
  listByConversation(conversationId: string): Promise<any>
  getLastSequence(conversationId: string): Promise<number>
}
export {}
//# sourceMappingURL=message.d.ts.map
