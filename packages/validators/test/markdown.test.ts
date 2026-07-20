import { describe, it, expect } from 'vitest'
import { validateMarkdown } from '../src/markdown'

describe('validateMarkdown', () => {
  it('detects unclosed code blocks', () => {
    const report = validateMarkdown('test.md', '```\ncode')
    expect(report.some(i => i.rule === 'markdown-code-block')).toBe(true)
  })

  it('passes valid markdown', () => {
    const report = validateMarkdown(
      'test.md',
      '# Hello\n\n```\ncode\n```\n\n| a | b |\n|---|---|\n| 1 | 2 |',
    )
    expect(report).toHaveLength(0)
  })

  it('detects incomplete tables', () => {
    const report = validateMarkdown('test.md', '| a | b |\n# next section')
    expect(report.some(i => i.rule === 'markdown-table')).toBe(true)
  })
})
