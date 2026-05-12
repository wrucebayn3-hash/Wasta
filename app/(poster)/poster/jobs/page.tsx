import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { PlusCircle, Edit, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate, WORK_MODE_LABELS, JOB_TYPE_LABELS } from '@/lib/utils'

export default async function PosterJobsPage() {
  const session = await auth()
  const jobs = await db.job.findMany({
    where: { posterId: session!.user.id },
    include: { _count: { select: { referralRequests: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">My Posted Jobs</h1>
          <p className="text-sm text-[#93939f] mt-1">{jobs.length} total postings</p>
        </div>
        <Link href="/poster/jobs/new">
          <Button className="gap-2">
            <PlusCircle size={16} />
            Post a Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={<PlusCircle size={24} />}
          title="No jobs posted yet"
          description="Post your first job opening and start receiving referral requests."
          action={
            <Link href="/poster/jobs/new">
              <Button>Post a Job</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-[22px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#17171c]">{job.title}</h3>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-sm text-[#75758a] mb-3">{job.company} · {job.location}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#93939f]">
                    <span>{WORK_MODE_LABELS[job.workMode]}</span>
                    <span>·</span>
                    <span>{JOB_TYPE_LABELS[job.jobType]}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {job._count.referralRequests} requests
                    </span>
                    <span>·</span>
                    <span>Posted {formatDate(job.createdAt)}</span>
                    {job.deadline && (
                      <>
                        <span>·</span>
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/poster/jobs/${job.id}/requests`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Users size={14} />
                      Requests
                    </Button>
                  </Link>
                  <Link href={`/poster/jobs/${job.id}/edit`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Edit size={14} />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
