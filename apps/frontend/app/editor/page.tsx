import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editor — PromptPilot',
  description: 'Collaborative specification editor. Write and refine your product requirements.',
}

export default function EditorPage() {
  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>Editor</h1>
      <p style={styles.subtitle}>Specification editor coming soon.</p>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: '40px 24px',
    maxWidth: '960px',
    margin: '0 auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  heading: { fontSize: '2rem', fontWeight: 700, color: '#111827' },
  subtitle: { marginTop: '8px', fontSize: '1rem', color: '#6b7280' },
}
