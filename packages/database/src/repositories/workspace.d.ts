export declare const WorkspaceRepository: {
    findById(id: string): any;
    findByOwnerAndSlug(ownerId: string, slug: string): any;
    create(data: {
        id?: string;
        name: string;
        slug: string;
        owner: {
            connect: {
                id: string;
            };
        };
        type?: "PERSONAL" | "TEAM";
        settings?: Record<string, unknown>;
    }): Promise<any>;
    update(id: string, data: {
        name?: string;
        slug?: string;
        settings?: Record<string, unknown>;
    }): Promise<any>;
    softDelete(id: string): Promise<any>;
    listByOwner(ownerId: string, params: {
        skip: number;
        take: number;
    }): Promise<{
        data: any;
        total: any;
    }>;
    listByMember(userId: string, params: {
        skip: number;
        take: number;
    }): Promise<{
        data: any;
        total: any;
    }>;
};
//# sourceMappingURL=workspace.d.ts.map