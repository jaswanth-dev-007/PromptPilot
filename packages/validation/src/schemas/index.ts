import { z } from 'zod'

export const emailSchema = z.string().email('Please enter a valid email')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

export const nameSchema = z.string().min(1, 'Name is required').max(100)

export const urlSchema = z.string().url('Please enter a valid URL').or(z.literal(''))

export const requiredString = z.string().min(1, 'This field is required')

export const optionalString = z.string().optional()

export const projectSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: optionalString,
})

export const workspaceSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
})

export { z }
