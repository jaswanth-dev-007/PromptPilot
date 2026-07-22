'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { z } from 'zod'

interface UseFormOptions<T extends Record<string, unknown>> {
  schema: z.ZodSchema<T>
  defaultValues: T
  onSubmit: (values: T) => Promise<void> | void
  onError?: (errors: Record<string, string>) => void
  autosaveDelay?: number
  resetOnSubmit?: boolean
}

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isDirty: boolean
  isSaving: boolean
  submitError: string | null
  setValue: <K extends keyof T>(name: K, value: T[K]) => void
  setValues: (values: Partial<T>) => void
  getValue: <K extends keyof T>(name: K) => T[K]
  register: <K extends keyof T>(name: K) => {
    value: T[K]
    onChange: (value: T[K]) => void
    onBlur: () => void
    error: string | undefined
    name: string
  }
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  validate: () => boolean
  reset: (values?: T) => void
  setFieldError: (name: string, error: string) => void
  clearErrors: () => void
}

export function useForm<T extends Record<string, unknown>>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  autosaveDelay = 0,
  resetOnSubmit = false,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const initialValues = useRef(defaultValues)

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      }
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }, [schema, values])

  // Debounced autosave
  useEffect(() => {
    if (!autosaveDelay || !isDirty) return
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      if (validate()) {
        setIsSaving(true)
        Promise.resolve(onSubmit(values))
          .catch(() => {})
          .finally(() => setIsSaving(false))
      }
    }, autosaveDelay)
    return () => clearTimeout(autosaveTimer.current)
  }, [values, isDirty, autosaveDelay, validate, onSubmit])

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValuesState(prev => {
      const next = { ...prev, [name]: value }
      return next
    })
    setIsDirty(true)
    // Clear error on change
    setErrors(prev => {
      const next = { ...prev }
      delete next[name as string]
      return next
    })
    setSubmitError(null)
  }, [])

  const setValues = useCallback((partial: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...partial }))
    setIsDirty(true)
  }, [])

  const getValue = useCallback(<K extends keyof T>(name: K): T[K] => {
    return values[name]
  }, [values])

  const register = useCallback(<K extends keyof T>(name: K) => ({
    value: values[name],
    onChange: (value: T[K]) => setValue(name, value),
    onBlur: () => setTouched(prev => ({ ...prev, [name as string]: true })),
    error: touched[name as string] ? errors[name as string] : undefined,
    name: name as string,
  }), [values, errors, touched, setValue])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubmitError(null)

    // Mark all as touched
    const allTouched: Record<string, boolean> = {}
    for (const key of Object.keys(values)) allTouched[key] = true
    setTouched(allTouched)

    if (!validate()) {
      onError?.(errors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
      if (resetOnSubmit) {
        setValuesState(defaultValues)
        setIsDirty(false)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, errors, validate, onSubmit, onError, resetOnSubmit, defaultValues])

  const reset = useCallback((newValues?: T) => {
    setValuesState(newValues || initialValues.current)
    setErrors({})
    setTouched({})
    setIsDirty(false)
    setSubmitError(null)
  }, [])

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const clearErrors = useCallback(() => setErrors({}), [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isSaving,
    submitError,
    setValue,
    setValues,
    getValue,
    register,
    handleSubmit,
    validate,
    reset,
    setFieldError,
    clearErrors,
  }
}
