import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { HowItWorks } from '@/components/showcase/HowItWorks'
import { PipelineShowcase } from '@/components/showcase/PipelineShowcase'
import { ArtifactGrid } from '@/components/showcase/ArtifactGrid'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { PricingSection } from '@/components/marketing/PricingSection'
import { FAQ } from '@/components/marketing/FAQ'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'PromptPilot — AI-Powered Software Planning Pipeline',
  description:
    'Turn your product idea into a complete engineering specification — PRD, SRS, architecture, database schema, API spec, and roadmap — in minutes. Powered by AI. Built for engineers.',
  openGraph: {
    title: 'PromptPilot — AI-Powered Software Planning Pipeline',
    description: 'Turn your product idea into a complete engineering specification in minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptPilot — AI-Powered Software Planning Pipeline',
    description: 'Turn your product idea into a complete engineering specification in minutes.',
  },
}

export default function HomePage() {
  return (
    <main
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <Nav />
      <Hero />
      <HowItWorks />
      <PipelineShowcase />
      <ArtifactGrid />
      <ComparisonTable />
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  )
}

function Hero() {
  return (
    <section style={heroStyles.section}>
      <div style={heroStyles.gradient} aria-hidden="true" />
      <div style={heroStyles.content}>
        <div style={heroStyles.badge}>
          <span style={heroStyles.badgeDot}>●</span>
          Now powered by GPT-4o and Claude 3.5 Sonnet
        </div>
        <h1 style={heroStyles.heading}>Your Idea → Complete Engineering Specification</h1>
        <p style={heroStyles.subtitle}>
          PromptPilot transforms a simple product description into a complete suite of software
          engineering documents — PRD, SRS, architecture, database schema, API spec, and roadmap —
          all consistent, all generated in minutes.
        </p>
        <div style={heroStyles.actions}>
          <Link href="/register" style={heroStyles.primaryBtn}>
            Start Free
          </Link>
          <Link href="/#how-it-works" style={heroStyles.secondaryBtn}>
            See how it works ↓
          </Link>
        </div>
        <div style={heroStyles.trustBar}>
          <span style={heroStyles.trustText}>Free to start · No credit card · Cancel anytime</span>
        </div>
      </div>
    </section>
  )
}

const heroStyles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 80px',
    overflow: 'hidden',
    backgroundColor: '#FAFBFC',
  },
  gradient: {
    position: 'absolute',
    top: '-30%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '900px',
    height: '900px',
    background:
      'radial-gradient(circle at 50% 50%, rgba(79,70,229,0.08) 0%, rgba(79,70,229,0.02) 40%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    textAlign: 'center' as const,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '20px',
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '32px',
  },
  badgeDot: {
    fontSize: '0.5rem',
    animation: 'promptpilot-pulse 2s ease-in-out infinite',
  },
  heading: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    lineHeight: 1.7,
    color: '#4B5563',
    marginTop: '24px',
    maxWidth: '640px',
    margin: '24px auto 0',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '40px',
    flexWrap: 'wrap' as const,
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 28px',
    borderRadius: '12px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 28px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid #E2E8F0',
  },
  trustBar: {
    marginTop: '32px',
  },
  trustText: {
    fontSize: '0.8125rem',
    color: '#9CA3AF',
  },
}
