import React from 'react'

const ROWS = [
  { feature: 'Consistent document generation', manual: '❌', chatgpt: '❌', promptpilot: '✅' },
  { feature: 'Dependency-aware pipeline', manual: '❌', chatgpt: '❌', promptpilot: '✅' },
  { feature: '10 document types', manual: '⚠️', chatgpt: '⚠️', promptpilot: '✅' },
  { feature: 'Version history', manual: '❌', chatgpt: '❌', promptpilot: '✅' },
  { feature: 'Export to PDF/DOCX/MD', manual: '⚠️', chatgpt: '❌', promptpilot: '✅' },
  { feature: 'Team collaboration', manual: '❌', chatgpt: '❌', promptpilot: '✅' },
  { feature: 'AI model selection', manual: 'N/A', chatgpt: '⚠️', promptpilot: '✅' },
]

export function ComparisonTable() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Why PromptPilot?</h2>
          <p style={styles.subtitle}>Purpose-built for generating engineering specifications. Not a generic chatbot.</p>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Feature</th>
                <th style={styles.th}>Manual</th>
                <th style={styles.th}>ChatGPT</th>
                <th style={styles.thHighlight}>PromptPilot</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>{row.feature}</td>
                  <td style={styles.td}>{row.manual}</td>
                  <td style={styles.td}>{row.chatgpt}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{row.promptpilot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 24px',
    backgroundColor: '#FFFFFF',
    fontFamily: 'inherit',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6B7280',
    marginTop: '12px',
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#64748B',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  thHighlight: {
    padding: '14px 20px',
    textAlign: 'left',
    fontWeight: 700,
    color: '#4F46E5',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#EEF2FF',
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
  },
  td: {
    padding: '14px 20px',
    color: '#374151',
  },
}
