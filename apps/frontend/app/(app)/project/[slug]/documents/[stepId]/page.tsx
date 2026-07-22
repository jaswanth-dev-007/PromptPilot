'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/utils/api'

const STEP_LABELS: Record<string, { icon: string; label: string }> = {
  'master-context': { icon: '💡', label: 'Master Context' },
  prd: { icon: '📋', label: 'PRD' },
  srs: { icon: '📐', label: 'SRS' },
  architecture: { icon: '🏗️', label: 'Architecture' },
  database: { icon: '🗄️', label: 'Database Schema' },
  'api-spec': { icon: '🔌', label: 'API Specification' },
  'user-flows': { icon: '🔄', label: 'User Flows' },
  wireframes: { icon: '🎨', label: 'Wireframes' },
  roadmap: { icon: '🗺️', label: 'Roadmap' },
}

export default function DocumentDetail() {
  const params = useParams()
  const projectId = params.slug as string
  const stepId = params.stepId as string
  const info = STEP_LABELS[stepId] || { icon: '📄', label: stepId }

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [version, setVersion] = useState(1)
  const [status, setStatus] = useState('Not generated')
  const [error, setError] = useState<string | null>(null)
  const [versions, setVersions] = useState<Array<{ versionNumber: number; createdAt: string }>>([])
  const [showVersions, setShowVersions] = useState(false)

  useEffect(() => {
    loadDocument()
  }, [projectId, stepId])

  async function loadDocument() {
    setLoading(true)
    try {
      const res = await api.get<{
        documents: Array<{
          id: string
          content: string
          version: number
          status: string
          createdAt: string
        }>
      }>(`/documents?projectId=${projectId}&stepId=${stepId}`)
      if (res.success && res.data?.documents?.length) {
        const doc = res.data.documents[0]
        setContent(doc.content)
        setVersion(doc.version)
        setStatus(doc.status)
        setVersions([{ versionNumber: doc.version, createdAt: doc.createdAt }])
      }
    } catch {
      // No document yet — show empty state
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await api.post<{
        document: { status: string; version: number; content: string }
      }>('/pipeline/generate', {
        projectId,
        stepId,
        userInput: `Generate a ${info.label} document for this project.`,
      })
      if (res.success && res.data?.document) {
        setContent(res.data.document.content)
        setVersion(res.data.document.version)
        setStatus(res.data.document.status)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Is the backend running?')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2rem' }}>{info.icon}</span>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              {info.label}
            </h1>
            <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '4px' }}>
              {status === 'GENERATED' ? (
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  ✓ Version {version} · Generated
                </span>
              ) : (
                <span style={{ color: '#9CA3AF' }}>Not generated yet</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {content && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                color: '#374151',
                border: '1px solid #E2E8F0',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              History ({versions.length})
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: generating ? '#9CA3AF' : '#4F46E5',
              color: '#FFF',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: generating ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {generating ? 'Generating...' : content ? 'Regenerate' : 'Generate'}
          </button>
        </div>
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

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: '#9CA3AF',
            fontSize: '0.9375rem',
          }}
        >
          Loading...
        </div>
      ) : content ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div
            style={{
              flex: 1,
              padding: '32px',
              backgroundColor: '#FFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              overflow: 'auto',
            }}
          >
            <MarkdownRenderer content={content} />
          </div>
          {showVersions && (
            <div
              style={{
                width: '220px',
                flexShrink: 0,
                padding: '20px',
                backgroundColor: '#FFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                height: 'fit-content',
              }}
            >
              <h3
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '12px',
                }}
              >
                Version History
              </h3>
              {versions.map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151' }}>
                    v{v.versionNumber}
                    {v.versionNumber === version && (
                      <span style={{ color: '#4F46E5', marginLeft: '4px' }}>●</span>
                    )}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {versions.length === 0 && (
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>No versions yet</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: '#FFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{info.icon}</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
            No {info.label} generated yet
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280', margin: '6px 0 20px' }}>
            Click Generate to create this document with AI.
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              backgroundColor: generating ? '#9CA3AF' : '#4F46E5',
              color: '#FFF',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: generating ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {generating ? 'Generating...' : 'Generate Now'}
          </button>
        </div>
      )}
    </div>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  function renderLine(line: string, key: number) {
    if (line.startsWith('# ')) {
      return (
        <h1
          key={key}
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 16px',
            lineHeight: 1.3,
          }}
        >
          {line.slice(2)}
        </h1>
      )
    }
    if (line.startsWith('## ')) {
      return (
        <h2
          key={key}
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            margin: '32px 0 12px',
            lineHeight: 1.3,
          }}
        >
          {line.slice(3)}
        </h2>
      )
    }
    if (line.startsWith('### ')) {
      return (
        <h3
          key={key}
          style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '24px 0 8px' }}
        >
          {line.slice(4)}
        </h3>
      )
    }
    if (line.startsWith('```')) {
      return (
        <div
          key={key}
          style={{
            margin: '12px 0',
            padding: '16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8125rem',
            color: '#334155',
            whiteSpace: 'pre-wrap',
          }}
        />
      )
    }
    if (line.startsWith('- ')) {
      return (
        <li
          key={key}
          style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8, marginLeft: '20px' }}
        >
          {line.slice(2)}
        </li>
      )
    }
    if (line.startsWith('|')) {
      return (
        <div
          key={key}
          style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontFamily: 'monospace',
            padding: '2px 0',
          }}
        >
          {line}
        </div>
      )
    }
    if (line.trim() === '') {
      return <div key={key} style={{ height: '12px' }} />
    }
    return (
      <p
        key={key}
        style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: '#374151', margin: '0 0 8px' }}
      >
        {line}
      </p>
    )
  }

  const lines = content.split('\n')
  let inCodeBlock = false

  return (
    <div
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {lines.map((line, i) => {
        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock
          return inCodeBlock ? null : renderLine(line, i)
        }
        if (inCodeBlock) {
          return (
            <div
              key={i}
              style={{
                padding: '2px 16px',
                backgroundColor: '#F8FAFC',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8125rem',
                color: '#334155',
                whiteSpace: 'pre-wrap',
              }}
            >
              {line}
            </div>
          )
        }
        return renderLine(line, i)
      })}
    </div>
  )
}
