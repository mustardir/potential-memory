'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [key]: e.target.value })
        if (errors[key]) setErrors({ ...errors, [key]: '' })
      },
      error: errors[key],
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(data.errors)) {
            fieldErrors[key] = (msgs as string[])[0]
          }
          setErrors(fieldErrors)
        } else {
          setGlobalError(data.error || 'Registration failed.')
        }
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setGlobalError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-fortress-midnight flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account created!</h2>
          <p className="text-slate-400 text-sm">Redirecting you to sign in…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-fortress-midnight flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-fortress-navy border-r border-fortress-border flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-fortress-gold/5 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fortress-accent to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-white font-semibold text-xl">Fortress</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <p className="font-display text-4xl font-bold text-white leading-snug">
            Open your<br />
            <span className="text-gradient">Fortress account.</span>
          </p>
          <div className="space-y-3">
            {[
              'No minimum deposit to get started',
              'Zero management fees for the first year',
              'Bank-grade security from day one',
              'Access to institutional-grade investments',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="text-fortress-gold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs relative z-10">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
          Capital at risk. Past performance is not indicative of future results.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-fortress-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-semibold">Fortress</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-8">Takes less than two minutes.</p>

          {globalError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-sm text-red-400">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="firstName"
                label="First name"
                placeholder="Jane"
                autoComplete="given-name"
                leftIcon={<User size={16} />}
                {...field('firstName')}
                required
              />
              <Input
                id="lastName"
                label="Last name"
                placeholder="Smith"
                autoComplete="family-name"
                {...field('lastName')}
                required
              />
            </div>
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              leftIcon={<Mail size={16} />}
              {...field('email')}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min 8 chars with uppercase, number & symbol"
              autoComplete="new-password"
              leftIcon={<Lock size={16} />}
              {...field('password')}
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              leftIcon={<Lock size={16} />}
              {...field('confirmPassword')}
              required
            />

            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-fortress-accent hover:text-blue-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
