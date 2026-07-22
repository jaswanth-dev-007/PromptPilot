'use client'

import { useState, useCallback } from 'react'

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
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

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.subtitle}>Your workspace overview</p>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tasks</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.addRow}>
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
            style={styles.input}
            aria-label="New task"
          />
          <button type="button" onClick={addTask} style={styles.addBtn} aria-label="Add">
            Add
          </button>
        </div>
        <ul style={styles.list}>
          {tasks.map(task => (
            <li key={task.id} style={styles.taskRow}>
              <label style={styles.taskLabel}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              </label>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                style={styles.deleteBtn}
                aria-label="Delete"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: '40px 24px',
    maxWidth: '960px',
    margin: '0 auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  heading: { fontSize: '2rem', fontWeight: 700, color: '#111827' },
  subtitle: { marginTop: '4px', fontSize: '1rem', color: '#6b7280' },
  section: { marginTop: '32px' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '12px' },
  error: { color: '#ef4444', fontSize: '0.875rem', marginBottom: '8px' },
  addRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1.5px solid #d1d5db',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
  },
  addBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
  },
  list: { listStyle: 'none', padding: 0 },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  taskLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
}
