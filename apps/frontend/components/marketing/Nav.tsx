'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: '/docs' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      style={{
        ...styles.nav,
        ...(scrolled ? styles.navScrolled : {}),
      }}
    >
      <div style={styles.inner}>
        <Link href="/" style={styles.logo}>
          PromptPilot
        </Link>

        <div style={styles.desktopLinks}>
          {LINKS.map(link => (
            <Link key={link.href} href={link.href} style={styles.link}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" style={styles.link}>
            Sign In
          </Link>
          <Link href="/register" style={styles.cta}>
            Start Free
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          style={styles.hamburger}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Sign In
          </Link>
          <Link href="/register" style={styles.mobileCta} onClick={() => setMobileOpen(false)}>
            Start Free
          </Link>
        </div>
      )}
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '14px 24px',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  },
  navScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    textDecoration: 'none',
    letterSpacing: '-0.02em',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  link: {
    padding: '6px 14px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#475569',
    textDecoration: 'none',
    borderRadius: '8px',
  },
  cta: {
    padding: '8px 18px',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '10px',
    marginLeft: '8px',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#475569',
    padding: '4px 8px',
  },
  mobileMenu: {
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileLink: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#475569',
    textDecoration: 'none',
  },
  mobileCta: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '10px',
    margin: '8px 16px',
    textAlign: 'center',
  },
}
