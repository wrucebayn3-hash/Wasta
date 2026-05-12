'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'coral'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4c6ee6] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary: 'bg-[#17171c] text-white hover:bg-[#000000] active:scale-[0.98]',
    secondary: 'bg-transparent text-[#17171c] underline underline-offset-2 hover:text-[#1863dc] rounded-none',
    outline: 'border border-[#17171c] text-[#17171c] bg-transparent hover:bg-[#17171c] hover:text-white active:scale-[0.98]',
    ghost: 'bg-transparent text-[#17171c] hover:bg-[#eeece7] rounded-lg',
    danger: 'bg-[#b30000] text-white hover:bg-red-800 active:scale-[0.98]',
    coral: 'bg-[#ff7759] text-white hover:bg-[#e85c3a] active:scale-[0.98]',
  }

  const sizes = {
    sm: 'text-xs px-4 py-2 h-8',
    md: 'text-sm px-6 py-2.5 h-10',
    lg: 'text-base px-8 py-3 h-12',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
