export default function ProjectExports({ params }: { params: { slug: string } }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
        📦 Exports
      </h1>
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          backgroundColor: '#FFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
          No exports yet
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '6px' }}>
          Generate documents first, then export them as PDF, Markdown, or DOCX.
        </div>
      </div>
    </div>
  )
}
