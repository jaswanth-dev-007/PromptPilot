'use client'

import React, { useState } from 'react'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individual developers exploring PromptPilot.',
    features: ['3 projects', '9-step pipeline', 'Basic document generation', 'Markdown export'],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professionals shipping real products.',
    features: [
      'Unlimited projects',
      'All pipeline steps',
      'Advanced AI models (GPT-4o, Claude)',
      'Export to PDF, DOCX, MD',
      'Version history',
      'Priority AI generation',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    description: 'For engineering teams building together.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared workspaces',
      'Team templates',
      'Admin controls',
      'Priority support',
    ],
    cta: 'Start Team',
  },
]

export function PricingSection() {
  return (
    <section style={styles.section} id="pricing">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Simple, Transparent Pricing</h2>
          <p style={styles.subtitle}>Start free. Upgrade when you need more. No hidden fees.</p>
        </div>
        <div style={styles.grid}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                ...(plan.popular ? styles.cardPopular : {}),
              }}
            >
              {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.priceRow}>
                <span style={styles.price}>{plan.price}</span>
                <span style={styles.period}>{plan.period}</span>
              </div>
              <p style={styles.planDesc}>{plan.description}</p>
              <ul style={styles.features}>
                {plan.features.map((f, j) => (
                  <li key={j} style={styles.feature}>
                    <span style={{ color: '#10B981', marginRight: '8px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/register"
                style={{
                  ...styles.cta,
                  ...(plan.popular ? styles.ctaPrimary : styles.ctaSecondary),
                }}
              >
                {plan.cta}
              </a>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    padding: '32px',
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    position: 'relative',
  },
  cardPopular: {
    borderColor: '#4F46E5',
    boxShadow: '0 8px 30px rgba(79,70,229,0.12)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    right: '24px',
    padding: '4px 16px',
    borderRadius: '20px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  planName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 12px 0',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '12px',
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  period: {
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  planDesc: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0 0 24px 0',
    lineHeight: 1.6,
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px 0',
  },
  feature: {
    fontSize: '0.875rem',
    color: '#374151',
    padding: '6px 0',
    display: 'flex',
    alignItems: 'center',
  },
  cta: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    padding: '12px 0',
    borderRadius: '10px',
    fontSize: '0.9375rem',
    fontWeight: 600,
    textDecoration: 'none',
    border: 'none',
    fontFamily: 'inherit',
  },
  ctaPrimary: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
  },
  ctaSecondary: {
    backgroundColor: '#F1F5F9',
    color: '#374151',
  },
}
