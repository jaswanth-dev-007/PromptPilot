type DocumentStatus = 'DRAFT' | 'GENERATED' | 'REVIEWED' | 'STALE'
type DocumentType =
  | 'MASTER_CONTEXT'
  | 'PRD'
  | 'SRS'
  | 'ARCHITECTURE'
  | 'DATABASE'
  | 'API_SPEC'
  | 'USER_FLOWS'
  | 'WIREFRAMES'
  | 'ROADMAP'
export declare const DocumentRepository: {
  findById(id: string): any
  findByProjectAndStep(projectId: string, stepId: string): any
  create(data: {
    id?: string
    project: {
      connect: {
        id: string
      }
    }
    stepId: string
    title: string
    type: DocumentType
    content: string
    status?: DocumentStatus
    version?: number
    conversation: {
      create: {
        project: {
          connect: {
            id: string
          }
        }
        stepId: string
        model: string
        status?: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
        startedAt?: Date
        completedAt?: Date
      }
    }
  }): Promise<any>
  update(
    id: string,
    data: {
      title?: string
      status?: DocumentStatus
      stale?: boolean
      staleReason?: string | null
    },
  ): Promise<any>
  updateContent(id: string, content: string, version: number): Promise<any>
  markStale(id: string, reason: string): Promise<any>
  updateStatus(id: string, status: DocumentStatus): Promise<any>
  softDelete(id: string): Promise<any>
  listByProject(projectId: string): Promise<any>
  listStale(projectId: string): Promise<any>
}
export {}
//# sourceMappingURL=document.d.ts.map
