import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Investments' }

export default async function InvestmentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const investments = await prisma.investment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  const totalPrincipal = investments.reduce((s, i) => s + Number(i.principalAmount), 0)
  const totalValue = investments.reduce((s, i) => s + Number(i.currentValue), 0)
  const totalReturn = totalValue - totalPrincipal
  const returnPct = totalPrincipal > 0 ? (totalReturn / totalPrincipal) * 100 : 0
  const activeCount = investments.filter((i) => i.status === 'ACTIVE').length

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Investments</h1>
        <p className="text-slate-400 text-sm mt-1">Track and manage your investment portfolio.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total invested"
          value={formatCurrency(totalPrincipal)}
          icon={<TrendingUp size={16} />}
          subValue={`${activeCount} active`}
        />
        <StatCard
          label="Portfolio value"
          value={formatCurrency(totalValue)}
          trend={totalReturn >= 0 ? 'up' : 'down'}
          trendValue={formatPercent(returnPct)}
        />
        <StatCard
          label="Total return"
          value={formatCurrency(totalReturn)}
          trend={totalReturn >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Positions"
          value={String(investments.length)}
          subValue={`${activeCount} active`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All positions</CardTitle>
        </CardHeader>
        {investments.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="mx-auto text-slate-600 mb-3" size={32} />
            <p className="text-slate-400 font-medium mb-1">No investments yet</p>
            <p className="text-slate-500 text-sm">
              Contact your advisor to open your first position.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fortress-border text-left">
                  <th className="pb-3 pr-4 text-slate-400 font-medium">Investment</th>
                  <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Principal</th>
                  <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Current value</th>
                  <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Return</th>
                  <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Rate p.a.</th>
                  <th className="pb-3 pr-4 text-slate-400 font-medium">Maturity</th>
                  <th className="pb-3 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fortress-border/50">
                {investments.map((inv) => {
                  const gain = Number(inv.currentValue) - Number(inv.principalAmount)
                  const gainPct = (gain / Number(inv.principalAmount)) * 100
                  return (
                    <tr key={inv.id} className="hover:bg-fortress-steel/30 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-medium text-slate-200">{inv.name}</p>
                        {inv.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{inv.description}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          Started {formatDate(inv.startDate)}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-right text-slate-300">
                        {formatCurrency(Number(inv.principalAmount))}
                      </td>
                      <td className="py-4 pr-4 text-right text-slate-200 font-medium">
                        {formatCurrency(Number(inv.currentValue))}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div
                          className={`flex items-center justify-end gap-1 font-medium ${
                            gain >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {gain >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {formatPercent(gainPct)}
                        </div>
                        <p className="text-xs text-slate-500">{formatCurrency(gain)}</p>
                      </td>
                      <td className="py-4 pr-4 text-right text-slate-300">
                        {Number(inv.returnRate)}%
                      </td>
                      <td className="py-4 pr-4 text-slate-400 text-xs">
                        {inv.maturityDate ? formatDate(inv.maturityDate) : '—'}
                      </td>
                      <td className="py-4">
                        <Badge variant={statusBadgeVariant(inv.status)}>
                          {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
