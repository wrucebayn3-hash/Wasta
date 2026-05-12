import Link from 'next/link'
import { MapPin, Briefcase, Clock, Users } from 'lucide-react'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  WORK_MODE_LABELS,
  JOB_TYPE_LABELS,
  EXPERIENCE_LABELS,
  timeAgo,
} from '@/lib/utils'
import type { Job, User } from '@prisma/client'

type JobWithPoster = Job & {
  poster: Pick<User, 'id' | 'name' | 'image'>
  _count?: { referralRequests: number; savedBy: number }
}

interface JobCardProps {
  job: JobWithPoster
  showActions?: boolean
  compact?: boolean
}

export function JobCard({ job, showActions = true, compact = false }: JobCardProps) {
  const skills = JSON.parse(job.skills || '[]') as string[]

  return (
    <div className="bg-white border border-[#f2f2f2] rounded-[22px] p-6 hover:border-[#d9d9dd] hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.id}`}
            className="text-lg font-semibold text-[#17171c] hover:text-[#1863dc] transition-colors line-clamp-1 group-hover:text-[#1863dc]"
          >
            {job.title}
          </Link>
          <p className="text-sm text-[#75758a] mt-0.5">{job.company}</p>
        </div>
        <div className="flex-shrink-0">
          {job.referralAvailable ? (
            <Badge variant="success">Referral Available</Badge>
          ) : (
            <Badge variant="outline">No Referral</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-[#93939f]">
        <span className="flex items-center gap-1">
          <MapPin size={13} />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={13} />
          {WORK_MODE_LABELS[job.workMode]}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} />
          {JOB_TYPE_LABELS[job.jobType]}
        </span>
        {job._count && (
          <span className="flex items-center gap-1">
            <Users size={13} />
            {job._count.referralRequests} requests
          </span>
        )}
      </div>

      {!compact && (
        <p className="text-sm text-[#75758a] line-clamp-2 mb-4">{job.description}</p>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 bg-[#eeece7] text-[#17171c] rounded-full"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs px-2.5 py-1 text-[#93939f]">+{skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{EXPERIENCE_LABELS[job.experienceLevel]}</Badge>
          <span className="text-xs text-[#93939f]">{timeAgo(job.createdAt)}</span>
        </div>
        {showActions && (
          <Link href={`/jobs/${job.id}`}>
            <Button size="sm">View Job</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
