import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, content } = await req.json()
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
  }

  const announcement = await db.announcement.create({
    data: { title, content },
  })

  return NextResponse.json(announcement, { status: 201 })
}

export async function GET() {
  const announcements = await db.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(announcements)
}
