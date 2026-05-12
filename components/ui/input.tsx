import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
}

export function Input({ label, error, hint, leftIcon, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#17171c]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#17171c] placeholder:text-[#93939f] transition-all',
            'border-[#d9d9dd] focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20 focus:outline-none',
            error && 'border-[#b30000] focus:border-[#b30000] focus:ring-[#b30000]/20',
            leftIcon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-[#93939f]">{hint}</p>}
      {error && <p className="text-xs text-[#b30000]">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#17171c]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#17171c] placeholder:text-[#93939f] transition-all resize-y min-h-[100px]',
          'border-[#d9d9dd] focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20 focus:outline-none',
          error && 'border-[#b30000] focus:border-[#b30000] focus:ring-[#b30000]/20',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[#93939f]">{hint}</p>}
      {error && <p className="text-xs text-[#b30000]">{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, hint, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#17171c]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#17171c] transition-all appearance-none cursor-pointer',
          'border-[#d9d9dd] focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20 focus:outline-none',
          error && 'border-[#b30000]',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-xs text-[#93939f]">{hint}</p>}
      {error && <p className="text-xs text-[#b30000]">{error}</p>}
    </div>
  )
}
