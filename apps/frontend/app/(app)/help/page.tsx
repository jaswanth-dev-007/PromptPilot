export default function HelpPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>❓ Help & Documentation</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {[
          { icon: '📚', title: 'Documentation', desc: 'Full platform documentation' },
          { icon: '🎥', title: 'Video Tutorials', desc: 'Watch step-by-step guides' },
          { icon: '🚀', title: 'Getting Started', desc: 'Your first project in 5 minutes' },
          { icon: '💬', title: 'Community', desc: 'Join discussions and share tips' },
          { icon: '🐛', title: 'Report a Bug', desc: 'Found an issue? Let us know' },
          { icon: '💡', title: 'Feature Requests', desc: 'Suggest improvements' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0',
            backgroundColor: '#FFF', cursor: 'default',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>{item.title}</div>
            <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '4px' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
