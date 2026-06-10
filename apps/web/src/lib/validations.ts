import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  postalCode: z.string().max(20).optional().or(z.literal('')),
  occupation: z.string().max(100).optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(10, 'Minimum deposit is $10')
    .max(1000000, 'Maximum deposit is $1,000,000'),
  description: z.string().max(200).optional(),
})

export const withdrawSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(10, 'Minimum withdrawal is $10'),
  description: z.string().max(200).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DepositInput = z.infer<typeof depositSchema>
export type WithdrawInput = z.infer<typeof withdrawSchema>
