export interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  filePath: string
  line?: number
  message: string
  rule: string
}

export interface ValidationReport {
  issues: ValidationIssue[]
  score: number
  passed: boolean
}
