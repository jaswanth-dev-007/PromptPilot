import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — PromptPilot',
  description:
    'PromptPilot is an AI-powered software planning platform built by engineers, for engineers.',
}

export default function AboutPage() {
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.heading}>About PromptPilot</h1>
        <p style={styles.paragraph}>
          PromptPilot was built to solve a problem every engineer faces: the gap between having an
          idea and having a complete, professional software specification.
        </p>
        <p style={styles.paragraph}>
          Traditional approaches — writing specs by hand, pasting prompts into ChatGPT, or using
          generic documentation tools — produce inconsistent, incomplete results. PromptPilot&apos;s
          9-step AI pipeline ensures every generated document is internally consistent,
          professionally structured, and ready for production.
        </p>
        <p style={styles.paragraph}>
          We believe great software starts with great specifications. PromptPilot makes that step
          effortless.
        </p>

        <h2 style={styles.subheading}>Our Mission</h2>
        <p style={styles.paragraph}>
          Democratize software planning. Give every developer, founder, and team the ability to
          produce enterprise-grade engineering artifacts — regardless of budget, experience, or team
          size.
        </p>

        <h2 style={styles.subheading}>Contact</h2>
        <p style={styles.paragraph}>
          Questions? Feedback? Reach us at{' '}
          <a href="mailto:hello@promptpilot.dev" style={styles.link}>
            hello@promptpilot.dev
          </a>
        </p>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    padding: '100px 24px 60px',
    backgroundColor: '#FFFFFF',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  heading: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.02em',
    marginBottom: '32px',
  },
  subheading: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#111827',
    margin: '40px 0 16px',
  },
  paragraph: {
    fontSize: '1.0625rem',
    lineHeight: 1.8,
    color: '#4B5563',
    marginBottom: '16px',
  },
  link: {
    color: '#4F46E5',
    textDecoration: 'none',
    fontWeight: 500,
  },
}
