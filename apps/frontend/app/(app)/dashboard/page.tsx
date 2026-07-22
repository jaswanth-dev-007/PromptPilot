'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@promptpilot/ui'
import { useAuthContext } from '@/providers/AuthProvider'
import { useNavigation } from '@/components/NavigationContext'

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { setCommandPaletteOpen } = useNavigation()

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <WelcomeHero user={user} onCommandPalette={() => setCommandPaletteOpen(true)} />
      <QuickActions />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
          marginTop: '32px',
        }}
      >
        <RecentProjects />
        <WorkspaceSummary />
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}
      >
        <AIActivity />
        <Favorites />
      </div>
      <TasksSection />
    </div>
  )
}

function WelcomeHero({
  user,
  onCommandPalette,
}: {
  user: { name: string; email: string } | null
  onCommandPalette: () => void
}) {
  return (
    <div
      style={{
        marginBottom: '32px',
        padding: '32px 0',
        position: 'relative',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F8FAFC 100%)',
        borderRadius: '16px',
        marginTop: '8px',
      }}
    >
      <div style={{ padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#4B5563', margin: '0 0 16px' }}>
          Ready to build something great today?
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/projects"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + New Project
          </Link>
          <Link
            href="/workspaces"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #E2E8F0',
            }}
          >
            Open Workspace
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuickActions() {
  const actions = [
    { icon: '📋', label: 'Generate PRD', href: '/projects', color: '#EEF2FF' },
    { icon: '📐', label: 'Generate SRS', href: '/projects', color: '#ECFDF5' },
    { icon: '🏗️', label: 'Architecture', href: '/projects', color: '#FFF7ED' },
    { icon: '🗄️', label: 'Database Schema', href: '/projects', color: '#EFF6FF' },
    { icon: '📄', label: 'New Document', href: '/projects', color: '#F5F3FF' },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
      }}
    >
      {actions.map(a => (
        <Link
          key={a.label}
          href={a.href}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '20px 16px',
            borderRadius: '12px',
            backgroundColor: a.color,
            border: '1px solid transparent',
            textDecoration: 'none',
            transition: 'transform 0.15s, box-shadow 0.15s',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151' }}>
            {a.label}
          </span>
        </Link>
      ))}
      <button
        onClick={() => {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '20px 16px',
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          border: '2px dashed #E2E8F0',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: '#64748B',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>⌘K</span>
        <span>More Actions</span>
      </button>
    </div>
  )
}

function RecentProjects() {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>📁 Recent Projects</CardTitle>
          <Link
            href="/projects"
            style={{
              fontSize: '0.8125rem',
              color: '#4F46E5',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <EmptyPrompt
          icon="📁"
          title="No projects yet"
          description="Create your first project to start generating specifications."
        />
      </CardContent>
    </Card>
  )
}

function WorkspaceSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Workspace Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <StatBox label="Projects" value="0" />
          <StatBox label="Documents" value="0" />
          <StatBox label="AI Generations" value="0" />
          <StatBox label="Exports" value="0" />
        </div>
      </CardContent>
    </Card>
  )
}

function AIActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🤖 Recent AI Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyPrompt
          icon="💬"
          title="No AI activity yet"
          description="Start a pipeline to see your AI generation history here."
        />
      </CardContent>
    </Card>
  )
}

function Favorites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>⭐ Favorites</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyPrompt
          icon="⭐"
          title="No favorites"
          description="Star projects and documents to access them quickly."
        />
      </CardContent>
    </Card>
  )
}

function TasksSection() {
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([])
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addTask = useCallback(() => {
    const trimmed = newTitle.trim()
    if (!trimmed) {
      setError('Task title cannot be empty.')
      return
    }
    setTasks(prev => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false }])
    setNewTitle('')
    setError(null)
  }, [newTitle])

  return (
    <div style={{ marginTop: '20px' }}>
      <Card>
        <CardHeader>
          <CardTitle>✅ Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginBottom: '8px' }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTitle}
              onChange={e => {
                setNewTitle(e.target.value)
                setError(null)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') addTask()
              }}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.5px solid #D1D5DB',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: '#4F46E5',
                color: '#FFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Add
            </button>
          </div>
          {tasks.length === 0 ? (
            <EmptyPrompt
              icon="✅"
              title="No tasks"
              description="Add tasks to track your progress."
            />
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tasks.map(t => (
                <li
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() =>
                        setTasks(prev =>
                          prev.map(x => (x.id === t.id ? { ...x, completed: !x.completed } : x)),
                        )
                      }
                    />
                    <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                      {t.title}
                    </span>
                  </label>
                  <button
                    onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #F1F5F9',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4F46E5' }}>{value}</div>
      <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function EmptyPrompt({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#374151' }}>{title}</div>
      <div style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '4px' }}>{description}</div>
    </div>
  )
}
