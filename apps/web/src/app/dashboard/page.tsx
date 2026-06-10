import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import {
  Wallet, TrendingUp, ArrowLeftRight, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [wallet, investments, recentTxns] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: user.id } }),
    prisma.investment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ])

  const totalInvested = investments.reduce(
    (s, i) => s + Number(i.principalAmount), 0
  )
  const totalCurrentValue = investments.reduce(
    (s, i) => s + Number(i.currentValue), 0
  )
  const totalGain = totalCurrentValue - totalInvested
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, {user.firstName}.
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here&apos;s your portfolio at a glance.
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-fortress-navy border border-fortress-border px-3 py-1 rounded-full">
          {formatDate(new Date())}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Wallet balance"
          value={formatCurrency(Number(wallet?.balance ?? 0))}
          icon={<Wallet size={16} />}
          trend="neutral"
          trendValue="Available to invest"
        />
        <StatCard
          label="Total invested"
          value={formatCurrency(totalInvested)}
          icon={<TrendingUp size={16} />}
          subValue={`${investments.length} active position${investments.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Portfolio value"
          value={formatCurrency(totalCurrentValue)}
          trend={totalGain >= 0 ? 'up' : 'down'}
          trendValue={`${formatPercent(totalGainPct)} all time`}
        />
        <StatCard
          label="Total return"
          value={formatCurrency(totalGain)}
          trend={totalGain >= 0 ? 'up' : 'down'}
          trendValue={totalGain >= 0 ? 'Profitable' : 'Unrealised loss'}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent transactions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent transactions</CardTitle>
              <Link
                href="/transactions"
                className="text-xs text-fortress-accent hover:text-blue-400 flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          {recentTxns.length === 0 ? (
            <div className="text-center py-10">
              <ArrowLeftRight className="mx-auto text-slate-600 mb-3" size={28} />
              <p className="text-slate-500 text-sm">No transactions yet</p>
              <Link href="/wallet" className="text-xs text-fortress-accent mt-2 inline-block">
                Fund your wallet →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-fortress-steel/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        txn.type === 'DEPOSIT' || txn.type === 'RETURN'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {txn.type === 'DEPOSIT' || txn.type === 'RETURN' ? (
                        <ArrowDownRight size={14} />
                      ) : (
                        <ArrowUpRight size={14} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {txn.description || txn.type.charAt(0) + txn.type.slice(1).toLowerCase()}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(txn.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        txn.type === 'DEPOSIT' || txn.type === 'RETURN'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {txn.type === 'DEPOSIT' || txn.type === 'RETURN' ? '+' : '-'}
                      {formatCurrency(Number(txn.amount))}
                    </p>
                    <Badge variant={statusBadgeVariant(txn.status)}>
                      {txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active investments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active investments</CardTitle>
              <Link
                href="/investments"
                className="text-xs text-fortress-accent hover:text-blue-400 flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          {investments.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp className="mx-auto text-slate-600 mb-3" size={28} />
              <p className="text-slate-500 text-sm">No active investments</p>
              <Link href="/investments" className="text-xs text-fortress-accent mt-2 inline-block">
                Explore options →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((inv) => {
                const gain = Number(inv.currentValue) - Number(inv.principalAmount)
                const gainPct = (gain / Number(inv.principalAmount)) * 100
                return (
                  <div
                    key={inv.id}
                    className="p-3 rounded-lg bg-fortress-steel/40 border border-fortress-border/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-slate-200">{inv.name}</p>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Current value</p>
                        <p className="text-base font-bold text-slate-100">
                          {formatCurrency(Number(inv.currentValue))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${gainPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {formatPercent(gainPct)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {Number(inv.returnRate)}% p.a.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
