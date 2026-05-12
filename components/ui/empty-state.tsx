import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#eeece7] flex items-center justify-center mb-4 text-[#93939f]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#17171c] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#93939f] max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
