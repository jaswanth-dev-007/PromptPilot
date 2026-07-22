type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export declare const ExportRepository: {
    findById(id: string): any;
    create(data: {
        project: {
            connect: {
                id: string;
            };
        };
        format: "PDF" | "MARKDOWN" | "HTML" | "DOCX";
        status?: ExportStatus;
        documentIds: unknown;
        expiresAt: Date;
    }): Promise<any>;
    updateStatus(id: string, status: ExportStatus, fileUrl?: string): Promise<any>;
    listByProject(projectId: string): Promise<any>;
};
export {};
//# sourceMappingURL=export.d.ts.map