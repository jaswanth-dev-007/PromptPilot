import type { z } from 'zod'
export declare const emailSchema: z.ZodString
export declare const passwordSchema: z.ZodString
export declare const registerSchema: z.ZodObject<
  {
    email: z.ZodString
    password: z.ZodString
    name: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string
    password: string
    name: string
  },
  {
    email: string
    password: string
    name: string
  }
>
export declare const loginSchema: z.ZodObject<
  {
    email: z.ZodString
    password: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string
    password: string
  },
  {
    email: string
    password: string
  }
>
//# sourceMappingURL=index.d.ts.map
