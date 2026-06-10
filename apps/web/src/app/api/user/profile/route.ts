import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, hashPassword, verifyPassword } from '@/lib/auth'
import { updateProfileSchema, changePasswordSchema } from '@/lib/validations'
import {
  apiSuccess,
  apiError,
  handleZodError,
  apiServerError,
  apiUnauthorized,
} from '@/lib/api'
import { ZodError } from 'zod'

export async function GET() {
  try {
    const user = await requireAuth()

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        profile: true,
      },
    })

    return apiSuccess({ user: fullUser })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    return apiServerError()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    if (body.action === 'change-password') {
      const data = changePasswordSchema.parse(body)

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
      if (!dbUser) return apiError('User not found', 404)

      const valid = await verifyPassword(data.currentPassword, dbUser.password)
      if (!valid) return apiError('Current password is incorrect', 400)

      const newHashed = await hashPassword(data.newPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHashed },
      })

      return apiSuccess({ message: 'Password updated successfully' })
    }

    const data = updateProfileSchema.parse(body)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
        },
      }),
      prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
          postalCode: data.postalCode || null,
          occupation: data.occupation || null,
        },
        update: {
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
          postalCode: data.postalCode || null,
          occupation: data.occupation || null,
        },
      }),
    ])

    return apiSuccess({ message: 'Profile updated successfully' })
  } catch (error) {
    if (error instanceof ZodError) return handleZodError(error)
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    console.error('[USER PATCH]', error)
    return apiServerError()
  }
}
