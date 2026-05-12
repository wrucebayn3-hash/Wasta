import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Send, MapPin, Briefcase } from 'lucide-react'
import { formatDate, WORK_MODE_LABELS } from '@/lib/utils'

export default async function SeekerReferralsPage() {
  const session = await auth()
  const referrals = await db.referralRequest.findMany({
    where: { seekerId: session!.user.id },
    include: {
      job: true,
      referrer: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusGroups = {
    PENDING: referrals.filter((r) => r.status === 'PENDING'),
    ACCEPTED: referrals.filter((r) => r.status === 'ACCEPTED'),
    REFERRED: referrals.filter((r) => r.status === 'REFERRED'),
    REJECTED: referrals.filter((r) => r.status === 'REJECTED'),
    CLOSED: referrals.filter((r) => r.status === 'CLOSED'),
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">My Referral Requests</h1>
        <p className="text-sm text-[#93939f] mt-1">Track all your referral requests in one place</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Pending', count: statusGroups.PENDING.length, color: 'bg-amber-50 text-amber-700' },
          { label: 'Accepted', count: statusGroups.ACCEPTED.length, color: 'bg-[#edfce9] text-[#003c33]' },
          { label: 'Referred', count: statusGroups.REFERRED.length, color: 'bg-[#f1f5ff] text-[#1863dc]' },
          { label: 'Rejected', count: statusGroups.REJECTED.length, color: 'bg-red-50 text-[#b30000]' },
          { label: 'Closed', count: statusGroups.CLOSED.length, color: 'bg-[#eeece7] text-[#75758a]' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-semibold font-display">{s.count}</div>
            <div className="text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral list */}
      {referrals.length === 0 ? (
        <EmptyState
          icon={<Send size={24} />}
          title="No referral requests yet"
          description="Start by browsing jobs and requesting referrals from job posters."
          action={
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {referrals.map((req) => (
            <div key={req.id} className="bg-white rounded-[22px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <StatusBadge status={req.status} />
                    <span className="text-xs text-[#93939f]">
                      {formatDate(req.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#17171c] mb-1">{req.job.title}</h3>
                  <p className="text-sm text-[#75758a] mb-3">{req.job.company}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-[#93939f]">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {req.job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {WORK_MODE_LABELS[req.job.workMode]}
                    </span>
                  </div>

                  {req.message && (
                    <div className="mt-4 p-3 bg-[#eeece7] rounded-lg">
                      <p className="text-xs text-[#93939f] mb-1">Your message:</p>
                      <p className="text-sm text-[#17171c] line-clamp-2">{req.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={req.referrer.name} image={req.referrer.image} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-[#17171c]">{req.referrer.name}</p>
                      <p className="text-xs text-[#93939f]">Referrer</p>
                    </div>
                  </div>
                  <Link href={`/jobs/${req.jobId}`}>
                    <Button variant="outline" size="sm">View Job</Button>
                  </Link>
                </div>
              </div>

              {req.notes && (
                <div className="mt-4 p-4 bg-[#f1f5ff] rounded-xl border border-[#1863dc]/10">
                  <p className="text-xs font-medium text-[#1863dc] mb-1">Note from referrer:</p>
                  <p className="text-sm text-[#17171c]">{req.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
