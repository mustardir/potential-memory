import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import {
  apiSuccess,
  apiServerError,
  apiUnauthorized,
} from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { userId: user.id }
    if (type) where.type = type
    if (status) where.status = status

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    return apiSuccess({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    console.error('[TRANSACTIONS]', error)
    return apiServerError()
  }
}
