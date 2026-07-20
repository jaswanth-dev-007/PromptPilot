import { describe, it, expect } from 'vitest'
import {
  PromptPilotError,
  ConfigError,
  ValidationError,
  AdapterError,
  PipelineError,
  FileSystemError,
} from '../src/errors'

describe('PromptPilotError', () => {
  it('creates an error with code', () => {
    const err = new PromptPilotError('something broke', 'TEST_ERR')
    expect(err.message).toBe('something broke')
    expect(err.code).toBe('TEST_ERR')
    expect(err).toBeInstanceOf(Error)
  })

  it('formats user message with suggestion', () => {
    const err = new PromptPilotError('config invalid', 'CFG_ERR', 'Run promptpilot config init')
    expect(err.toUserMessage()).toContain('[ERROR]')
    expect(err.toUserMessage()).toContain('Run promptpilot config init')
  })

  it('formats user message with cause', () => {
    const cause = new Error('underlying')
    const err = new PromptPilotError('failed', 'ERR', undefined, cause)
    expect(err.toUserMessage()).toContain('underlying')
  })
})

describe('ConfigError', () => {
  it('has correct code', () => {
    const err = new ConfigError('bad config')
    expect(err.code).toBe('CONFIG_ERROR')
    expect(err).toBeInstanceOf(PromptPilotError)
  })
})

describe('ValidationError', () => {
  it('includes file path', () => {
    const err = new ValidationError('invalid', '/path/to/file.md', 42)
    expect(err.filePath).toBe('/path/to/file.md')
    expect(err.line).toBe(42)
  })
})

describe('AdapterError', () => {
  it('includes provider and status code', () => {
    const err = new AdapterError('api error', 'openai', 429)
    expect(err.provider).toBe('openai')
    expect(err.statusCode).toBe(429)
  })
})

describe('PipelineError', () => {
  it('includes step id', () => {
    const err = new PipelineError('step failed', 'srs')
    expect(err.stepId).toBe('srs')
  })
})

describe('FileSystemError', () => {
  it('includes file path', () => {
    const err = new FileSystemError('not found', '/tmp/test.md')
    expect(err.filePath).toBe('/tmp/test.md')
    expect(err.code).toBe('FS_ERROR')
  })
})
