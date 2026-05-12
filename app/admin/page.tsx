import { db } from '@/lib/db'
import { Users, Briefcase, GitPullRequest, TrendingUp, Activity, Star } from 'lucide-react'
import { StatCard } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalSeekers,
    totalPosters,
    totalJobs,
    activeJobs,
    totalReferrals,
    pendingReferrals,
    successfulReferrals,
    recentUsers,
    recentReferrals,
    recentJobs,
    activityLogs,
  ] = await Promise.all([
    db.user.count({ where: { role: { not: 'ADMIN' } } }),
    db.user.count({ where: { role: 'SEEKER' } }),
    db.user.count({ where: { role: { in: ['POSTER', 'BOTH'] } } }),
    db.job.count(),
    db.job.count({ where: { status: 'ACTIVE' } }),
    db.referralRequest.count(),
    db.referralRequest.count({ where: { status: 'PENDING' } }),
    db.referralRequest.count({ where: { status: 'REFERRED' } }),
    db.user.findMany({
      where: { role: { not: 'ADMIN' } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
    }),
    db.referralRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        job: { select: { title: true, company: true } },
        seeker: { select: { name: true, image: true } },
      },
    }),
    db.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { referralRequests: true } } },
    }),
    db.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Admin Dashboard</h1>
        <p className="text-sm text-[#93939f] mt-1">Full platform overview and control center</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totalUsers} icon={<Users size={18} />} />
        <StatCard label="Total Jobs" value={totalJobs} icon={<Briefcase size={18} />} accent="green" />
        <StatCard label="Total Referrals" value={totalReferrals} icon={<GitPullRequest size={18} />} accent="blue" />
        <StatCard label="Successful Referrals" value={successfulReferrals} icon={<Star size={18} />} accent="coral" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Job Seekers" value={totalSeekers} icon={<Users size={18} />} />
        <StatCard label="Job Posters" value={totalPosters} icon={<Users size={18} />} accent="green" />
        <StatCard label="Active Jobs" value={activeJobs} icon={<Briefcase size={18} />} accent="blue" />
        <StatCard label="Pending Referrals" value={pendingReferrals} icon={<GitPullRequest size={18} />} accent="coral" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-[#1863dc] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} image={user.image} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[#17171c]">{user.name}</p>
                    <p className="text-xs text-[#93939f]">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#75758a]">{user.role}</p>
                  <p className="text-xs text-[#93939f]">{timeAgo(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referral Requests */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">Recent Referrals</h2>
            <Link href="/admin/referrals" className="text-sm text-[#1863dc] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentReferrals.map((req) => (
              <div key={req.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={req.seeker.name} image={req.seeker.image} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[#17171c]">{req.seeker.name}</p>
                    <p className="text-xs text-[#93939f]">{req.job.title} at {req.job.company}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">Recent Jobs</h2>
            <Link href="/admin/jobs" className="text-sm text-[#1863dc] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#17171c]">{job.title}</p>
                  <p className="text-xs text-[#93939f]">{job.company} · {job._count.referralRequests} requests</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#17171c]">Activity Logs</h2>
            <Link href="/admin/activity" className="text-sm text-[#1863dc] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {activityLogs.length === 0 ? (
              <p className="text-sm text-[#93939f]">No activity logs yet.</p>
            ) : activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#d9d9dd] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#17171c]">{log.action}</p>
                  <p className="text-xs text-[#93939f]">
                    {log.user?.name || 'System'} · {timeAgo(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
