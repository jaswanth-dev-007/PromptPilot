export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface FindAllOptions {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: Record<string, boolean>;
    select?: Record<string, boolean>;
}
export declare function paginateParams(params: PaginationParams): {
    skip: number;
    take: number;
};
export declare function paginatedResult<T>(data: T[], total: number, params: PaginationParams): PaginatedResult<T>;
//# sourceMappingURL=pagination.d.ts.map