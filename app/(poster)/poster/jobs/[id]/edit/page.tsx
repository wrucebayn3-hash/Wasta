'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const schema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  location: z.string().min(2),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  jobType: z.enum(['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  description: z.string().min(50),
  requirements: z.string().min(30),
  skills: z.string().optional(),
  industry: z.string().optional(),
  salary: z.string().optional(),
  referralAvailable: z.boolean(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CLOSED', 'DRAFT']),
})

type FormData = z.infer<typeof schema>

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((job) => {
        const skills = Array.isArray(job.skills)
          ? job.skills.join(', ')
          : typeof job.skills === 'string' && job.skills !== '[]'
          ? JSON.parse(job.skills).join(', ')
          : ''
        reset({
          title: job.title,
          company: job.company,
          location: job.location,
          workMode: job.workMode,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          description: job.description,
          requirements: job.requirements,
          skills,
          industry: job.industry || '',
          salary: job.salary || '',
          referralAvailable: job.referralAvailable,
          status: job.status,
        })
        setLoading(false)
      })
  }, [jobId, reset])

  const onSubmit = async (data: FormData) => {
    const skillsArray = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, skills: JSON.stringify(skillsArray) }),
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push('/poster/jobs')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#17171c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/poster/jobs" className="p-2 rounded-lg hover:bg-[#eeece7] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">Edit Job</h1>
          <p className="text-sm text-[#93939f] mt-1">Update your job posting details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-[22px] p-6 space-y-5">
          <h2 className="font-semibold text-[#17171c]">Job Status</h2>
          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: 'Active — Accepting referral requests' },
              { value: 'PAUSED', label: 'Paused — Temporarily not accepting' },
              { value: 'CLOSED', label: 'Closed — No longer accepting' },
              { value: 'DRAFT', label: 'Draft — Not visible to seekers' },
            ]}
            {...register('status')}
          />
        </div>

        <div className="bg-white rounded-[22px] p-6 space-y-5">
          <h2 className="font-semibold text-[#17171c]">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Job Title" error={errors.title?.message} {...register('title')} />
            <Input label="Company" error={errors.company?.message} {...register('company')} />
            <Input label="Location" error={errors.location?.message} {...register('location')} />
            <Input label="Industry" {...register('industry')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Select label="Work Mode" options={[{ value: 'REMOTE', label: 'Remote' }, { value: 'HYBRID', label: 'Hybrid' }, { value: 'ONSITE', label: 'On-site' }]} {...register('workMode')} />
            <Select label="Job Type" options={[{ value: 'FULLTIME', label: 'Full-time' }, { value: 'PARTTIME', label: 'Part-time' }, { value: 'CONTRACT', label: 'Contract' }, { value: 'INTERNSHIP', label: 'Internship' }, { value: 'FREELANCE', label: 'Freelance' }]} {...register('jobType')} />
            <Select label="Experience" options={[{ value: 'ENTRY', label: 'Entry Level' }, { value: 'MID', label: 'Mid Level' }, { value: 'SENIOR', label: 'Senior Level' }, { value: 'LEAD', label: 'Lead' }, { value: 'EXECUTIVE', label: 'Executive' }]} {...register('experienceLevel')} />
          </div>
          <Input label="Salary Range" placeholder="$120,000 - $150,000" {...register('salary')} />
        </div>

        <div className="bg-white rounded-[22px] p-6 space-y-5">
          <h2 className="font-semibold text-[#17171c]">Job Details</h2>
          <Textarea label="Job Description" className="min-h-[160px]" error={errors.description?.message} {...register('description')} />
          <Textarea label="Requirements" className="min-h-[120px]" error={errors.requirements?.message} {...register('requirements')} />
          <Textarea label="Skills Needed" hint="Separate with commas" {...register('skills')} />
        </div>

        <div className="bg-white rounded-[22px] p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-[#17171c] rounded" {...register('referralAvailable')} />
            <div>
              <p className="text-sm font-medium text-[#17171c]">Accept referral requests for this job</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/poster/jobs">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting} className="gap-2">
            {saved ? <><CheckCircle size={16} />Saved!</> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
