export declare const WorkspaceMemberRepository: {
    findById(id: string): any;
    findByWorkspaceAndUser(workspaceId: string, userId: string): any;
    create(data: {
        workspaceId: string;
        userId: string;
        role: "ADMIN" | "EDITOR" | "VIEWER";
    }): Promise<any>;
    updateRole(id: string, role: "ADMIN" | "EDITOR" | "VIEWER"): Promise<any>;
    remove(id: string): Promise<any>;
    listByWorkspace(workspaceId: string): Promise<any>;
    listByUser(userId: string): Promise<any>;
};
//# sourceMappingURL=workspaceMember.d.ts.map