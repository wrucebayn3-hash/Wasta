import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Briefcase, Inbox, CheckCircle, Star, Users, PlusCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/card'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'

export default async function PosterDashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [jobs, referrals] = await Promise.all([
    db.job.findMany({
      where: { posterId: userId },
      include: { _count: { select: { referralRequests: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.referralRequest.findMany({
      where: { referrerId: userId },
      include: {
        job: { select: { id: true, title: true, company: true } },
        seeker: { select: { id: true, name: true, image: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ])

  const totalJobs = await db.job.count({ where: { posterId: userId } })
  const activeJobs = await db.job.count({ where: { posterId: userId, status: 'ACTIVE' } })
  const pendingRequests = referrals.filter((r) => r.status === 'PENDING').length
  const referred = referrals.filter((r) => r.status === 'REFERRED').length

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">
            Poster Dashboard
          </h1>
          <p className="text-sm text-[#93939f] mt-1">Manage your job postings and referral requests</p>
        </div>
        <Link href="/poster/jobs/new">
          <Button className="gap-2">
            <PlusCircle size={16} />
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs Posted" value={totalJobs} icon={<Briefcase size={18} />} />
        <StatCard label="Active Jobs" value={activeJobs} icon={<CheckCircle size={18} />} accent="green" />
        <StatCard label="Pending Requests" value={pendingRequests} icon={<Inbox size={18} />} accent="coral" />
        <StatCard label="Referred Candidates" value={referred} icon={<Star size={18} />} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">Recent Referral Requests</h2>
            <Link href="/poster/requests">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>
          {referrals.length === 0 ? (
            <div className="text-center py-10">
              <Inbox size={32} className="text-[#d9d9dd] mx-auto mb-3" />
              <p className="text-sm text-[#93939f]">No referral requests yet.</p>
              <p className="text-xs text-[#93939f] mt-1">Post a job to start receiving requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.slice(0, 6).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eeece7] transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar name={req.seeker.name} image={req.seeker.image} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-[#17171c]">{req.seeker.name}</p>
                      <p className="text-xs text-[#93939f]">{req.job.title} · {timeAgo(req.createdAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My jobs */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">My Job Postings</h2>
            <Link href="/poster/jobs">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase size={32} className="text-[#d9d9dd] mx-auto mb-3" />
              <p className="text-sm text-[#93939f]">No jobs posted yet.</p>
              <Link href="/poster/jobs/new">
                <Button size="sm" className="mt-3">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eeece7] transition-colors">
                  <div>
                    <Link
                      href={`/poster/jobs/${job.id}`}
                      className="text-sm font-medium text-[#17171c] hover:text-[#1863dc] transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-[#93939f]">
                      {job.company} · {job._count.referralRequests} requests
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
