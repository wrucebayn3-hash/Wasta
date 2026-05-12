'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Ban, ShieldCheck, Trash2 } from 'lucide-react'

interface AdminUserActionsProps {
  userId: string
  isSuspended: boolean
}

export function AdminUserActions({ userId, isSuspended }: AdminUserActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const action = async (type: string) => {
    setLoading(type)
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {isSuspended ? (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-[#003c33]"
          loading={loading === 'activate'}
          onClick={() => action('activate')}
        >
          <ShieldCheck size={13} />
          Activate
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-amber-600"
          loading={loading === 'suspend'}
          onClick={() => action('suspend')}
        >
          <Ban size={13} />
          Suspend
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="gap-1 text-[#b30000]"
        loading={loading === 'delete'}
        onClick={() => {
          if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            action('delete')
          }
        }}
      >
        <Trash2 size={13} />
        Delete
      </Button>
    </div>
  )
}
