'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'
import { useNavigation } from '@/components/NavigationContext'

export default function WorkspaceDashboard({ params }: { params: { slug: string } }) {
  const { setActiveWorkspace } = useNavigation()

  React.useEffect(() => {
    setActiveWorkspace(params.slug)
    return () => setActiveWorkspace(null)
  }, [params.slug, setActiveWorkspace])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <WorkspaceHeader slug={params.slug} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
        <Card>
          <CardHeader><CardTitle>📁 Projects</CardTitle></CardHeader>
          <CardContent>
            <EmptyState icon="📁" title="No projects yet" description="Create your first project in this workspace." action={{ label: 'New Project', href: '/projects' }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>📊 Summary</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <StatBox label="Projects" value="0" />
              <StatBox label="Documents" value="0" />
              <StatBox label="Members" value="1" />
              <StatBox label="Generations" value="0" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <Card>
          <CardHeader><CardTitle>🤖 AI Activity</CardTitle></CardHeader>
          <CardContent><EmptyState icon="💬" title="No AI activity yet" description="Start a pipeline to begin generating documents." /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>👥 Members</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#4F46E5' }}>
                Y
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>You</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Owner</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function WorkspaceHeader({ slug }: { slug: string }) {
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return (
    <div style={{
      padding: '28px 0', borderBottom: '1px solid #E2E8F0', marginBottom: '0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF',
        }}>
          {slug.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{name}</h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#64748B' }}>
            <span>🏢 Personal workspace</span>
            <span>Created recently</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href={`/workspace/${slug}/settings`} style={{
          padding: '8px 18px', borderRadius: '8px', backgroundColor: '#F1F5F9',
          color: '#374151', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
        }}>⚙️ Settings</Link>
        <Link href={`/workspace/${slug}/members`} style={{
          padding: '8px 18px', borderRadius: '8px', backgroundColor: '#F1F5F9',
          color: '#374151', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
        }}>👥 Members</Link>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4F46E5' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 16px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>{title}</div>
      <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '6px', marginBottom: '16px' }}>{description}</div>
      {action && (
        <Link href={action.href} style={{
          padding: '8px 20px', borderRadius: '8px', backgroundColor: '#4F46E5',
          color: '#FFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex',
        }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
