import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#17171c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-[#17171c]" />
              </div>
              <span className="font-display font-semibold text-xl">Wasta</span>
            </Link>
            <p className="text-sm text-[#93939f] leading-relaxed">
              Referral-based hiring for the modern workforce. Get referred, not just applied.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/jobs', label: 'Browse Jobs' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/signup', label: 'Get Started' },
                { href: '/about', label: 'About Wasta' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#93939f] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">For Users</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/signup?role=SEEKER', label: 'Job Seekers' },
                { href: '/signup?role=POSTER', label: 'Job Posters' },
                { href: '/seeker/dashboard', label: 'Seeker Dashboard' },
                { href: '/poster/dashboard', label: 'Poster Dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#93939f] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Contact Us' },
                { href: '#', label: 'Help Center' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#93939f] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#93939f]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#93939f]">
            © {new Date().getFullYear()} Wasta. All rights reserved.
          </p>
          <p className="text-xs text-[#93939f]">
            Making referrals simple, transparent, and manageable.
          </p>
        </div>
      </div>
    </footer>
  )
}
