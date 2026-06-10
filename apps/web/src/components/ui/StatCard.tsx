import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-fortress-navy border border-fortress-border rounded-xl p-5 flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        {icon && (
          <div className="text-fortress-accent bg-fortress-accent/10 p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-100 tracking-tight">
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
        )}
      </div>
      {trendValue && (
        <div
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium',
            trend === 'up' && 'text-emerald-400',
            trend === 'down' && 'text-red-400',
            trend === 'neutral' && 'text-slate-400'
          )}
        >
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trendValue}
        </div>
      )}
    </div>
  )
}
