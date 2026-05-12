import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { EmptyState } from '@/components/ui/empty-state'
import { JobCard } from '@/components/jobs/job-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookmarkIcon } from 'lucide-react'

export default async function SavedJobsPage() {
  const session = await auth()
  const savedJobs = await db.savedJob.findMany({
    where: { userId: session!.user.id },
    include: {
      job: {
        include: {
          poster: { select: { id: true, name: true, image: true } },
          _count: { select: { referralRequests: true, savedBy: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Saved Jobs</h1>
        <p className="text-sm text-[#93939f] mt-1">{savedJobs.length} jobs saved</p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<BookmarkIcon size={24} />}
          title="No saved jobs yet"
          description="Save jobs you're interested in to revisit them later."
          action={
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {savedJobs.map(({ job }) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
