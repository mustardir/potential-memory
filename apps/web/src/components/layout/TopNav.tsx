'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Menu, X, LayoutDashboard, Wallet, TrendingUp,
  ArrowLeftRight, Settings, LogOut, Shield,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Wallet', href: '/wallet', icon: <Wallet size={18} /> },
  { label: 'Investments', href: '/investments', icon: <TrendingUp size={18} /> },
  { label: 'Transactions', href: '/transactions', icon: <ArrowLeftRight size={18} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
]

interface TopNavProps {
  user: { firstName: string; lastName: string; role: string }
}

export function TopNav({ user }: TopNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const items = [
    ...navItems,
    ...(user.role === 'ADMIN' || user.role === 'SUPERADMIN'
      ? [{ label: 'Admin', href: '/admin', icon: <Shield size={18} /> }]
      : []),
  ]

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-fortress-navy/95 backdrop-blur border-b border-fortress-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-fortress-accent to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <span className="text-white font-semibold text-sm">Fortress</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="px-4 pb-4 space-y-1 border-t border-fortress-border pt-3">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  active
                    ? 'bg-fortress-accent/15 text-fortress-accent'
                    : 'text-slate-400 hover:text-white hover:bg-fortress-steel'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </nav>
      )}
    </header>
  )
}
