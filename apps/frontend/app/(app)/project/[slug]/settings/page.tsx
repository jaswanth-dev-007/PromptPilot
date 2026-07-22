'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'

export default function ProjectSettings({ params }: { params: { slug: string } }) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
        Project Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>⚙️ General</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '4px',
                }}
              >
                Project name
              </label>
              <input
                type="text"
                defaultValue={params.slug
                  .split('-')
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '4px',
                }}
              >
                Status
              </label>
              <select
                defaultValue="active"
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #D1D5DB',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option>draft</option>
                <option>active</option>
                <option>completed</option>
                <option>archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
