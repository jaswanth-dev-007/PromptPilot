export class PromptPilotError extends Error {
  public readonly httpStatus: number

  constructor(
    message: string,
    public readonly code: string,
    httpStatus: number = 500,
    public readonly suggestion?: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.httpStatus = httpStatus
    this.name = 'PromptPilotError'
  }

  toUserMessage(): string {
    let msg = `[${this.code}] ${this.message}`
    if (this.suggestion) {
      msg += `\n  Suggestion: ${this.suggestion}`
    }
    if (this.cause instanceof Error) {
      msg += `\n  Cause: ${this.cause.message}`
    }
    return msg
  }

  toHttpStatus(): number {
    return this.httpStatus
  }

  toApiResponse() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.suggestion ? { details: this.suggestion } : {}),
      },
    }
  }
}

export class ConfigError extends PromptPilotError {
  constructor(message: string, suggestion?: string, cause?: unknown) {
    super(message, 'CONFIG_ERROR', 500, suggestion, cause)
    this.name = 'ConfigError'
  }
}

export class ValidationError extends PromptPilotError {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly line?: number,
    suggestion?: string,
  ) {
    super(message, 'VALIDATION_ERROR', 400, suggestion)
    this.name = 'ValidationError'
  }
}

export class AdapterError extends PromptPilotError {
  constructor(
    message: string,
    public readonly provider: string,
    httpStatus?: number,
    suggestion?: string,
    cause?: unknown,
  ) {
    super(message, 'ADAPTER_ERROR', httpStatus || 502, suggestion, cause)
    this.name = 'AdapterError'
  }
}

export class PipelineError extends PromptPilotError {
  constructor(
    message: string,
    public readonly stepId: string,
    suggestion?: string,
  ) {
    super(message, 'PIPELINE_ERROR', 500, suggestion)
    this.name = 'PipelineError'
  }
}

export class FileSystemError extends PromptPilotError {
  constructor(
    message: string,
    public readonly filePath: string,
    suggestion?: string,
    cause?: unknown,
  ) {
    super(message, 'FS_ERROR', 500, suggestion, cause)
    this.name = 'FileSystemError'
  }
}

export class AuthError extends PromptPilotError {
  constructor(message: string, suggestion?: string, cause?: unknown) {
    super(message, 'AUTH_ERROR', 401, suggestion, cause)
    this.name = 'AuthError'
  }
}

export class NotFoundError extends PromptPilotError {
  constructor(message: string, suggestion?: string) {
    super(message, 'NOT_FOUND', 404, suggestion)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends PromptPilotError {
  constructor(message: string, suggestion?: string) {
    super(message, 'CONFLICT', 409, suggestion)
    this.name = 'ConflictError'
  }
}

export class ForbiddenError extends PromptPilotError {
  constructor(message: string, suggestion?: string) {
    super(message, 'FORBIDDEN', 403, suggestion)
    this.name = 'ForbiddenError'
  }
}

export class DatabaseError extends PromptPilotError {
  constructor(message: string, suggestion?: string, cause?: unknown) {
    super(message, 'DATABASE_ERROR', 500, suggestion, cause)
    this.name = 'DatabaseError'
  }
}

export class InternalError extends PromptPilotError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      'INTERNAL_ERROR',
      500,
      'An unexpected error occurred. Please try again later.',
      cause,
    )
    this.name = 'InternalError'
  }
}

export function errorToHttpStatus(err: Error): number {
  if (err instanceof PromptPilotError) {
    return err.toHttpStatus()
  }
  return 500
}
