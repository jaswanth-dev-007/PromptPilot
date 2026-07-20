import type { ValidationIssue } from './types'

export function validateMarkdown(filePath: string, content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const codeBlockStarts = (content.match(/```/g) || []).length
  if (codeBlockStarts % 2 !== 0) {
    issues.push({
      type: 'error',
      filePath,
      message: 'Unclosed code block detected',
      rule: 'markdown-code-block',
    })
  }

  const tableRows = content.match(/^\|.+\|$/gm) || []
  if (tableRows.length > 0 && tableRows.length < 2) {
    issues.push({
      type: 'error',
      filePath,
      message: 'Incomplete table — requires header and separator rows',
      rule: 'markdown-table',
    })
  }

  const brokenLinks = content.match(/\[([^\]]+)\]\(\s*\)/g)
  if (brokenLinks) {
    issues.push({
      type: 'warning',
      filePath,
      message: `Found ${brokenLinks.length} link(s) with empty URLs`,
      rule: 'markdown-empty-link',
    })
  }

  return issues
}
