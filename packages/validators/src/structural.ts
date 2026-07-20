import type { ValidationIssue, ValidationReport } from './types'

export function validateStructure(
  filePath: string,
  content: string,
  requiredSections: string[],
): ValidationReport {
  const issues: ValidationIssue[] = []

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      issues.push({
        type: 'error',
        filePath,
        message: `Missing required section: "${section}"`,
        rule: 'required-section',
      })
    }
  }

  issues.push(...validateHeadingHierarchy(filePath, content))
  issues.push(...validateNoPlaceholders(filePath, content))

  const errors = issues.filter(i => i.type === 'error').length
  const warnings = issues.filter(i => i.type === 'warning').length
  const score = Math.max(0, 100 - errors * 20 - warnings * 5)
  const passed = errors === 0

  return { issues, score, passed }
}

function validateHeadingHierarchy(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const headers = content.matchAll(/^(#{1,6})\s+(.+)$/gm)
  let prevLevel = 0

  for (const match of headers) {
    const level = match[1].length
    if (level > prevLevel + 1 && prevLevel > 0) {
      issues.push({
        type: 'warning',
        filePath,
        message: `Heading "${match[2]}" jumps from H${prevLevel} to H${level}`,
        rule: 'heading-hierarchy',
      })
    }
    prevLevel = level
  }
  return issues
}

function validateNoPlaceholders(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const patterns: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /\bTODO\b/g, label: 'TODO' },
    { pattern: /\bTBD\b/g, label: 'TBD' },
    { pattern: /Lorem ipsum/gi, label: 'Lorem ipsum' },
  ]

  for (const { pattern, label } of patterns) {
    const matches = content.match(pattern)
    if (matches) {
      issues.push({
        type: 'warning',
        filePath,
        message: `Found ${matches.length} instance(s) of "${label}"`,
        rule: 'no-placeholders',
      })
    }
  }
  return issues
}
