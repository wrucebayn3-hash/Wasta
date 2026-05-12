import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import type { WorkMode, JobType, ExperienceLevel } from '@prisma/client'

const createSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  location: z.string().min(2),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  jobType: z.enum(['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  description: z.string().min(50),
  requirements: z.string().min(30),
  skills: z.string().optional(),
  industry: z.string().optional(),
  salary: z.string().optional(),
  deadline: z.string().optional(),
  referralAvailable: z.boolean(),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const status = searchParams.get('status') || 'ACTIVE'
  const workMode = searchParams.get('workMode')
  const jobType = searchParams.get('jobType')
  const experience = searchParams.get('experience')

  const where: Record<string, unknown> = { status }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { company: { contains: q } },
    ]
  }
  if (workMode) where.workMode = workMode as WorkMode
  if (jobType) where.jobType = jobType as JobType
  if (experience) where.experienceLevel = experience as ExperienceLevel

  const jobs = await db.job.findMany({
    where,
    include: {
      poster: { select: { id: true, name: true, image: true } },
      _count: { select: { referralRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(jobs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['POSTER', 'BOTH', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const { deadline, ...rest } = parsed.data

  const job = await db.job.create({
    data: {
      ...rest,
      skills: rest.skills || '[]',
      deadline: deadline ? new Date(deadline) : null,
      posterId: session.user.id,
    },
  })

  await db.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'Job posted',
      details: `Posted "${job.title}" at ${job.company}`,
    },
  })

  return NextResponse.json(job, { status: 201 })
}
