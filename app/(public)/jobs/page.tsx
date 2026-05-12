import { Metadata } from 'next'
import { Search, MapPin, Filter } from 'lucide-react'
import { db } from '@/lib/db'
import { JobCard } from '@/components/jobs/job-card'
import { EmptyState } from '@/components/ui/empty-state'
import type { WorkMode, JobType, ExperienceLevel } from '@prisma/client'

export const metadata: Metadata = { title: 'Browse Jobs' }

interface SearchParams {
  q?: string
  location?: string
  workMode?: string
  jobType?: string
  experience?: string
  referralOnly?: string
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const where: Record<string, unknown> = { status: 'ACTIVE' }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { company: { contains: searchParams.q } },
      { description: { contains: searchParams.q } },
    ]
  }
  if (searchParams.location) {
    where.location = { contains: searchParams.location }
  }
  if (searchParams.workMode) {
    where.workMode = searchParams.workMode as WorkMode
  }
  if (searchParams.jobType) {
    where.jobType = searchParams.jobType as JobType
  }
  if (searchParams.experience) {
    where.experienceLevel = searchParams.experience as ExperienceLevel
  }
  if (searchParams.referralOnly === 'true') {
    where.referralAvailable = true
  }

  const jobs = await db.job.findMany({
    where,
    include: {
      poster: { select: { id: true, name: true, image: true } },
      _count: { select: { referralRequests: true, savedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-[#eeece7]">
      {/* Header */}
      <div className="bg-white border-b border-[#f2f2f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-semibold text-[#17171c] mb-6">Browse Jobs</h1>

          {/* Search and filters */}
          <form method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Job title, company, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20"
              />
            </div>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
              <input
                name="location"
                defaultValue={searchParams.location}
                placeholder="Location..."
                className="pl-10 pr-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20 w-full sm:w-48"
              />
            </div>
            <select
              name="workMode"
              defaultValue={searchParams.workMode || ''}
              className="px-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none text-[#17171c] bg-white cursor-pointer"
            >
              <option value="">Work Mode</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
            <select
              name="experience"
              defaultValue={searchParams.experience || ''}
              className="px-4 py-2.5 rounded-lg border border-[#d9d9dd] text-sm focus:outline-none text-[#17171c] bg-white cursor-pointer"
            >
              <option value="">Experience</option>
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="LEAD">Lead</option>
              <option value="EXECUTIVE">Executive</option>
            </select>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#d9d9dd] bg-white cursor-pointer text-sm text-[#17171c] whitespace-nowrap">
              <input
                type="checkbox"
                name="referralOnly"
                value="true"
                defaultChecked={searchParams.referralOnly === 'true'}
                className="accent-[#17171c]"
              />
              Referral Only
            </label>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#17171c] text-white rounded-[32px] text-sm font-medium hover:bg-black transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#93939f]">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No jobs found"
            description="Try adjusting your search filters or check back later for new listings."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
