import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SeekerShell } from '@/components/layout/seeker-shell'

export default async function SeekerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin')
  if (session.user.role === 'POSTER') redirect('/poster/dashboard')

  return <SeekerShell user={session.user}>{children}</SeekerShell>
}
