export declare const APIKeyRepository: {
  findById(id: string): any
  findByHash(keyHash: string): any
  create(data: {
    workspace: {
      connect: {
        id: string
      }
    }
    name: string
    keyHash: string
    prefix: string
  }): Promise<any>
  revoke(id: string): Promise<any>
  updateLastUsed(id: string): Promise<any>
  listByWorkspace(workspaceId: string): Promise<any>
}
//# sourceMappingURL=apiKey.d.ts.map
