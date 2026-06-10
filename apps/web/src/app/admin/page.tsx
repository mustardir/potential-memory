import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Users, TrendingUp, Wallet, ArrowLeftRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin' }

export default async function AdminPage() {
  let admin
  try {
    admin = await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const [
    totalUsers,
    activeUsers,
    totalTransactions,
    totalVolume,
    totalInvested,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    }),
    prisma.investment.aggregate({
      _sum: { principalAmount: true },
      where: { status: 'ACTIVE' },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        wallet: { select: { balance: true } },
        _count: { select: { transactions: true, investments: true } },
      },
    }),
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Logged in as <span className="text-fortress-accent">{admin.email}</span>
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
          <p className="text-xs text-red-400 font-medium">Admin access</p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total users"
          value={String(totalUsers)}
          icon={<Users size={16} />}
          subValue={`${activeUsers} active`}
          trend="up"
          trendValue="Platform users"
        />
        <StatCard
          label="Total transactions"
          value={String(totalTransactions)}
          icon={<ArrowLeftRight size={16} />}
        />
        <StatCard
          label="Transaction volume"
          value={formatCurrency(Number(totalVolume._sum.amount ?? 0))}
          icon={<Wallet size={16} />}
          subValue="Completed only"
        />
        <StatCard
          label="Total AUM"
          value={formatCurrency(Number(totalInvested._sum.principalAmount ?? 0))}
          icon={<TrendingUp size={16} />}
          subValue="Active investments"
        />
      </div>

      {/* User table */}
      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            {totalUsers} registered account{totalUsers !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fortress-border text-left">
                <th className="pb-3 pr-4 text-slate-400 font-medium">User</th>
                <th className="pb-3 pr-4 text-slate-400 font-medium">Role</th>
                <th className="pb-3 pr-4 text-slate-400 font-medium">Status</th>
                <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Balance</th>
                <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Transactions</th>
                <th className="pb-3 pr-4 text-slate-400 font-medium text-right">Investments</th>
                <th className="pb-3 text-slate-400 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fortress-border/50">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-fortress-steel/30 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-fortress-accent/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-fortress-accent">
                          {u.firstName[0]}{u.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge variant={u.role === 'ADMIN' || u.role === 'SUPERADMIN' ? 'info' : 'neutral'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-1">
                      <Badge variant={statusBadgeVariant(u.status)}>
                        {u.status}
                      </Badge>
                      {u.emailVerified && (
                        <span className="text-xs text-emerald-500">✓ Email verified</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-right font-medium text-slate-200">
                    {formatCurrency(Number(u.wallet?.balance ?? 0))}
                  </td>
                  <td className="py-4 pr-4 text-right text-slate-400">
                    {u._count.transactions}
                  </td>
                  <td className="py-4 pr-4 text-right text-slate-400">
                    {u._count.investments}
                  </td>
                  <td className="py-4 text-slate-400 text-xs">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
