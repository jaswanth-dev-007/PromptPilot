'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@promptpilot/ui'
import { api } from '@/lib/utils/api'

const ARTIFACTS = [
  { id: 'master-context', icon: '💡', label: 'Master Context' },
  { id: 'prd', icon: '📋', label: 'PRD' },
  { id: 'srs', icon: '📐', label: 'SRS' },
  { id: 'architecture', icon: '🏗️', label: 'Architecture' },
  { id: 'database', icon: '🗄️', label: 'Database Schema' },
  { id: 'api-spec', icon: '🔌', label: 'API Specification' },
  { id: 'user-flows', icon: '🔄', label: 'User Flows' },
  { id: 'wireframes', icon: '🎨', label: 'Wireframes' },
  { id: 'roadmap', icon: '🗺️', label: 'Roadmap' },
]

export default function ProjectDocuments({ params }: { params: { slug: string } }) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { status: string; content?: string }>>({})
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(stepId: string) {
    setGenerating(stepId)
    setError(null)
    try {
      const res = await api.post<{ document: { status: string; content: string } }>(
        '/pipeline/generate',
        {
          projectId: params.slug,
          stepId,
          userInput: `Generate a ${ARTIFACTS.find(a => a.id === stepId)?.label} document for this project.`,
        },
      )
      if (res.success && res.data) {
        setResults(prev => ({ ...prev, [stepId]: res.data!.document }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
          Documents
        </h1>
        <Link
          href={`/project/${params.slug}`}
          style={{
            padding: '10px 22px',
            borderRadius: '10px',
            backgroundColor: '#4F46E5',
            color: '#FFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Run Pipeline
        </Link>
      </div>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            color: '#B91C1C',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}
      <Card>
        <CardContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {ARTIFACTS.map(a => {
              const result = results[a.id]
              return (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: result ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                    backgroundColor: result ? '#F0FDF4' : '#F8FAFC',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                      {a.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: result?.status === 'GENERATED' ? '#059669' : '#9CA3AF',
                      }}
                    >
                      {result?.status === 'GENERATED'
                        ? 'Generated'
                        : generating === a.id
                          ? 'Generating...'
                          : 'Not generated'}
                    </div>
                  </div>
                  {!result && (
                    <button
                      onClick={() => handleGenerate(a.id)}
                      disabled={generating === a.id}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: generating === a.id ? '#9CA3AF' : '#4F46E5',
                        color: '#FFF',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: generating === a.id ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {generating === a.id ? '...' : 'Generate'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
