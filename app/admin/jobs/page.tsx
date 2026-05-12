import { db } from '@/lib/db'
import { Search } from 'lucide-react'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { formatDate, WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/lib/utils'
import { AdminJobActions } from '@/components/admin/job-actions'
import type { JobStatus } from '@prisma/client'

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string }
}) {
  const where: Record<string, unknown> = {}
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { company: { contains: searchParams.q } },
    ]
  }
  if (searchParams.status) {
    where.status = searchParams.status as JobStatus
  }

  const jobs = await db.job.findMany({
    where,
    include: {
      poster: { select: { id: true, name: true, email: true } },
      _count: { select: { referralRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Job Management</h1>
        <p className="text-sm text-[#93939f] mt-1">{jobs.length} jobs</p>
      </div>

      <form method="GET" className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search by title or company..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none focus:border-[#9b60aa]"
          />
        </div>
        <select
          name="status"
          defaultValue={searchParams.status || ''}
          className="px-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="CLOSED">Closed</option>
          <option value="DRAFT">Draft</option>
        </select>
        <button type="submit" className="px-5 py-2.5 bg-[#17171c] text-white rounded-[32px] text-sm font-medium">
          Filter
        </button>
      </form>

      <div className="bg-white rounded-[22px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f2f2f2]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Job</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Poster</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Requests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Posted</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#93939f]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f2]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#eeece7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#17171c]">{job.title}</p>
                    <p className="text-xs text-[#93939f]">{job.company} · {job.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#17171c]">{job.poster.name}</p>
                    <p className="text-xs text-[#93939f]">{job.poster.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#93939f]">
                    <p>{WORK_MODE_LABELS[job.workMode]}</p>
                    <p>{JOB_TYPE_LABELS[job.jobType]}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#17171c]">{job._count.referralRequests}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#93939f]">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AdminJobActions jobId={job.id} currentStatus={job.status} />
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
