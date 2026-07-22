'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'

export default function WorkspaceProjects({ params }: { params: { slug: string } }) {
  const name = params.slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Projects</h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '4px 0 0' }}>{name}</p>
        </div>
        <Link href="/projects" style={{
          padding: '10px 22px', borderRadius: '10px', backgroundColor: '#4F46E5',
          color: '#FFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
        }}>
          + New Project
        </Link>
      </div>
      <Card>
        <CardContent>
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📁</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>No projects yet</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', margin: '6px 0 20px' }}>Create your first project to start generating specifications.</div>
            <Link href="/projects" style={{
              padding: '10px 24px', borderRadius: '10px', backgroundColor: '#4F46E5',
              color: '#FFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex',
            }}>
              Create Project
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
