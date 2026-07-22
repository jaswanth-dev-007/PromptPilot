'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'
import { useNavigation } from '@/components/NavigationContext'

const ARTIFACT_TYPES = [
  { id: 'master-context', icon: '💡', label: 'Master Context', status: 'Not generated' },
  { id: 'prd', icon: '📋', label: 'PRD', status: 'Not generated' },
  { id: 'srs', icon: '📐', label: 'SRS', status: 'Not generated' },
  { id: 'architecture', icon: '🏗️', label: 'Architecture', status: 'Not generated' },
  { id: 'database', icon: '🗄️', label: 'Database Schema', status: 'Not generated' },
  { id: 'api-spec', icon: '🔌', label: 'API Specification', status: 'Not generated' },
  { id: 'user-flows', icon: '🔄', label: 'User Flows', status: 'Not generated' },
  { id: 'wireframes', icon: '🎨', label: 'Wireframes', status: 'Not generated' },
  { id: 'roadmap', icon: '🗺️', label: 'Roadmap', status: 'Not generated' },
]

export default function ProjectDashboard({ params }: { params: { slug: string } }) {
  const { setActiveProject } = useNavigation()

  React.useEffect(() => {
    setActiveProject(params.slug)
    return () => setActiveProject(null)
  }, [params.slug, setActiveProject])

  const name = params.slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <ProjectHeader name={name} slug={params.slug} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '24px' }}>
        <Card>
          <CardHeader><CardTitle>📄 Artifacts</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
              {ARTIFACT_TYPES.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                  borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{a.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{a.status}</div>
                  </div>
                  <Link href={`/project/${params.slug}/documents`} style={{
                    padding: '4px 10px', borderRadius: '6px', backgroundColor: '#4F46E5',
                    color: '#FFF', fontSize: '0.6875rem', fontWeight: 600, textDecoration: 'none',
                  }}>
                    Generate
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <CardHeader><CardTitle>📊 Progress</CardTitle></CardHeader>
            <CardContent>
              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>Documents generated</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4F46E5' }}>0/9</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9' }}>
                  <div style={{ height: '100%', width: '0%', borderRadius: '4px', backgroundColor: '#4F46E5', transition: 'width 0.3s' }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>🤖 AI Activity</CardTitle></CardHeader>
            <CardContent>
              <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>No AI activity</div>
                <div style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '4px' }}>Start the pipeline to begin generating.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProjectHeader({ name, slug }: { name: string; slug: string }) {
  return (
    <div style={{
      padding: '24px 0', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF',
        }}>
          {slug.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>{name}</h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>
            <span>📋 Active</span>
            <span>0 documents</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href={`/project/${slug}/documents`} style={{
          padding: '8px 18px', borderRadius: '8px', backgroundColor: '#4F46E5',
          color: '#FFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
        }}>
          View Documents
        </Link>
        <Link href={`/project/${slug}/settings`} style={{
          padding: '8px 18px', borderRadius: '8px', backgroundColor: '#F1F5F9',
          color: '#374151', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
        }}>
          ⚙️
        </Link>
      </div>
    </div>
  )
}
