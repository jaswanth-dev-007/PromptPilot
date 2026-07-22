export declare const NotificationRepository: {
  findById(id: string): any
  create(data: {
    user: {
      connect: {
        id: string
      }
    }
    type:
      | 'PIPELINE_COMPLETED'
      | 'GENERATION_FAILED'
      | 'MEMBER_INVITED'
      | 'DOCUMENT_REVIEWED'
      | 'EXPORT_COMPLETED'
    title: string
    body: string
    projectId?: string
  }): Promise<any>
  markRead(id: string): Promise<any>
  markAllRead(userId: string): Promise<any>
  listByUser(
    userId: string,
    params: {
      skip: number
      take: number
    },
  ): Promise<{
    data: any
    total: any
  }>
  countUnread(userId: string): Promise<any>
}
//# sourceMappingURL=notification.d.ts.map
