'use client'

import { useState, useCallback } from 'react'

export interface Task {
  id: string
  title: string
  completed: boolean
}

export function useTask(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [error, setError] = useState<string | null>(null)

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Task title cannot be empty.')
      return
    }
    setTasks(prev => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false }])
    setError(null)
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
    setError(null)
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setError(null)
  }, [])

  return { tasks, error, addTask, toggleTask, deleteTask }
}
