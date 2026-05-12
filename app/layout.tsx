import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Wasta — Referral-Based Job Platform',
    template: '%s | Wasta',
  },
  description:
    'Wasta connects job seekers with people who can refer them for job openings. Get referred, not just applied.',
  keywords: ['job referral', 'career', 'jobs', 'hiring', 'networking'],
  openGraph: {
    title: 'Wasta — Get Referred, Not Just Applied',
    description: 'Browse jobs and request referrals from people inside companies.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
