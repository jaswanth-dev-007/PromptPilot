export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 700, color: '#E2E8F0', lineHeight: 1, marginBottom: '16px' }}>
        404
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '1rem', color: '#6B7280', margin: '0 0 24px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '10px 24px',
          borderRadius: '10px',
          backgroundColor: '#4F46E5',
          color: '#FFFFFF',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Go Home
      </a>
    </main>
  )
}
