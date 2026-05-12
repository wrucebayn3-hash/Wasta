import { db } from '@/lib/db'
import { TrendingUp, Users, Briefcase, GitPullRequest, Star } from 'lucide-react'
import { StatCard } from '@/components/ui/card'

export default async function AdminReportsPage() {
  const [
    totalUsers,
    seekers,
    posters,
    bothRole,
    totalJobs,
    activeJobs,
    closedJobs,
    totalReferrals,
    pendingReferrals,
    acceptedReferrals,
    referredCandidates,
    rejectedReferrals,
    recentUsers,
    recentJobs,
  ] = await Promise.all([
    db.user.count({ where: { role: { not: 'ADMIN' } } }),
    db.user.count({ where: { role: 'SEEKER' } }),
    db.user.count({ where: { role: 'POSTER' } }),
    db.user.count({ where: { role: 'BOTH' } }),
    db.job.count(),
    db.job.count({ where: { status: 'ACTIVE' } }),
    db.job.count({ where: { status: 'CLOSED' } }),
    db.referralRequest.count(),
    db.referralRequest.count({ where: { status: 'PENDING' } }),
    db.referralRequest.count({ where: { status: 'ACCEPTED' } }),
    db.referralRequest.count({ where: { status: 'REFERRED' } }),
    db.referralRequest.count({ where: { status: 'REJECTED' } }),
    // Users over last 7 days
    db.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    db.job.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
  ])

  const referralConversionRate = totalReferrals > 0
    ? ((referredCandidates / totalReferrals) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Reports & Analytics</h1>
        <p className="text-sm text-[#93939f] mt-1">Platform-wide statistics and performance metrics</p>
      </div>

      {/* User analytics */}
      <div>
        <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
          <Users size={18} />
          User Analytics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={totalUsers} accent="default" />
          <StatCard label="Job Seekers" value={seekers} accent="green" />
          <StatCard label="Job Posters" value={posters} accent="blue" />
          <StatCard label="Both Roles" value={bothRole} accent="coral" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[22px] p-6">
            <p className="text-sm text-[#93939f] mb-2">New users (last 7 days)</p>
            <p className="text-3xl font-display font-semibold text-[#17171c]">{recentUsers}</p>
          </div>
          <div className="bg-white rounded-[22px] p-6">
            <p className="text-sm text-[#93939f] mb-2">New jobs (last 7 days)</p>
            <p className="text-3xl font-display font-semibold text-[#17171c]">{recentJobs}</p>
          </div>
        </div>
      </div>

      {/* Job analytics */}
      <div>
        <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
          <Briefcase size={18} />
          Job Analytics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Jobs" value={totalJobs} accent="default" />
          <StatCard label="Active Jobs" value={activeJobs} accent="green" />
          <StatCard label="Closed Jobs" value={closedJobs} accent="blue" />
        </div>
      </div>

      {/* Referral analytics */}
      <div>
        <h2 className="font-semibold text-[#17171c] mb-4 flex items-center gap-2">
          <GitPullRequest size={18} />
          Referral Analytics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={totalReferrals} accent="default" />
          <StatCard label="Pending" value={pendingReferrals} accent="coral" />
          <StatCard label="Accepted" value={acceptedReferrals} accent="green" />
          <StatCard label="Successful Referrals" value={referredCandidates} accent="blue" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[22px] p-6">
            <p className="text-sm text-[#93939f] mb-2">Conversion Rate</p>
            <p className="text-3xl font-display font-semibold text-[#17171c]">{referralConversionRate}%</p>
            <p className="text-xs text-[#93939f] mt-1">
              {referredCandidates} referred out of {totalReferrals} total requests
            </p>
          </div>
          <div className="bg-white rounded-[22px] p-6">
            <p className="text-sm text-[#93939f] mb-2">Rejection Rate</p>
            <p className="text-3xl font-display font-semibold text-[#17171c]">
              {totalReferrals > 0 ? ((rejectedReferrals / totalReferrals) * 100).toFixed(1) : '0'}%
            </p>
            <p className="text-xs text-[#93939f] mt-1">
              {rejectedReferrals} rejected out of {totalReferrals} total requests
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
