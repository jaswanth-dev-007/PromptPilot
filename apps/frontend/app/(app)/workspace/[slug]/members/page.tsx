'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'

export default function WorkspaceMembers({ params }: { params: { slug: string } }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Members</h1>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.125rem', color: '#4F46E5',
            }}>
              Y
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>You</div>
              <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>you@example.com</div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: '6px', backgroundColor: '#EEF2FF',
              color: '#4F46E5', fontSize: '0.75rem', fontWeight: 600,
            }}>
              Owner
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
