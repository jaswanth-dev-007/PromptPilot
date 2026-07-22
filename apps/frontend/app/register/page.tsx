'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Button, PasswordField } from '@promptpilot/ui'
import { api, ApiRequestError } from '@/lib/utils/api'
import { useAuth } from '@/hooks/useAuth'

interface RegisterResponse {
  user: { email: string; name: string }
  expiresIn: number
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'At least 8 characters'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setGeneralError('')

    if (!validate()) return

    setLoading(true)
    try {
      const res = await api.post<RegisterResponse>('/auth/register', {
        email: email.trim(),
        password,
        name: name.trim(),
      })

      if (res.success && res.data) {
        login(res.data.user)
        router.push('/dashboard')
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 409) {
          setGeneralError('An account with this email already exists.')
        } else {
          setGeneralError(err.message)
        }
      } else {
        setGeneralError('Network error. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Start building with PromptPilot</p>
        </div>

        {generalError && (
          <div style={styles.errorBanner}>
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            error={errors.name}
            placeholder="Your full name"
            autoComplete="name"
            autoFocus
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <PasswordField
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '12px' }}>
            Create Account
          </Button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: '#f9fafb',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    marginTop: '4px',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '0.875rem',
    color: '#b91c1c',
  },
  footerText: {
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
