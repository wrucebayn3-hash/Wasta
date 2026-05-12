'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Bell, ChevronDown, Briefcase, LogOut, User, Settings } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const publicLinks = [
  { href: '/jobs', label: 'Browse Jobs' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const user = session?.user
  const role = user?.role

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin'
    if (role === 'POSTER') return '/poster/dashboard'
    if (role === 'BOTH') return '/seeker/dashboard'
    return '/seeker/dashboard'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-[#f2f2f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#17171c] rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-xl text-[#17171c]">Wasta</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#75758a] hover:text-[#17171c] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/notifications"
                  className="p-2 rounded-full hover:bg-[#eeece7] transition-colors relative"
                >
                  <Bell size={18} className="text-[#75758a]" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#eeece7] transition-colors"
                  >
                    <Avatar name={user.name} image={user.image} size="sm" />
                    <ChevronDown size={14} className="text-[#75758a]" />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#f2f2f2] rounded-[16px] shadow-lg z-20 py-2">
                        <div className="px-4 py-2 border-b border-[#f2f2f2]">
                          <p className="text-sm font-medium text-[#17171c]">{user.name}</p>
                          <p className="text-xs text-[#93939f]">{user.email}</p>
                        </div>
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#17171c] hover:bg-[#eeece7] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={16} />
                          Dashboard
                        </Link>
                        {(role === 'BOTH') && (
                          <Link
                            href="/poster/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#17171c] hover:bg-[#eeece7] transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Briefcase size={16} />
                            Poster Dashboard
                          </Link>
                        )}
                        <Link
                          href={role === 'POSTER' ? '/poster/profile' : '/seeker/profile'}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#17171c] hover:bg-[#eeece7] transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={16} />
                          Profile Settings
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#b30000] hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#eeece7] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#f2f2f2] bg-white">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm text-[#75758a] hover:text-[#17171c] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#f2f2f2] flex flex-col gap-2">
              {user ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[#b30000]"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
