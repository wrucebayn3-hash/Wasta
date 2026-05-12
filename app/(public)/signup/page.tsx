'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['SEEKER', 'POSTER', 'BOTH']),
})

type FormData = z.infer<typeof schema>

const roleOptions = [
  {
    value: 'SEEKER',
    label: 'Job Seeker',
    desc: 'Looking for jobs and referrals',
  },
  {
    value: 'POSTER',
    label: 'Job Poster',
    desc: 'Posting jobs and referring candidates',
  },
  {
    value: 'BOTH',
    label: 'Both',
    desc: 'I want to seek and give referrals',
  },
]

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') as 'SEEKER' | 'POSTER' | 'BOTH') || 'SEEKER'

  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error || 'Something went wrong. Please try again.')
      return
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (data.role === 'POSTER') {
      router.push('/poster/dashboard')
    } else {
      router.push('/seeker/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#eeece7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#17171c] rounded-xl flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-display font-semibold text-2xl text-[#17171c]">Wasta</span>
          </Link>
        </div>

        <div className="bg-white rounded-[22px] p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-[#17171c] mb-2">Create your account</h1>
          <p className="text-sm text-[#93939f] mb-8">Join Wasta and start getting referred</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-[#b30000] text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17171c]">I want to</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue('role', option.value as 'SEEKER' | 'POSTER' | 'BOTH')}
                    className={cn(
                      'relative flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                      selectedRole === option.value
                        ? 'border-[#17171c] bg-[#17171c] text-white'
                        : 'border-[#d9d9dd] hover:border-[#17171c] text-[#17171c]'
                    )}
                  >
                    {selectedRole === option.value && (
                      <CheckCircle size={14} className="absolute top-2 right-2 text-white" />
                    )}
                    <span className="text-xs font-semibold">{option.label}</span>
                    <span className={cn('text-[10px] leading-tight', selectedRole === option.value ? 'text-white/70' : 'text-[#93939f]')}>
                      {option.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Full name"
              placeholder="Alex Johnson"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                hint="Use at least 8 characters with letters and numbers"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[34px] text-[#93939f] hover:text-[#17171c] transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#93939f] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#17171c] font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-[#93939f] mt-4">
            By creating an account, you agree to our{' '}
            <Link href="#" className="underline">Terms of Service</Link> and{' '}
            <Link href="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
