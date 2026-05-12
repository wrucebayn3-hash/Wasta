import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate, timeAgo } from '@/lib/utils'
import { ReferralActions } from '@/components/referrals/referral-actions'

export default async function PosterRequestsPage() {
  const session = await auth()
  const requests = await db.referralRequest.findMany({
    where: { referrerId: session!.user.id },
    include: {
      job: { select: { id: true, title: true, company: true } },
      seeker: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const pending = requests.filter((r) => r.status === 'PENDING')
  const active = requests.filter((r) => ['ACCEPTED', 'REFERRED'].includes(r.status))
  const closed = requests.filter((r) => ['REJECTED', 'CLOSED'].includes(r.status))

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Referral Requests</h1>
        <p className="text-sm text-[#93939f] mt-1">
          {requests.length} total · {pending.length} pending
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Inbox size={24} />}
          title="No referral requests yet"
          description="Post a job to start receiving referral requests from job seekers."
          action={
            <Link href="/poster/jobs/new">
              <Button>Post a Job</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Pending ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((req) => (
                  <RequestCard key={req.id} req={req} showActions />
                ))}
              </div>
            </div>
          )}

          {/* Active */}
          {active.length > 0 && (
            <div>
              <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Active ({active.length})
              </h2>
              <div className="space-y-4">
                {active.map((req) => (
                  <RequestCard key={req.id} req={req} showActions />
                ))}
              </div>
            </div>
          )}

          {/* Closed */}
          {closed.length > 0 && (
            <div>
              <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d9d9dd]" />
                Closed ({closed.length})
              </h2>
              <div className="space-y-4 opacity-70">
                {closed.map((req) => (
                  <RequestCard key={req.id} req={req} showActions={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RequestCard({
  req,
  showActions,
}: {
  req: {
    id: string
    status: string
    message: string
    resumeUrl: string | null
    notes: string | null
    createdAt: Date
    job: { id: string; title: string; company: string }
    seeker: { id: string; name: string | null; image: string | null; email: string }
  }
  showActions: boolean
}) {
  return (
    <div className="bg-white rounded-[22px] p-6">
      <div className="flex items-start gap-4">
        <Avatar name={req.seeker.name} image={req.seeker.image} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[#17171c]">{req.seeker.name}</h3>
              <p className="text-xs text-[#93939f]">{req.seeker.email}</p>
            </div>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-sm text-[#75758a] mt-2">
            Applied for: <span className="font-medium text-[#17171c]">{req.job.title}</span> at {req.job.company}
          </p>
          <p className="text-xs text-[#93939f] mt-1">{timeAgo(req.createdAt)}</p>

          {/* Message */}
          <div className="mt-4 p-4 bg-[#eeece7] rounded-xl">
            <p className="text-xs font-medium text-[#93939f] mb-2">Referral message:</p>
            <p className="text-sm text-[#17171c] leading-relaxed">{req.message}</p>
          </div>

          {req.resumeUrl && (
            <div className="mt-3">
              <a
                href={req.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1863dc] underline"
              >
                View Resume / Portfolio →
              </a>
            </div>
          )}

          {req.notes && (
            <div className="mt-3 p-3 bg-[#f1f5ff] rounded-lg border border-[#1863dc]/10">
              <p className="text-xs text-[#1863dc] font-medium mb-1">Your notes:</p>
              <p className="text-sm text-[#17171c]">{req.notes}</p>
            </div>
          )}
        </div>
      </div>

      {showActions && <ReferralActions requestId={req.id} currentStatus={req.status} currentNotes={req.notes} />}
    </div>
  )
}
