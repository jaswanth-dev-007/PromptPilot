import type { Metadata } from 'next'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'
import { FAQ } from '@/components/marketing/FAQ'

export const metadata: Metadata = {
  title: 'Pricing — PromptPilot',
  description:
    'Simple, transparent pricing. Start free, upgrade when you need more. Free tier available — no credit card required.',
}

export default function PricingPage() {
  return (
    <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <Nav />
      <section style={{ padding: '120px 24px 0', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
              Simple, Transparent Pricing
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6B7280', marginTop: '12px' }}>
              Start free. Upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>
      <section style={{ padding: '0 24px 80px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <PricingCards />
        </div>
      </section>
      <FAQ />
      <Footer />
    </main>
  )
}

function PricingCards() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'For individual developers exploring PromptPilot.',
      features: ['3 projects', '9-step pipeline', 'Basic document generation', 'Markdown export'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For professionals shipping real products.',
      features: ['Unlimited projects', 'All pipeline steps', 'Advanced AI models', 'Export to PDF, DOCX, MD', 'Version history', 'Priority generation'],
      cta: 'Start Pro',
      popular: true,
    },
    {
      name: 'Team',
      price: '$99',
      period: '/month',
      description: 'For engineering teams building together.',
      features: ['Everything in Pro', 'Up to 10 members', 'Shared workspaces', 'Team templates', 'Admin controls'],
      cta: 'Start Team',
      popular: false,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
      {plans.map((plan, i) => (
        <div key={i} style={{
          padding: '32px',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          border: plan.popular ? '2px solid #4F46E5' : '1px solid #E2E8F0',
          boxShadow: plan.popular ? '0 8px 30px rgba(79,70,229,0.12)' : 'none',
          position: 'relative',
        }}>
          {plan.popular && (
            <div style={{ position: 'absolute', top: '-12px', right: '24px', padding: '4px 16px', borderRadius: '20px', backgroundColor: '#4F46E5', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>
              Most Popular
            </div>
          )}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>{plan.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827' }}>{plan.price}</span>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{plan.period}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>{plan.description}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
            {plan.features.map((f, j) => (
              <li key={j} style={{ fontSize: '0.875rem', color: '#374151', padding: '6px 0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10B981', marginRight: '8px' }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <a href="/register" style={{
            display: 'block', width: '100%', textAlign: 'center', padding: '12px 0', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none',
            backgroundColor: plan.popular ? '#4F46E5' : '#F1F5F9',
            color: plan.popular ? '#FFFFFF' : '#374151',
          }}>
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
  )
}
