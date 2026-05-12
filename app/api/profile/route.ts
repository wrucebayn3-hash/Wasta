import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateProfileCompletion } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json(null, { status: 401 })

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  })
  return NextResponse.json(profile)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json(null, { status: 401 })

  const body = await req.json()
  const { name, ...profileData } = body

  // Update user name
  if (name) {
    await db.user.update({
      where: { id: session.user.id },
      data: { name },
    })
  }

  const completionPct = calculateProfileCompletion(profileData)

  const profile = await db.profile.upsert({
    where: { userId: session.user.id },
    update: { ...profileData, completionPct },
    create: {
      userId: session.user.id,
      ...profileData,
      completionPct,
    },
  })

  return NextResponse.json(profile)
}
