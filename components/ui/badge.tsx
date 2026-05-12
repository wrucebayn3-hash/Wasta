import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'coral' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#eeece7] text-[#17171c]',
    success: 'bg-[#edfce9] text-[#003c33]',
    warning: 'bg-amber-50 text-amber-800',
    danger: 'bg-red-50 text-[#b30000]',
    info: 'bg-[#f1f5ff] text-[#1863dc]',
    coral: 'bg-[#ffad9b] text-[#17171c] border border-[#ff7759]',
    outline: 'border border-[#d9d9dd] text-[#75758a] bg-transparent',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    ACCEPTED: { label: 'Accepted', variant: 'success' },
    REJECTED: { label: 'Rejected', variant: 'danger' },
    REFERRED: { label: 'Referred', variant: 'info' },
    CLOSED: { label: 'Closed', variant: 'outline' },
    ACTIVE: { label: 'Active', variant: 'success' },
    PAUSED: { label: 'Paused', variant: 'warning' },
    DRAFT: { label: 'Draft', variant: 'outline' },
  }

  const config = map[status] ?? { label: status, variant: 'default' as const }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
