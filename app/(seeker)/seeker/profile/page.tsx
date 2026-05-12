'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { CheckCircle, User } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  headline: z.string().optional(),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SeekerProfilePage() {
  const { data: session, update } = useSession()
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Record<string, string | null> | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setProfile(data)
        const skills = Array.isArray(data?.skills)
          ? data.skills.join(', ')
          : typeof data?.skills === 'string' && data.skills !== '[]'
          ? JSON.parse(data.skills).join(', ')
          : ''
        reset({
          name: session?.user?.name || '',
          bio: data?.bio || '',
          phone: data?.phone || '',
          location: data?.location || '',
          linkedinUrl: data?.linkedinUrl || '',
          portfolioUrl: data?.portfolioUrl || '',
          resumeUrl: data?.resumeUrl || '',
          currentCompany: data?.currentCompany || '',
          currentRole: data?.currentRole || '',
          headline: data?.headline || '',
          skills,
        })
      })
  }, [session, reset])

  const onSubmit = async (data: FormData) => {
    const skillsArray = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, skills: JSON.stringify(skillsArray) }),
    })

    await update({ name: data.name })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Profile Settings</h1>
        <p className="text-sm text-[#93939f] mt-1">Keep your profile up to date to increase referral chances</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-[22px] p-6 flex items-center gap-6">
        <Avatar name={session?.user?.name} size="xl" />
        <div>
          <h3 className="font-medium text-[#17171c]">{session?.user?.name}</h3>
          <p className="text-sm text-[#93939f]">{session?.user?.email}</p>
          <p className="text-xs text-[#93939f] mt-2">Profile photo coming from your name initials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[22px] p-6 space-y-6">
        <h2 className="font-semibold text-[#17171c] flex items-center gap-2">
          <User size={18} />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Full Name" placeholder="Alex Johnson" error={errors.name?.message} {...register('name')} />
          <Input label="Phone Number" placeholder="+1 555 000 0000" type="tel" {...register('phone')} />
          <Input label="Location" placeholder="San Francisco, CA" {...register('location')} />
          <Input label="Headline" placeholder="Senior Software Engineer" {...register('headline')} />
          <Input label="Current Company" placeholder="Acme Corp" {...register('currentCompany')} />
          <Input label="Current Role" placeholder="Software Engineer" {...register('currentRole')} />
        </div>
        <Textarea label="Bio" placeholder="Tell referrers about yourself, your experience, and career goals..." {...register('bio')} />

        <div className="border-t border-[#f2f2f2] pt-6">
          <h2 className="font-semibold text-[#17171c] mb-5">Links & Resume</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." type="url" error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
            <Input label="Portfolio URL" placeholder="https://yourportfolio.com" type="url" error={errors.portfolioUrl?.message} {...register('portfolioUrl')} />
            <div className="sm:col-span-2">
              <Input label="Resume URL" placeholder="https://drive.google.com/..." type="url" error={errors.resumeUrl?.message} hint="Link to your Google Drive, Dropbox, or personal site resume" {...register('resumeUrl')} />
            </div>
          </div>
        </div>

        <div className="border-t border-[#f2f2f2] pt-6">
          <h2 className="font-semibold text-[#17171c] mb-5">Skills</h2>
          <Textarea
            label="Skills"
            placeholder="React, TypeScript, Node.js, AWS..."
            hint="Enter skills separated by commas"
            {...register('skills')}
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
