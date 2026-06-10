'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-fortress-midnight flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-fortress-navy border-r border-fortress-border flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-fortress-accent/10 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fortress-accent to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-white font-semibold text-xl">Fortress</span>
        </Link>

        <div className="relative z-10">
          <p className="font-display text-4xl font-bold text-white leading-snug mb-4">
            Your capital,<br />
            <span className="text-gradient">always working.</span>
          </p>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Institutional wealth management infrastructure, available to every investor.
          </p>
        </div>

        <div className="flex gap-8 relative z-10">
          {[
            { value: '99.97%', label: 'Uptime' },
            { value: '$4.2B+', label: 'AUM' },
            { value: '256-bit', label: 'Encryption' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-fortress-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-semibold">Fortress</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your account to continue.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              leftIcon={<Mail size={16} />}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              leftIcon={<Lock size={16} />}
              required
            />

            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-fortress-accent hover:text-blue-400 font-medium transition-colors">
              Open one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
