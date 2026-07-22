'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<{ isAuthenticated: boolean; user: AuthUser | null }>({
    isAuthenticated: false,
    user: null,
  })

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const userRaw = localStorage.getItem('user')
    if (accessToken && userRaw) {
      try {
        const user = JSON.parse(userRaw) as AuthUser
        setState({ isAuthenticated: true, user })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((accessToken: string, refreshToken: string, user: AuthUser) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    setState({ isAuthenticated: true, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setState({ isAuthenticated: false, user: null })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return ctx
}
