import { cn } from '@/lib/utils'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'stone' | 'dark' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, variant = 'default', padding = 'md', className, ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-[#f2f2f2]',
    stone: 'bg-[#eeece7]',
    dark: 'bg-[#17171c] text-white',
    bordered: 'bg-white border border-[#d9d9dd]',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn('rounded-[22px]', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  icon?: ReactNode
  accent?: 'default' | 'green' | 'blue' | 'coral'
}

export function StatCard({ label, value, change, icon, accent = 'default' }: StatCardProps) {
  const accents = {
    default: 'bg-[#eeece7]',
    green: 'bg-[#edfce9]',
    blue: 'bg-[#f1f5ff]',
    coral: 'bg-[#ffad9b]/30',
  }

  return (
    <div className="bg-white border border-[#f2f2f2] rounded-[22px] p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#93939f]">{label}</span>
        {icon && (
          <span className={cn('p-2 rounded-lg', accents[accent])}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-display font-semibold text-[#17171c]">{value}</div>
        {change && (
          <div className="text-xs text-[#93939f] mt-1">{change}</div>
        )}
      </div>
    </div>
  )
}
