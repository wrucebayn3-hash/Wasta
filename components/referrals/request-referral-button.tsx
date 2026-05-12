'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Send } from 'lucide-react'
import type { Job } from '@prisma/client'

const schema = z.object({
  message: z.string().min(20, 'Please write at least 20 characters about yourself'),
  resumeUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface RequestReferralButtonProps {
  job: Pick<Job, 'id' | 'title' | 'company' | 'posterId'>
}

export function RequestReferralButton({ job }: RequestReferralButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        referrerId: job.posterId,
        message: data.message,
        resumeUrl: data.resumeUrl || null,
      }),
    })

    if (res.ok) {
      setSuccess(true)
      reset()
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        router.refresh()
      }, 2000)
    }
  }

  return (
    <>
      <Button
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <Send size={16} />
        Request Referral
      </Button>

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setSuccess(false)
        }}
        title={`Request referral — ${job.title}`}
        size="md"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#edfce9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-[#003c33]" />
            </div>
            <h3 className="font-semibold text-[#17171c] mb-2">Request Sent!</h3>
            <p className="text-sm text-[#93939f]">
              Your referral request has been submitted. You&apos;ll be notified when the poster responds.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="bg-[#eeece7] rounded-lg p-4 text-sm text-[#17171c]">
              <strong>{job.company}</strong> · {job.title}
            </div>
            <Textarea
              label="Why should they refer you?"
              placeholder="Introduce yourself, share your relevant experience, and explain why you're a great fit for this role. Be specific and genuine."
              error={errors.message?.message}
              className="min-h-[140px]"
              {...register('message')}
            />
            <div>
              <label className="text-sm font-medium text-[#17171c] block mb-1.5">
                Resume / Portfolio URL <span className="text-[#93939f] font-normal">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://your-resume-link.com"
                className="w-full rounded-lg border border-[#d9d9dd] px-4 py-2.5 text-sm focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20"
                {...register('resumeUrl')}
              />
              {errors.resumeUrl && (
                <p className="text-xs text-[#b30000] mt-1">{errors.resumeUrl.message}</p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" loading={isSubmitting}>
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
