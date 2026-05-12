import { db } from '@/lib/db'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import type { ReferralStatus } from '@prisma/client'

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const where: Record<string, unknown> = {}
  if (searchParams.status) {
    where.status = searchParams.status as ReferralStatus
  }

  const referrals = await db.referralRequest.findMany({
    where,
    include: {
      job: { select: { id: true, title: true, company: true } },
      seeker: { select: { id: true, name: true, image: true, email: true } },
      referrer: { select: { id: true, name: true, image: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Referral Requests</h1>
        <p className="text-sm text-[#93939f] mt-1">{referrals.length} total requests</p>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['', 'PENDING', 'ACCEPTED', 'REJECTED', 'REFERRED', 'CLOSED'].map((status) => (
          <a
            key={status}
            href={status ? `?status=${status}` : '/admin/referrals'}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              searchParams.status === status || (!searchParams.status && !status)
                ? 'bg-[#17171c] text-white border-[#17171c]'
                : 'border-[#d9d9dd] text-[#75758a] hover:border-[#17171c]'
            }`}
          >
            {status || 'All'}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-[22px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f2f2f2]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Job Seeker</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Job</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Referrer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#93939f]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2f2f2]">
              {referrals.map((req) => (
                <tr key={req.id} className="hover:bg-[#eeece7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.seeker.name} image={req.seeker.image} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[#17171c]">{req.seeker.name}</p>
                        <p className="text-xs text-[#93939f]">{req.seeker.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#17171c]">{req.job.title}</p>
                    <p className="text-xs text-[#93939f]">{req.job.company}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={req.referrer.name} image={req.referrer.image} size="xs" />
                      <p className="text-sm text-[#17171c]">{req.referrer.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#93939f]">
                    {formatDate(req.createdAt)}
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
