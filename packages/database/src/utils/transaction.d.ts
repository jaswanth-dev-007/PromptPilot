import { prisma } from '../client';
import type { Prisma } from '@prisma/client';
export declare function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
export declare function getClient(): Prisma.TransactionClient | typeof prisma;
//# sourceMappingURL=transaction.d.ts.map