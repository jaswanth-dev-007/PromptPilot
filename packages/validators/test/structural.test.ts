import { describe, it, expect } from 'vitest'
import { validateStructure } from '../src/structural'

describe('validateStructure', () => {
  it('reports missing sections', () => {
    const report = validateStructure('test.md', '# Title\n\ncontent', ['Summary', 'Overview'])
    expect(report.passed).toBe(false)
    expect(report.issues.some(i => i.rule === 'required-section')).toBe(true)
  })

  it('passes when all sections present', () => {
    const content = '# Title\n\n## Summary\nsummary\n\n## Overview\noverview'
    const report = validateStructure('test.md', content, ['Summary', 'Overview'])
    expect(report.passed).toBe(true)
  })

  it('detects heading hierarchy violations', () => {
    const content = '# H1\n\n### H3\n\ncontent'
    const report = validateStructure('test.md', content, [])
    expect(report.issues.some(i => i.rule === 'heading-hierarchy')).toBe(true)
  })

  it('detects placeholder text', () => {
    const content = '# Title\n\nTODO: fix this\n\nMore text'
    const report = validateStructure('test.md', content, ['Title'])
    expect(report.issues.some(i => i.rule === 'no-placeholders')).toBe(true)
  })
})
