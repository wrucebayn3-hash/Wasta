import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { JobStatus } from '@prisma/client'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const job = await db.job.findUnique({
    where: { id: params.id },
    include: {
      poster: { select: { id: true, name: true, image: true, email: true } },
      _count: { select: { referralRequests: true } },
    },
  })
  if (!job) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(job)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const job = await db.job.findUnique({ where: { id: params.id } })
  if (!job) return NextResponse.json(null, { status: 404 })

  const isOwner = job.posterId === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const updated = await db.job.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const job = await db.job.findUnique({ where: { id: params.id } })
  if (!job) return NextResponse.json(null, { status: 404 })

  const isOwner = job.posterId === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await db.job.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
