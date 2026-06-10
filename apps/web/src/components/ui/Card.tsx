import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  className?: string
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-fortress-navy border border-fortress-border',
    elevated: 'bg-fortress-steel border border-fortress-border shadow-xl shadow-black/30',
    bordered: 'bg-transparent border border-fortress-border',
  }

  return (
    <div
      className={cn('rounded-xl p-6', variants[variant], className)}
      {...props}
    />
  )
}

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

interface ParaProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn('text-lg font-semibold text-slate-100', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: ParaProps) {
  return (
    <p className={cn('text-sm text-slate-400 mt-1', className)} {...props} />
  )
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-fortress-border', className)}
      {...props}
    />
  )
}
