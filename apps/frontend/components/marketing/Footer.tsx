import React from 'react'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            <div style={styles.logo}>PromptPilot</div>
            <p style={styles.tagline}>
              AI-powered software planning pipeline. From idea to engineering-ready in minutes.
            </p>
            <p style={styles.copyright}>© {new Date().getFullYear()} PromptPilot. All rights reserved.</p>
          </div>
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h4 style={styles.sectionTitle}>{section.title}</h4>
              <ul style={styles.list}>
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} style={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#0F172A',
    color: '#94A3B8',
    padding: '64px 24px 32px',
    fontFamily: 'inherit',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '40px',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#F8FAFC',
    marginBottom: '12px',
  },
  tagline: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: '#64748B',
    margin: '0 0 20px 0',
    maxWidth: '280px',
  },
  copyright: {
    fontSize: '0.8125rem',
    color: '#475569',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 16px 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    display: 'block',
    padding: '4px 0',
    fontSize: '0.875rem',
    color: '#94A3B8',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
}
