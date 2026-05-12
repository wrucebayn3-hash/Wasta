import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Inbox } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { timeAgo } from '@/lib/utils'
import { ReferralActions } from '@/components/referrals/referral-actions'

export default async function JobRequestsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const job = await db.job.findUnique({
    where: { id: params.id, posterId: session!.user.id },
  })
  if (!job) notFound()

  const requests = await db.referralRequest.findMany({
    where: { jobId: params.id },
    include: {
      seeker: { select: { id: true, name: true, image: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/poster/jobs" className="p-2 rounded-lg hover:bg-[#eeece7] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">
            Requests for {job.title}
          </h1>
          <p className="text-sm text-[#93939f] mt-1">{job.company} · {requests.length} requests</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Inbox size={24} />}
          title="No requests yet"
          description="No one has requested a referral for this job yet."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-[22px] p-6">
              <div className="flex items-start gap-4">
                <Avatar name={req.seeker.name} image={req.seeker.image} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#17171c]">{req.seeker.name}</h3>
                      <p className="text-xs text-[#93939f]">{req.seeker.email} · {timeAgo(req.createdAt)}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="mt-4 p-4 bg-[#eeece7] rounded-xl">
                    <p className="text-sm text-[#17171c] leading-relaxed">{req.message}</p>
                  </div>
                  {req.resumeUrl && (
                    <a href={req.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1863dc] underline mt-3 inline-block">
                      View Resume →
                    </a>
                  )}
                </div>
              </div>
              {['PENDING', 'ACCEPTED'].includes(req.status) && (
                <ReferralActions requestId={req.id} currentStatus={req.status} currentNotes={req.notes} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
