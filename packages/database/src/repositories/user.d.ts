export declare const UserRepository: {
    findById(id: string): any;
    findByEmail(email: string): any;
    create(data: {
        email: string;
        passwordHash: string;
        name: string;
        role?: "ADMIN" | "MEMBER";
        id?: string;
    }): Promise<any>;
    update(id: string, data: {
        name?: string;
        avatarUrl?: string | null;
        isActive?: boolean;
    }): Promise<any>;
    softDelete(id: string): Promise<any>;
    list(params: {
        skip: number;
        take: number;
    }): Promise<{
        data: any;
        total: any;
    }>;
    updateRefreshToken(id: string, refreshTokenHash: string | null): Promise<any>;
    updateLastLogin(id: string): Promise<any>;
};
//# sourceMappingURL=user.d.ts.map