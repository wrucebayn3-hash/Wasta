import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { ReferralStatus } from '@prisma/client'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const referral = await db.referralRequest.findUnique({ where: { id: params.id } })
  if (!referral) return NextResponse.json(null, { status: 404 })

  const isReferrer = referral.referrerId === session.user.id
  const isSeeker = referral.seekerId === session.user.id
  const isAdmin = session.user.role === 'ADMIN'

  if (!isReferrer && !isSeeker && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { status, notes } = body

  const updated = await db.referralRequest.update({
    where: { id: params.id },
    data: {
      ...(status && { status: status as ReferralStatus }),
      ...(notes !== undefined && { notes }),
    },
  })

  // Send notifications based on status change
  if (status && status !== referral.status) {
    const notifMap: Record<string, { userId: string; type: string; title: string; message: string }> = {
      ACCEPTED: {
        userId: referral.seekerId,
        type: 'REFERRAL_ACCEPTED',
        title: 'Referral Request Accepted!',
        message: 'Your referral request has been accepted. You can now message the referrer.',
      },
      REJECTED: {
        userId: referral.seekerId,
        type: 'REFERRAL_REJECTED',
        title: 'Referral Request Declined',
        message: 'Your referral request was not accepted. Keep applying to other jobs!',
      },
      REFERRED: {
        userId: referral.seekerId,
        type: 'REFERRAL_REFERRED',
        title: "You've been referred! 🎉",
        message: 'Congratulations! The referrer has submitted your profile internally.',
      },
    }

    if (notifMap[status]) {
      const n = notifMap[status]
      await db.notification.create({
        data: {
          userId: n.userId,
          type: n.type as 'REFERRAL_ACCEPTED' | 'REFERRAL_REJECTED' | 'REFERRAL_REFERRED',
          title: n.title,
          message: n.message,
          link: '/seeker/referrals',
        },
      })
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Referral status updated to ${status}`,
        details: `Request ${params.id}`,
      },
    })
  }

  return NextResponse.json(updated)
}
