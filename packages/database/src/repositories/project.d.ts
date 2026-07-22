export declare const ProjectRepository: {
  findById(id: string): any
  findByWorkspaceAndSlug(workspaceId: string, slug: string): any
  create(data: {
    id?: string
    name: string
    slug: string
    description?: string
    workspace: {
      connect: {
        id: string
      }
    }
    owner: {
      connect: {
        id: string
      }
    }
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  }): Promise<any>
  update(
    id: string,
    data: {
      name?: string
      slug?: string
      description?: string | null
      status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
      settings?: Record<string, unknown>
    },
  ): Promise<any>
  softDelete(id: string): Promise<any>
  listByWorkspace(
    workspaceId: string,
    params: {
      skip: number
      take: number
    },
  ): Promise<{
    data: any
    total: any
  }>
}
//# sourceMappingURL=project.d.ts.map
