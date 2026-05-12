import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'industry') {
    const industries = await db.industry.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(industries)
  }
  if (type === 'skill') {
    const skills = await db.skillTag.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(skills)
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { type, name } = await req.json()

  if (type === 'industry') {
    const item = await db.industry.create({ data: { name } })
    return NextResponse.json(item, { status: 201 })
  }
  if (type === 'skill') {
    const item = await db.skillTag.create({ data: { name } })
    return NextResponse.json(item, { status: 201 })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
