'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      return
    }

    // Redirect based on role
    const res = await fetch('/api/auth/me')
    const user = await res.json()
    if (user?.role === 'ADMIN') {
      router.push('/admin')
    } else if (user?.role === 'POSTER') {
      router.push('/poster/dashboard')
    } else {
      router.push('/seeker/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#eeece7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#17171c] rounded-xl flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-display font-semibold text-2xl text-[#17171c]">Wasta</span>
          </Link>
        </div>

        <div className="bg-white rounded-[22px] p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-[#17171c] mb-2">Welcome back</h1>
          <p className="text-sm text-[#93939f] mb-8">Sign in to your Wasta account</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-[#b30000] text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="••••••••"
                error={errors.password?.message}
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

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[#1863dc] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#93939f] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#17171c] font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#93939f] mt-6">
          Admin?{' '}
          <Link href="/admin/login" className="hover:underline">
            Use the admin portal
          </Link>
        </p>
      </div>
    </div>
  )
}
