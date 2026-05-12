'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { CheckCircle, XCircle, Star, StickyNote } from 'lucide-react'

interface ReferralActionsProps {
  requestId: string
  currentStatus: string
  currentNotes: string | null
}

export function ReferralActions({ requestId, currentStatus, currentNotes }: ReferralActionsProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(currentNotes || '')
  const [showNotes, setShowNotes] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (status: string) => {
    setLoading(status)
    await fetch(`/api/referrals/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  const saveNotes = async () => {
    setLoading('notes')
    await fetch(`/api/referrals/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    setLoading(null)
    setShowNotes(false)
    router.refresh()
  }

  return (
    <div className="mt-5 pt-5 border-t border-[#f2f2f2]">
      {showNotes && (
        <div className="mb-4 space-y-3">
          <Textarea
            label="Internal Notes"
            placeholder="Add notes about this candidate (only visible to you)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" loading={loading === 'notes'} onClick={saveNotes}>Save Notes</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNotes(false)}>Cancel</Button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {currentStatus === 'PENDING' && (
          <>
            <Button
              size="sm"
              className="gap-1.5 bg-[#003c33] hover:bg-[#002a24]"
              loading={loading === 'ACCEPTED'}
              onClick={() => updateStatus('ACCEPTED')}
            >
              <CheckCircle size={14} />
              Accept
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="gap-1.5"
              loading={loading === 'REJECTED'}
              onClick={() => updateStatus('REJECTED')}
            >
              <XCircle size={14} />
              Reject
            </Button>
          </>
        )}
        {currentStatus === 'ACCEPTED' && (
          <Button
            size="sm"
            variant="coral"
            className="gap-1.5"
            loading={loading === 'REFERRED'}
            onClick={() => updateStatus('REFERRED')}
          >
            <Star size={14} />
            Mark as Referred
          </Button>
        )}
        {['PENDING', 'ACCEPTED'].includes(currentStatus) && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => setShowNotes(!showNotes)}
          >
            <StickyNote size={14} />
            {currentNotes ? 'Edit Notes' : 'Add Notes'}
          </Button>
        )}
      </div>
    </div>
  )
}
