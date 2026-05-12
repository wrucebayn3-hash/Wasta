'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  headline: z.string().optional(),
  referralPrefs: z.string().optional(),
  isOpenToRefer: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function PosterProfilePage() {
  const { data: session, update } = useSession()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { isOpenToRefer: true } })

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: session?.user?.name || '',
          bio: data?.bio || '',
          phone: data?.phone || '',
          location: data?.location || '',
          linkedinUrl: data?.linkedinUrl || '',
          currentCompany: data?.currentCompany || '',
          currentRole: data?.currentRole || '',
          headline: data?.headline || '',
          referralPrefs: data?.referralPrefs || '',
          isOpenToRefer: data?.isOpenToRefer ?? true,
        })
      })
  }, [session, reset])

  const onSubmit = async (data: FormData) => {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await update({ name: data.name })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Profile Settings</h1>
        <p className="text-sm text-[#93939f] mt-1">Keep your profile up to date</p>
      </div>

      <div className="bg-white rounded-[22px] p-6 flex items-center gap-6">
        <Avatar name={session?.user?.name} size="xl" className="ring-4 ring-[#eeece7]" />
        <div>
          <h3 className="font-medium text-[#17171c]">{session?.user?.name}</h3>
          <p className="text-sm text-[#93939f]">{session?.user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[22px] p-6 space-y-6">
        <h2 className="font-semibold text-[#17171c]">Professional Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Phone Number" type="tel" {...register('phone')} />
          <Input label="Location" placeholder="San Francisco, CA" {...register('location')} />
          <Input label="Current Company" {...register('currentCompany')} />
          <Input label="Current Role / Designation" {...register('currentRole')} />
          <Input label="Headline" placeholder="Senior Engineer at Acme" {...register('headline')} />
          <div className="sm:col-span-2">
            <Input label="LinkedIn URL" type="url" {...register('linkedinUrl')} />
          </div>
        </div>
        <Textarea label="Bio" placeholder="Tell job seekers about yourself and your expertise..." {...register('bio')} />

        <div className="border-t border-[#f2f2f2] pt-6">
          <h2 className="font-semibold text-[#17171c] mb-4">Referral Preferences</h2>
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#17171c]"
              {...register('isOpenToRefer')}
            />
            <div>
              <p className="text-sm font-medium text-[#17171c]">I&apos;m currently open to referring candidates</p>
              <p className="text-xs text-[#93939f]">This will show on your jobs and profile</p>
            </div>
          </label>
          <Textarea
            label="Referral Preferences"
            placeholder="Describe what you look for in candidates you'd refer, any preferences or requirements..."
            {...register('referralPrefs')}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          {saved && (
            <span className="flex items-center gap-2 text-sm text-[#003c33]">
              <CheckCircle size={16} />
              Profile saved!
            </span>
          )}
          <Button type="submit" loading={isSubmitting} className="ml-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
