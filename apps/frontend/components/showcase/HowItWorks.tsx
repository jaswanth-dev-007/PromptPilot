import React from 'react'

interface Step {
  number: string
  title: string
  description: string
  icon: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Define Your Vision',
    description:
      "Start with a simple description of your product. PromptPilot's Master Context captures your vision, target audience, platform, and constraints — everything the AI needs to create consistent, high-quality specifications.",
    icon: '💡',
  },
  {
    number: '02',
    title: 'AI Generates Everything',
    description:
      'Our 9-step pipeline orchestrates state-of-the-art AI models (GPT-4o, Claude 3.5 Sonnet) to generate PRDs, SRS documents, system architecture, database schemas, API specs, user flows, wireframes, and roadmaps — all consistent with each other.',
    icon: '🤖',
  },
  {
    number: '03',
    title: 'Export & Ship',
    description:
      'Export your complete specification suite as PDF, Markdown, or DOCX. Share with your team, attach to your pitch deck, or use it as the foundation for your development sprint. From idea to engineering-ready in minutes.',
    icon: '🚀',
  },
]

export function HowItWorks() {
  return (
    <section style={styles.section} id="how-it-works">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>How It Works</h2>
          <p style={styles.subtitle}>
            Three steps from idea to engineering-ready specification suite.
          </p>
        </div>
        <div style={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.number}>{step.number}</div>
              <div style={styles.icon}>{step.icon}</div>
              <h3 style={styles.title}>{step.title}</h3>
              <p style={styles.description}>{step.description}</p>
            </div>
          ))}
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
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '56px',
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
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '32px 24px',
    borderRadius: '16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #F1F5F9',
  },
  number: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    padding: '2px 10px',
    borderRadius: '20px',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.7,
    color: '#6B7280',
    margin: 0,
  },
}
