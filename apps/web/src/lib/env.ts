import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid PostgreSQL URL').optional(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const messages = Object.entries(errors)
      .map(([field, errs]) => `  ${field}: ${Array.isArray(errs) ? errs.join(', ') : String(errs)}`)
      .join('\n')

    throw new Error(`❌ Invalid environment variables:\n${messages}`)
  }

  return parsed.data
}

export const env = validateEnv()
