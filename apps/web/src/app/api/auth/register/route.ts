import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import {
  apiSuccess,
  apiError,
  handleZodError,
  apiServerError,
  getClientIp,
} from '@/lib/api'
import { rateLimit } from '@/lib/rate-limit'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000)

    if (!limit.success) {
      return apiError('Too many registration attempts. Please try again later.', 429)
    }

    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return apiError('An account with this email already exists.', 409)
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        status: 'ACTIVE',
        emailVerified: false,
        wallet: {
          create: {
            balance: 0,
            currency: 'USD',
          },
        },
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    })

    return apiSuccess(
      { message: 'Account created successfully', user },
      201
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error)
    }
    console.error('[REGISTER]', error)
    return apiServerError()
  }
}
