'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, LayoutDashboard, PlusCircle, List, Inbox, Bell, User, LogOut, Search } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { UserRole } from '@prisma/client'

const navItems = [
  { href: '/poster/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/poster/jobs/new', label: 'Post a Job', icon: PlusCircle },
  { href: '/poster/jobs', label: 'My Posted Jobs', icon: List },
  { href: '/poster/requests', label: 'Referral Requests', icon: Inbox },
  { href: '/poster/profile', label: 'Profile', icon: User },
  { href: '/poster/notifications', label: 'Notifications', icon: Bell },
]

interface PosterShellProps {
  user: { id: string; name: string; email: string; image?: string | null; role: UserRole }
  children: React.ReactNode
}

export function PosterShell({ user, children }: PosterShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#eeece7]">
      <div className="fixed left-0 top-0 h-full z-30">
        <div className="flex flex-col h-full bg-[#17171c] w-64">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-[#17171c]" />
              </div>
              <span className="font-display font-semibold text-lg text-white">Wasta</span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3 px-2">
              <Avatar name={user.name} image={user.image} size="sm" className="ring-2 ring-white/20" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-[#93939f] truncate">Job Poster</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white text-[#17171c]'
                      : 'text-[#93939f] hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            {user.role === 'BOTH' && (
              <Link
                href="/seeker/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#93939f] hover:bg-white/10 hover:text-white transition-colors"
              >
                <Search size={18} />
                Switch to Seeker
              </Link>
            )}
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
