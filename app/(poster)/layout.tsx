import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PosterShell } from '@/components/layout/poster-shell'

export default async function PosterLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin')
  if (session.user.role === 'SEEKER') redirect('/seeker/dashboard')

  return <PosterShell user={session.user}>{children}</PosterShell>
}
