import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getSession() {
  const cookieStore = cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    if (!user || user.status === 'SUSPENDED') return null

    return user
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    throw new Error('FORBIDDEN')
  }
  return user
}
