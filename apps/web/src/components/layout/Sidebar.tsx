'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Wallet', href: '/wallet', icon: <Wallet size={18} /> },
  { label: 'Investments', href: '/investments', icon: <TrendingUp size={18} /> },
  { label: 'Transactions', href: '/transactions', icon: <ArrowLeftRight size={18} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
  { label: 'Admin', href: '/admin', icon: <Shield size={18} />, adminOnly: true },
]

interface SidebarProps {
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const displayItems = navItems.filter(
    (item) => !item.adminOnly || user.role === 'ADMIN' || user.role === 'SUPERADMIN'
  )

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-fortress-navy border-r border-fortress-border min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-fortress-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fortress-accent to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-semibold tracking-tight">Fortress</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {displayItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-fortress-accent/15 text-fortress-accent'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-fortress-steel'
              )}
            >
              <span className={cn(active ? 'text-fortress-accent' : 'text-slate-500 group-hover:text-slate-300')}>
                {item.icon}
              </span>
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto text-fortress-accent" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-fortress-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-fortress-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-fortress-accent text-xs font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
