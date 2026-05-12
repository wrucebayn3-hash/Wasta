import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Briefcase, Clock, Calendar, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { RequestReferralButton } from '@/components/referrals/request-referral-button'
import {
  WORK_MODE_LABELS,
  JOB_TYPE_LABELS,
  EXPERIENCE_LABELS,
  formatDate,
  timeAgo,
} from '@/lib/utils'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const job = await db.job.findUnique({
    where: { id: params.id },
    include: {
      poster: {
        select: { id: true, name: true, image: true, email: true },
        // Include profile
      },
      _count: { select: { referralRequests: true } },
    },
  })

  if (!job) notFound()

  const skills = JSON.parse(job.skills || '[]') as string[]

  // Check if user has already requested referral
  let existingRequest = null
  if (session?.user) {
    existingRequest = await db.referralRequest.findFirst({
      where: { jobId: job.id, seekerId: session.user.id },
    })
  }

  // Increment view count
  await db.job.update({ where: { id: job.id }, data: { viewCount: { increment: 1 } } })

  return (
    <div className="min-h-screen bg-[#eeece7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-[#93939f] hover:text-[#17171c] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job header */}
            <div className="bg-white rounded-[22px] p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-[#17171c] mb-1">
                    {job.title}
                  </h1>
                  <p className="text-[#75758a] font-medium">{job.company}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-[#93939f] mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase size={15} />
                  {WORK_MODE_LABELS[job.workMode]}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {JOB_TYPE_LABELS[job.jobType]}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={15} />
                  {job._count.referralRequests} referral requests
                </span>
                {job.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    Deadline: {formatDate(job.deadline)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">{EXPERIENCE_LABELS[job.experienceLevel]}</Badge>
                {job.referralAvailable ? (
                  <Badge variant="success">Referral Available</Badge>
                ) : (
                  <Badge variant="outline">No Referral</Badge>
                )}
                {job.salary && <Badge variant="info">{job.salary}</Badge>}
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1 bg-[#eeece7] text-[#17171c] rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-[22px] p-8">
              <h2 className="font-semibold text-[#17171c] text-lg mb-4">Job Description</h2>
              <div className="text-sm text-[#75758a] leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-[22px] p-8">
              <h2 className="font-semibold text-[#17171c] text-lg mb-4">Requirements</h2>
              <div className="text-sm text-[#75758a] leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Referral CTA */}
            <div className="bg-white rounded-[22px] p-6">
              <h3 className="font-semibold text-[#17171c] mb-3">Request a Referral</h3>
              {!session ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#93939f]">
                    Sign in to request a referral for this position.
                  </p>
                  <Link href={`/login?redirect=/jobs/${job.id}`}>
                    <Button className="w-full">Sign In to Request</Button>
                  </Link>
                </div>
              ) : existingRequest ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#93939f]">You&apos;ve already submitted a request for this job.</p>
                  <StatusBadge status={existingRequest.status} />
                  <Link href="/seeker/referrals">
                    <Button variant="outline" className="w-full">View My Requests</Button>
                  </Link>
                </div>
              ) : job.status !== 'ACTIVE' ? (
                <p className="text-sm text-[#93939f]">This job is no longer accepting referral requests.</p>
              ) : !job.referralAvailable ? (
                <p className="text-sm text-[#93939f]">Referrals are not available for this position.</p>
              ) : session.user.id === job.posterId ? (
                <p className="text-sm text-[#93939f]">You posted this job.</p>
              ) : (
                <RequestReferralButton job={job} />
              )}
            </div>

            {/* Poster info */}
            <div className="bg-white rounded-[22px] p-6">
              <h3 className="font-semibold text-[#17171c] mb-4">Posted by</h3>
              <div className="flex items-center gap-3">
                <Avatar name={job.poster.name} image={job.poster.image} size="md" />
                <div>
                  <p className="font-medium text-[#17171c] text-sm">{job.poster.name}</p>
                  <p className="text-xs text-[#93939f]">Referrer at {job.company}</p>
                </div>
              </div>
              <p className="text-xs text-[#93939f] mt-4">Posted {timeAgo(job.createdAt)}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-[22px] p-6 space-y-3">
              <h3 className="font-semibold text-[#17171c] mb-4">Job Details</h3>
              {[
                { label: 'Work Mode', value: WORK_MODE_LABELS[job.workMode] },
                { label: 'Job Type', value: JOB_TYPE_LABELS[job.jobType] },
                { label: 'Experience', value: EXPERIENCE_LABELS[job.experienceLevel] },
                { label: 'Posted', value: formatDate(job.createdAt) },
                ...(job.deadline ? [{ label: 'Deadline', value: formatDate(job.deadline) }] : []),
                ...(job.industry ? [{ label: 'Industry', value: job.industry }] : []),
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-[#93939f]">{item.label}</span>
                  <span className="font-medium text-[#17171c]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
