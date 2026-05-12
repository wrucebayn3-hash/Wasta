'use client'

import Link from 'next/link'
import { Briefcase, LayoutDashboard, Search, BookmarkIcon, Bell, User, LogOut, Send } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Sidebar } from './sidebar'
import { Avatar } from '@/components/ui/avatar'
import type { UserRole } from '@prisma/client'

const navItems = [
  { href: '/seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Browse Jobs', icon: Search },
  { href: '/seeker/referrals', label: 'My Referrals', icon: Send },
  { href: '/seeker/saved', label: 'Saved Jobs', icon: BookmarkIcon },
  { href: '/seeker/profile', label: 'Profile', icon: User },
  { href: '/seeker/notifications', label: 'Notifications', icon: Bell },
]

interface SeekerShellProps {
  user: { id: string; name: string; email: string; image?: string | null; role: UserRole }
  children: React.ReactNode
}

export function SeekerShell({ user, children }: SeekerShellProps) {
  const footer = (
    <div className="space-y-2">
      {user.role === 'BOTH' && (
        <Link
          href="/poster/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#75758a] hover:bg-[#eeece7] hover:text-[#17171c] transition-colors"
        >
          <Briefcase size={18} />
          Switch to Poster
        </Link>
      )}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#b30000] hover:bg-red-50 transition-colors w-full"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#eeece7]">
      <div className="fixed left-0 top-0 h-full z-30">
        <div className="flex flex-col h-full bg-white border-r border-[#f2f2f2] w-64">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#f2f2f2]">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#17171c] rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
              </div>
              <span className="font-display font-semibold text-lg text-[#17171c]">Wasta</span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-[#f2f2f2]">
            <div className="flex items-center gap-3 px-2">
              <Avatar name={user.name} image={user.image} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#17171c] truncate">{user.name}</p>
                <p className="text-xs text-[#93939f] truncate">Job Seeker</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-[#f2f2f2]">{footer}</div>
        </div>
      </div>
      <main className="flex-1 ml-64 p-6 md:p-8">{children}</main>
    </div>
  )
}

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: typeof LayoutDashboard }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#75758a] hover:bg-[#eeece7] hover:text-[#17171c] transition-colors"
    >
      <Icon size={18} />
      {label}
    </Link>
  )
}
