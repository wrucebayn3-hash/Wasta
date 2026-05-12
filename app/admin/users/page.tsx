import { db } from '@/lib/db'
import { Search, Users, ShieldCheck, Ban, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { AdminUserActions } from '@/components/admin/user-actions'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string }
}) {
  const where: Record<string, unknown> = { role: { not: 'ADMIN' } }
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { email: { contains: searchParams.q } },
    ]
  }
  if (searchParams.role) {
    where.role = searchParams.role
  }

  const users = await db.user.findMany({
    where,
    include: {
      profile: { select: { currentCompany: true, currentRole: true } },
      _count: { select: { postedJobs: true, sentRequests: true, receivedRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">User Management</h1>
        <p className="text-sm text-[#93939f] mt-1">{users.length} users</p>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none focus:border-[#9b60aa]"
          />
        </div>
        <select
          name="role"
          defaultValue={searchParams.role || ''}
          className="px-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none bg-white"
        >
          <option value="">All Roles</option>
          <option value="SEEKER">Job Seeker</option>
          <option value="POSTER">Job Poster</option>
          <option value="BOTH">Both</option>
        </select>
        <button type="submit" className="px-5 py-2.5 bg-[#17171c] text-white rounded-[32px] text-sm font-medium">
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-[22px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f2f2f2]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#93939f]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f2]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#eeece7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} image={user.image} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[#17171c]">{user.name}</p>
                        <p className="text-xs text-[#93939f]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'POSTER' ? 'info' : user.role === 'BOTH' ? 'coral' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#93939f]">
                    <div className="space-y-0.5">
                      <p>{user._count.postedJobs} jobs posted</p>
                      <p>{user._count.sentRequests} requests sent</p>
                      <p>{user._count.receivedRequests} requests received</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isSuspended ? (
                      <Badge variant="danger">Suspended</Badge>
                    ) : user.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#93939f]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AdminUserActions userId={user.id} isSuspended={user.isSuspended} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
