export default function ActivityPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>🔔 Activity</h1>
      <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>No activity yet</div>
        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '6px' }}>Your project and workspace activity will appear here.</div>
      </div>
    </div>
  )
}
