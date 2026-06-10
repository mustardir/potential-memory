import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
  neutral: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function statusBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    COMPLETED: 'success',
    ACTIVE: 'success',
    PENDING: 'warning',
    FAILED: 'danger',
    CANCELLED: 'danger',
    SUSPENDED: 'danger',
    MATURED: 'info',
  }
  return map[status] ?? 'neutral'
}
