export declare const DocumentVersionRepository: {
    findById(id: string): any;
    create(data: {
        documentId: string;
        versionNumber: number;
        content: string;
        modelUsed?: string;
        tokensUsed?: number;
    }): Promise<any>;
    listByDocument(documentId: string): Promise<any>;
    getLatest(documentId: string): Promise<any>;
};
//# sourceMappingURL=documentVersion.d.ts.map