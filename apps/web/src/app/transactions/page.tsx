import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { ArrowLeftRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Transactions' }

const TX_ICONS: Record<string, React.ReactNode> = {
  DEPOSIT: <ArrowDownRight size={14} />,
  RETURN: <ArrowDownRight size={14} />,
  WITHDRAWAL: <ArrowUpRight size={14} />,
  TRANSFER: <ArrowLeftRight size={14} />,
  INVESTMENT: <ArrowUpRight size={14} />,
  FEE: <ArrowUpRight size={14} />,
}

const TX_COLOR: Record<string, string> = {
  DEPOSIT: 'bg-emerald-500/10 text-emerald-400',
  RETURN: 'bg-emerald-500/10 text-emerald-400',
  WITHDRAWAL: 'bg-red-500/10 text-red-400',
  TRANSFER: 'bg-blue-500/10 text-blue-400',
  INVESTMENT: 'bg-yellow-500/10 text-yellow-400',
  FEE: 'bg-slate-500/10 text-slate-400',
}

const CREDIT = new Set(['DEPOSIT', 'RETURN'])

interface SearchParams {
  page?: string
  type?: string
  status?: string
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const limit = 20
  const type = searchParams.type
  const status = searchParams.status

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

  const pages = Math.ceil(total / limit)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <p className="text-slate-400 text-sm mt-1">
          {total} transaction{total !== 1 ? 's' : ''} total
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <ArrowLeftRight className="mx-auto text-slate-600 mb-3" size={32} />
            <p className="text-slate-400 font-medium mb-1">No transactions found</p>
            <p className="text-slate-500 text-sm">
              Deposit funds to your wallet to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fortress-border text-left">
                    <th className="pb-3 pr-4 text-slate-400 font-medium">Type</th>
                    <th className="pb-3 pr-4 text-slate-400 font-medium">Description</th>
                    <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Amount</th>
                    <th className="pb-3 pr-4 text-slate-400 font-medium">Status</th>
                    <th className="pb-3 text-slate-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fortress-border/50">
                  {transactions.map((txn) => {
                    const isCredit = CREDIT.has(txn.type)
                    return (
                      <tr key={txn.id} className="hover:bg-fortress-steel/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${TX_COLOR[txn.type] ?? 'bg-slate-500/10 text-slate-400'}`}>
                            {TX_ICONS[txn.type]}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <p className="text-slate-200 font-medium">
                            {txn.description || txn.type.charAt(0) + txn.type.slice(1).toLowerCase()}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{txn.reference}</p>
                        </td>
                        <td className={`py-4 pr-4 text-right font-semibold ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isCredit ? '+' : '-'}{formatCurrency(Number(txn.amount))}
                        </td>
                        <td className="py-4 pr-4">
                          <Badge variant={statusBadgeVariant(txn.status)}>
                            {txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-4 text-slate-400 text-xs">
                          {formatDateTime(txn.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-fortress-border mt-4">
                <p className="text-xs text-slate-500">
                  Page {page} of {pages} — {total} total
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <a
                      href={`?page=${page - 1}${type ? `&type=${type}` : ''}${status ? `&status=${status}` : ''}`}
                      className="px-3 py-1.5 rounded-lg border border-fortress-border text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                      Previous
                    </a>
                  )}
                  {page < pages && (
                    <a
                      href={`?page=${page + 1}${type ? `&type=${type}` : ''}${status ? `&status=${status}` : ''}`}
                      className="px-3 py-1.5 rounded-lg border border-fortress-border text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                      Next
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
