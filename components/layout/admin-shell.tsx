'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitPullRequest,
  BarChart2,
  Tag,
  Activity,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { UserRole } from '@prisma/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/referrals', label: 'Referrals', icon: GitPullRequest },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart2 },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/activity', label: 'Activity Logs', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminShellProps {
  user: { id: string; name: string; email: string; image?: string | null; role: UserRole }
  children: React.ReactNode
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#eeece7]">
      <div className="fixed left-0 top-0 h-full z-30">
        <div className="flex flex-col h-full bg-[#071829] w-64">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff7759] rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display font-semibold text-lg text-white">Wasta</span>
                <span className="ml-2 text-xs text-[#93939f]">Admin</span>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3 px-2">
              <Avatar name={user.name} image={user.image} size="sm" className="ring-2 ring-[#ff7759]/30" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-[#93939f]">Platform Admin</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#ff7759] text-white'
                      : 'text-[#93939f] hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <main className="flex-1 ml-64 p-6 md:p-8">{children}</main>
    </div>
  )
}
