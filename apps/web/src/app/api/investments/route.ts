import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { apiSuccess, apiServerError, apiUnauthorized } from '@/lib/api'

export async function GET() {
  try {
    const user = await requireAuth()

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const totalPrincipal = investments.reduce(
      (sum, inv) => sum + Number(inv.principalAmount),
      0
    )
    const totalCurrentValue = investments.reduce(
      (sum, inv) => sum + Number(inv.currentValue),
      0
    )
    const totalReturn = totalCurrentValue - totalPrincipal
    const returnPercent =
      totalPrincipal > 0 ? (totalReturn / totalPrincipal) * 100 : 0

    return apiSuccess({
      investments,
      summary: {
        totalPrincipal,
        totalCurrentValue,
        totalReturn,
        returnPercent,
        activeCount: investments.filter((i) => i.status === 'ACTIVE').length,
      },
    })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    console.error('[INVESTMENTS]', error)
    return apiServerError()
  }
}
