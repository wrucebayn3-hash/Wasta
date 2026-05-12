import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function NotificationsRedirectPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin')
  if (session.user.role === 'POSTER') redirect('/poster/notifications')
  redirect('/seeker/notifications')
}
