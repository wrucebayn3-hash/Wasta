'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  title: z.string().min(3, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  jobType: z.enum(['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  description: z.string().min(50, 'Please provide a detailed description'),
  requirements: z.string().min(30, 'Please provide requirements'),
  skills: z.string().optional(),
  industry: z.string().optional(),
  salary: z.string().optional(),
  deadline: z.string().optional(),
  referralAvailable: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function NewJobPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workMode: 'ONSITE',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      referralAvailable: true,
    },
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    const skillsArray = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, skills: JSON.stringify(skillsArray) }),
    })

    if (res.ok) {
      const job = await res.json()
      router.push(`/poster/jobs`)
    } else {
      const body = await res.json()
      setError(body.error || 'Failed to create job')
    }
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/poster/jobs" className="p-2 rounded-lg hover:bg-[#eeece7] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">Post a New Job</h1>
          <p className="text-sm text-[#93939f] mt-1">Share a job opening and help candidates get referred</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-[#b30000] text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-[22px] p-6 space-y-5">
          <h2 className="font-semibold text-[#17171c]">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Job Title" placeholder="Senior Software Engineer" error={errors.title?.message} {...register('title')} />
            <Input label="Company" placeholder="Acme Corporation" error={errors.company?.message} {...register('company')} />
            <Input label="Location" placeholder="San Francisco, CA" error={errors.location?.message} {...register('location')} />
            <Input label="Industry" placeholder="Technology" {...register('industry')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Select
              label="Work Mode"
              options={[
                { value: 'REMOTE', label: 'Remote' },
                { value: 'HYBRID', label: 'Hybrid' },
                { value: 'ONSITE', label: 'On-site' },
              ]}
              {...register('workMode')}
            />
            <Select
              label="Job Type"
              options={[
                { value: 'FULLTIME', label: 'Full-time' },
                { value: 'PARTTIME', label: 'Part-time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERNSHIP', label: 'Internship' },
                { value: 'FREELANCE', label: 'Freelance' },
              ]}
              {...register('jobType')}
            />
            <Select
              label="Experience Level"
              options={[
                { value: 'ENTRY', label: 'Entry Level' },
                { value: 'MID', label: 'Mid Level' },
                { value: 'SENIOR', label: 'Senior Level' },
                { value: 'LEAD', label: 'Lead' },
                { value: 'EXECUTIVE', label: 'Executive' },
              ]}
              {...register('experienceLevel')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Salary Range" placeholder="$120,000 - $150,000" {...register('salary')} />
            <Input label="Application Deadline" type="date" {...register('deadline')} />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-[22px] p-6 space-y-5">
          <h2 className="font-semibold text-[#17171c]">Job Details</h2>
          <Textarea
            label="Job Description"
            placeholder="Describe the role, responsibilities, and what the candidate will work on..."
            className="min-h-[160px]"
            error={errors.description?.message}
            {...register('description')}
          />
          <Textarea
            label="Requirements"
            placeholder="List the required skills, experience, and qualifications..."
            className="min-h-[120px]"
            error={errors.requirements?.message}
            {...register('requirements')}
          />
          <Textarea
            label="Skills Needed"
            placeholder="React, TypeScript, Node.js, AWS..."
            hint="Separate skills with commas"
            {...register('skills')}
          />
        </div>

        {/* Referral */}
        <div className="bg-white rounded-[22px] p-6">
          <h2 className="font-semibold text-[#17171c] mb-4">Referral Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#17171c] rounded"
              {...register('referralAvailable')}
              defaultChecked
            />
            <div>
              <p className="text-sm font-medium text-[#17171c]">I&apos;m available to refer candidates</p>
              <p className="text-xs text-[#93939f]">
                Job seekers will be able to request referrals from you for this posting
              </p>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <Link href="/poster/jobs">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting} className="gap-2">
            <CheckCircle size={16} />
            Publish Job
          </Button>
        </div>
      </form>
    </div>
  )
}
