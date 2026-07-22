import React from 'react'

interface Artifact {
  icon: string
  title: string
  description: string
}

const ARTIFACTS: Artifact[] = [
  { icon: '💡', title: 'Master Context', description: 'Define your product vision, audience, platform, and constraints in one source of truth.' },
  { icon: '📋', title: 'PRD', description: 'Product Requirements Document covering functional and non-functional requirements.' },
  { icon: '📐', title: 'SRS', description: 'Software Requirements Specification with architecture, API design, and data models.' },
  { icon: '🏗️', title: 'Architecture', description: 'System architecture with component diagrams, tech stack, and deployment plan.' },
  { icon: '🗄️', title: 'Database Schema', description: 'Complete database design with entities, relationships, indexes, and migrations.' },
  { icon: '🔌', title: 'API Specification', description: 'REST API design with endpoints, request/response schemas, and authentication.' },
  { icon: '🔄', title: 'User Flows', description: 'Visual user journey maps covering registration, pipeline execution, and exports.' },
  { icon: '🎨', title: 'Wireframes', description: 'UI wireframes for landing page, dashboard, editor, and settings screens.' },
  { icon: '🗺️', title: 'Feature Roadmap', description: 'Prioritized feature timeline with MVP, growth, and enterprise phases.' },
]

export function ArtifactGrid() {
  return (
    <section style={styles.section} id="features">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>What You Get</h2>
          <p style={styles.subtitle}>
            Nine engineering artifacts — every document you need to go from idea to production.
          </p>
        </div>
        <div style={styles.grid}>
          {ARTIFACTS.map((artifact, i) => (
            <div key={i} style={styles.card}>
              <span style={styles.icon}>{artifact.icon}</span>
              <h3 style={styles.title}>{artifact.title}</h3>
              <p style={styles.description}>{artifact.description}</p>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '28px',
    borderRadius: '14px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #F1F5F9',
    transition: 'box-shadow 0.15s, transform 0.15s',
    cursor: 'default',
  },
  icon: {
    fontSize: '1.75rem',
    display: 'block',
    marginBottom: '12px',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 6px 0',
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: '#64748B',
    margin: 0,
  },
}
