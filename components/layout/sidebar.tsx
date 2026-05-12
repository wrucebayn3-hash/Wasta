'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

interface SidebarProps {
  items: NavItem[]
  title?: string
  footer?: React.ReactNode
}

export function Sidebar({ items, title, footer }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#f2f2f2] min-h-screen flex flex-col">
      {title && (
        <div className="px-6 py-5 border-b border-[#f2f2f2]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#93939f]">
            {title}
          </h2>
        </div>
      )}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-[#17171c] text-white'
                  : 'text-[#75758a] hover:bg-[#eeece7] hover:text-[#17171c]'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cn(
                    'ml-auto text-xs font-medium px-2 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#ff7759]/20 text-[#ff7759]'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      {footer && (
        <div className="px-3 py-4 border-t border-[#f2f2f2]">{footer}</div>
      )}
    </aside>
  )
}
