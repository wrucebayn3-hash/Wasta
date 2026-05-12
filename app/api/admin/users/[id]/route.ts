import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action } = await req.json()

  let result
  let actionLabel = ''

  switch (action) {
    case 'suspend':
      result = await db.user.update({
        where: { id: params.id },
        data: { isSuspended: true },
      })
      actionLabel = 'User suspended'
      break
    case 'activate':
      result = await db.user.update({
        where: { id: params.id },
        data: { isSuspended: false, isActive: true },
      })
      actionLabel = 'User activated'
      break
    case 'delete':
      result = await db.user.delete({ where: { id: params.id } })
      actionLabel = 'User deleted'
      break
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  await db.adminAction.create({
    data: {
      adminId: session.user.id,
      action: actionLabel,
      targetType: 'User',
      targetId: params.id,
    },
  })

  return NextResponse.json({ success: true })
}
