import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { depositSchema, withdrawSchema } from '@/lib/validations'
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

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!wallet) return apiError('Wallet not found', 404)

    return apiSuccess({ wallet })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    return apiServerError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { action } = body

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
    if (!wallet) return apiError('Wallet not found', 404)
    if (wallet.isLocked) return apiError('Wallet is locked', 403)

    if (action === 'deposit') {
      const data = depositSchema.parse(body)

      const updatedWallet = await prisma.$transaction(async (tx) => {
        const updated = await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: data.amount } },
        })

        await tx.transaction.create({
          data: {
            userId: user.id,
            walletId: wallet.id,
            type: 'DEPOSIT',
            status: 'COMPLETED',
            amount: data.amount,
            description: data.description || 'Deposit',
          },
        })

        return updated
      })

      return apiSuccess({ wallet: updatedWallet, message: 'Deposit successful' })
    }

    if (action === 'withdraw') {
      const data = withdrawSchema.parse(body)
      const currentBalance = Number(wallet.balance)

      if (data.amount > currentBalance) {
        return apiError('Insufficient funds', 400)
      }

      const updatedWallet = await prisma.$transaction(async (tx) => {
        const updated = await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: data.amount } },
        })

        await tx.transaction.create({
          data: {
            userId: user.id,
            walletId: wallet.id,
            type: 'WITHDRAWAL',
            status: 'COMPLETED',
            amount: data.amount,
            description: data.description || 'Withdrawal',
          },
        })

        return updated
      })

      return apiSuccess({ wallet: updatedWallet, message: 'Withdrawal successful' })
    }

    return apiError('Invalid action', 400)
  } catch (error) {
    if (error instanceof ZodError) return handleZodError(error)
    if ((error as Error).message === 'UNAUTHORIZED') return apiUnauthorized()
    console.error('[WALLET]', error)
    return apiServerError()
  }
}
