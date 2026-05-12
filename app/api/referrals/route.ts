import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  jobId: z.string(),
  referrerId: z.string(),
  message: z.string().min(20),
  resumeUrl: z.string().url().optional().nullable(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json(null, { status: 401 })

  const referrals = await db.referralRequest.findMany({
    where: {
      OR: [
        { seekerId: session.user.id },
        { referrerId: session.user.id },
      ],
    },
    include: {
      job: true,
      seeker: { select: { id: true, name: true, image: true, email: true } },
      referrer: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(referrals)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { jobId, referrerId, message, resumeUrl } = parsed.data

  // Check if already exists
  const existing = await db.referralRequest.findFirst({
    where: { jobId, seekerId: session.user.id },
  })
  if (existing) {
    return NextResponse.json({ error: 'You already submitted a referral request for this job' }, { status: 409 })
  }

  // Cannot refer yourself
  if (referrerId === session.user.id) {
    return NextResponse.json({ error: 'You cannot request a referral from yourself' }, { status: 400 })
  }

  const referral = await db.referralRequest.create({
    data: {
      jobId,
      seekerId: session.user.id,
      referrerId,
      message,
      resumeUrl,
    },
  })

  // Notify referrer
  await db.notification.create({
    data: {
      userId: referrerId,
      type: 'REFERRAL_REQUEST',
      title: 'New Referral Request',
      message: `Someone has requested a referral from you.`,
      link: `/poster/requests`,
    },
  })

  await db.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'Referral requested',
      details: `Requested referral for job ${jobId}`,
    },
  })

  return NextResponse.json(referral, { status: 201 })
}
