export class PromptPilotError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestion?: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'PromptPilotError'
  }

  toUserMessage(): string {
    let msg = `[ERROR] ${this.message}`
    if (this.suggestion) {
      msg += `\n  Suggestion: ${this.suggestion}`
    }
    if (this.cause instanceof Error) {
      msg += `\n  Cause: ${this.cause.message}`
    }
    return msg
  }
}

export class ConfigError extends PromptPilotError {
  constructor(message: string, suggestion?: string, cause?: unknown) {
    super(message, 'CONFIG_ERROR', suggestion, cause)
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
    super(message, 'VALIDATION_ERROR', suggestion)
    this.name = 'ValidationError'
  }
}

export class AdapterError extends PromptPilotError {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    suggestion?: string,
    cause?: unknown,
  ) {
    super(message, 'ADAPTER_ERROR', suggestion, cause)
    this.name = 'AdapterError'
  }
}

export class PipelineError extends PromptPilotError {
  constructor(
    message: string,
    public readonly stepId: string,
    suggestion?: string,
  ) {
    super(message, 'PIPELINE_ERROR', suggestion)
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
    super(message, 'FS_ERROR', suggestion, cause)
    this.name = 'FileSystemError'
  }
}
