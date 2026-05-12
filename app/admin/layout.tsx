import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminShell } from '@/components/layout/admin-shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/admin/login')
  return <AdminShell user={session.user}>{children}</AdminShell>
}
