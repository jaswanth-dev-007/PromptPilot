export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FindAllOptions {
  where?: Record<string, unknown>
  orderBy?: Record<string, 'asc' | 'desc'>
  include?: Record<string, boolean>
  select?: Record<string, boolean>
}

export function paginateParams(params: PaginationParams): { skip: number; take: number } {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 20))
  const skip = (page - 1) * limit
  return { skip, take: limit }
}

export function paginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 20))
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
