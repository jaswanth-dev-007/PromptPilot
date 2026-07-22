'use client'

import { useState, useCallback, useEffect } from 'react'

interface AuthUser {
  email: string
  name: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  })

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser
        setState({ isAuthenticated: true, user, loading: false })
        return
      } catch {
        localStorage.removeItem('user')
      }
    }
    setState(prev => ({ ...prev, loading: false }))
  }, [])

  const login = useCallback((user: AuthUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
    setState({ isAuthenticated: true, user, loading: false })
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setState({ isAuthenticated: false, user: null, loading: false })
  }, [])

  return { ...state, login, logout }
}
