import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features — PromptPilot',
  description:
    'Explore PromptPilot features: AI-powered PRD, SRS, architecture, database schema, API spec, user flows, wireframes, and roadmap generation.',
}

export default function FeaturesPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '100px 24px',
        backgroundColor: '#FFFFFF',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#111827' }}>
          Features
        </h1>
        <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: '#4B5563', marginTop: '16px' }}>
          PromptPilot&apos;s 9-step AI pipeline generates every document you need to go from concept
          to production-ready specification. See the{' '}
          <a href="/" style={{ color: '#4F46E5' }}>
            homepage
          </a>{' '}
          for an interactive walkthrough.
        </p>
      </div>
    </main>
  )
}
