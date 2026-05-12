import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Send, BookmarkIcon, Clock, CheckCircle, XCircle, Star } from 'lucide-react'
import { StatCard } from '@/components/ui/card'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/jobs/job-card'
import { Avatar } from '@/components/ui/avatar'
import { timeAgo, calculateProfileCompletion } from '@/lib/utils'

export default async function SeekerDashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [profile, referrals, savedJobs, recentJobs] = await Promise.all([
    db.profile.findUnique({ where: { userId } }),
    db.referralRequest.findMany({
      where: { seekerId: userId },
      include: {
        job: { select: { id: true, title: true, company: true } },
        referrer: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.savedJob.count({ where: { userId } }),
    db.job.findMany({
      where: { status: 'ACTIVE', referralAvailable: true },
      include: {
        poster: { select: { id: true, name: true, image: true } },
        _count: { select: { referralRequests: true, savedBy: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const completion = profile ? calculateProfileCompletion(profile) : 0

  const statusCounts = {
    pending: referrals.filter((r) => r.status === 'PENDING').length,
    accepted: referrals.filter((r) => r.status === 'ACCEPTED').length,
    referred: referrals.filter((r) => r.status === 'REFERRED').length,
    rejected: referrals.filter((r) => r.status === 'REJECTED').length,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">
            Good to see you, {session!.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#93939f] mt-1">Here&apos;s what&apos;s happening with your referrals.</p>
        </div>
        <Link href="/jobs">
          <Button className="gap-2">
            <Star size={16} />
            Browse Jobs
          </Button>
        </Link>
      </div>

      {/* Profile Completion */}
      {completion < 80 && (
        <div className="bg-[#17171c] rounded-[22px] p-6 flex items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">Complete your profile to get more referrals</p>
            <p className="text-[#93939f] text-sm mb-3">
              A complete profile increases your chances of being accepted by referrers.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff7759] rounded-full transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-sm text-white font-medium">{completion}%</span>
            </div>
          </div>
          <Link href="/seeker/profile">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#17171c] shrink-0">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={referrals.length}
          icon={<Send size={18} />}
        />
        <StatCard
          label="Pending"
          value={statusCounts.pending}
          icon={<Clock size={18} />}
          accent="default"
        />
        <StatCard
          label="Accepted"
          value={statusCounts.accepted}
          icon={<CheckCircle size={18} />}
          accent="green"
        />
        <StatCard
          label="Referred"
          value={statusCounts.referred}
          icon={<Star size={18} />}
          accent="blue"
        />
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-[22px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#17171c]">Recent Referral Requests</h2>
          <Link href="/seeker/referrals">
            <Button variant="secondary" size="sm">View All</Button>
          </Link>
        </div>
        {referrals.length === 0 ? (
          <div className="text-center py-10">
            <Send size={32} className="text-[#d9d9dd] mx-auto mb-3" />
            <p className="text-sm text-[#93939f]">No referral requests yet.</p>
            <Link href="/jobs" className="text-sm text-[#1863dc] underline mt-2 inline-block">
              Browse jobs and request your first referral
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#eeece7] hover:bg-[#e5e3de] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={req.referrer.name} image={req.referrer.image} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[#17171c]">{req.job.title}</p>
                    <p className="text-xs text-[#93939f]">{req.job.company} · {timeAgo(req.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#17171c]">Recommended for You</h2>
          <Link href="/jobs">
            <Button variant="secondary" size="sm">See All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {recentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}
