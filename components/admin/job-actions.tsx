'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface AdminJobActionsProps {
  jobId: string
  currentStatus: string
}

export function AdminJobActions({ jobId, currentStatus }: AdminJobActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const action = async (status: string) => {
    setLoading(status)
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {currentStatus === 'ACTIVE' && (
        <Button
          size="sm"
          variant="ghost"
          className="text-amber-600"
          loading={loading === 'PAUSED'}
          onClick={() => action('PAUSED')}
        >
          Pause
        </Button>
      )}
      {currentStatus === 'PAUSED' && (
        <Button
          size="sm"
          variant="ghost"
          className="text-[#003c33]"
          loading={loading === 'ACTIVE'}
          onClick={() => action('ACTIVE')}
        >
          Activate
        </Button>
      )}
      {currentStatus !== 'CLOSED' && (
        <Button
          size="sm"
          variant="ghost"
          className="text-[#b30000]"
          loading={loading === 'CLOSED'}
          onClick={() => action('CLOSED')}
        >
          Close
        </Button>
      )}
    </div>
  )
}
