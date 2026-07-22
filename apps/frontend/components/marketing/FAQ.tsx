'use client'

import React, { useState } from 'react'

const ITEMS = [
  {
    q: 'What exactly does PromptPilot generate?',
    a: 'PromptPilot generates a complete suite of software engineering documents: PRD, SRS, system architecture, database schema, API specification, user flows, wireframes, feature roadmap, and implementation plan. Every document is internally consistent — changes to one propagate to all dependent documents.',
  },
  {
    q: 'Which AI models does PromptPilot use?',
    a: 'We support OpenAI (GPT-4o, GPT-4.1), Anthropic (Claude 3.5 Sonnet, Claude Opus 4), Google (Gemini 2.0), and local models via Ollama. You can switch models per project or per pipeline step.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your project data is encrypted at rest and in transit. We use bcrypt for passwords and JWT tokens for authentication. We never use your data to train AI models. PromptPilot is designed for enterprise use with SOC 2 Type II compliance on our roadmap.',
  },
  {
    q: 'Can I export the generated documents?',
    a: 'Yes. Export your complete specification suite as PDF, Markdown, or DOCX. Each document maintains its formatting, headings, and structure.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes. The Free plan gives you 3 projects with full access to the 9-step pipeline. No credit card required. Upgrade to Pro for unlimited projects and advanced features.',
  },
  {
    q: 'Can my team collaborate on the same project?',
    a: 'Yes, on the Team plan. Shared workspaces let your team create, review, and export documents together. Admin controls manage member access and permissions.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section style={styles.section} id="faq">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Frequently Asked Questions</h2>
          <p style={styles.subtitle}>Everything you need to know about PromptPilot.</p>
        </div>
        <div style={styles.list}>
          {ITEMS.map((item, i) => (
            <div key={i} style={styles.item}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                style={styles.questionBtn}
              >
                <span>{item.q}</span>
                <span style={{ fontSize: '1.25rem', transition: 'transform 0.2s', transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div style={styles.answer}>
                  <p style={styles.answerText}>{item.a}</p>
                </div>
              )}
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
    backgroundColor: '#F8FAFC',
    fontFamily: 'inherit',
  },
  container: {
    maxWidth: '720px',
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  questionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '18px 24px',
    border: 'none',
    background: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#111827',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
  },
  answer: {
    padding: '0 24px 20px',
  },
  answerText: {
    fontSize: '0.9375rem',
    lineHeight: 1.7,
    color: '#64748B',
    margin: 0,
  },
}
