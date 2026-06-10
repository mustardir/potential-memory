'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Wallet, ArrowUpRight, ArrowDownRight, Lock, DollarSign } from 'lucide-react'

interface WalletData {
  id: string
  balance: number
  currency: string
  isLocked: boolean
  transactions: TransactionData[]
}

interface TransactionData {
  id: string
  type: string
  status: string
  amount: number
  description: string | null
  createdAt: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<'deposit' | 'withdraw' | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet')
      const data = await res.json()
      if (data.success) setWallet(data.data.wallet)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWallet() }, [fetchWallet])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!action) return
    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          amount: parseFloat(amount),
          description: description || undefined,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.data.message })
        setAmount('')
        setDescription('')
        setAction(null)
        fetchWallet()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-fortress-steel rounded w-48" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-fortress-navy rounded-xl" />
          <div className="h-32 bg-fortress-navy rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your funds and transactions.</p>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard
          label="Available balance"
          value={formatCurrency(Number(wallet?.balance ?? 0))}
          icon={<Wallet size={16} />}
          trend="neutral"
          trendValue={wallet?.currency ?? 'USD'}
        />
        <div className="bg-fortress-navy border border-fortress-border rounded-xl p-5 flex flex-col gap-3">
          <p className="text-sm text-slate-400 font-medium">Wallet status</p>
          <div className="flex items-center gap-2 mt-1">
            {wallet?.isLocked ? (
              <>
                <Lock size={16} className="text-red-400" />
                <span className="text-red-400 font-medium">Locked</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-emerald-400 font-medium">Active</span>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => setAction(action === 'deposit' ? null : 'deposit')}
              variant={action === 'deposit' ? 'primary' : 'outline'}
              size="sm"
              disabled={wallet?.isLocked}
            >
              <ArrowDownRight size={14} />
              Deposit
            </Button>
            <Button
              onClick={() => setAction(action === 'withdraw' ? null : 'withdraw')}
              variant={action === 'withdraw' ? 'primary' : 'outline'}
              size="sm"
              disabled={wallet?.isLocked}
            >
              <ArrowUpRight size={14} />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {action && (
        <Card>
          <CardHeader>
            <CardTitle>
              {action === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            <Input
              label="Amount (USD)"
              type="number"
              min="10"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<DollarSign size={16} />}
              hint={action === 'withdraw' ? `Available: ${formatCurrency(Number(wallet?.balance ?? 0))}` : undefined}
              required
            />
            <Input
              label="Description (optional)"
              placeholder="e.g. Monthly savings"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>
                Confirm {action}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setAction(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        {!wallet?.transactions?.length ? (
          <p className="text-slate-500 text-sm py-8 text-center">No transactions yet.</p>
        ) : (
          <div className="space-y-1">
            {wallet.transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-fortress-steel/40 transition-colors"
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
                      {txn.description || txn.type}
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
    </div>
  )
}
