import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { sessionOptions, SessionData } from '@/lib/session'
import { loginSchema } from '@/lib/validations'
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
    const limit = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)

    if (!limit.success) {
      return apiError('Too many login attempts. Please try again later.', 429)
    }

    const body = await request.json()
    const data = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return apiError('Invalid email or password.', 401)
    }

    if (user.status === 'SUSPENDED') {
      return apiError('Your account has been suspended. Please contact support.', 403)
    }

    const passwordValid = await verifyPassword(data.password, user.password)
    if (!passwordValid) {
      return apiError('Invalid email or password.', 401)
    }

    const cookieStore = cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

    session.userId = user.id
    session.email = user.email
    session.role = user.role
    session.firstName = user.firstName
    session.lastName = user.lastName

    await session.save()

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error)
    }
    console.error('[LOGIN]', error)
    return apiServerError()
  }
}
