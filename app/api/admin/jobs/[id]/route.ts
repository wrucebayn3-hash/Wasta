import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { JobStatus } from '@prisma/client'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status } = await req.json()

  const job = await db.job.update({
    where: { id: params.id },
    data: { status: status as JobStatus },
  })

  await db.adminAction.create({
    data: {
      adminId: session.user.id,
      action: `Job status changed to ${status}`,
      targetType: 'Job',
      targetId: params.id,
    },
  })

  return NextResponse.json(job)
}
