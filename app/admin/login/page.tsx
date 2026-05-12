'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
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
      setError('Invalid admin credentials.')
      return
    }

    const res = await fetch('/api/auth/me')
    const user = await res.json()
    if (user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      setError('You do not have admin access.')
      await signIn('credentials', { redirect: false }) // Sign out
    }
  }

  return (
    <div className="min-h-screen bg-[#071829] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ff7759] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Portal</h1>
          <p className="text-sm text-[#93939f] mt-2">Wasta platform administration</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[22px] p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#d9d9dd] block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="admin@wasta.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-[#93939f] focus:outline-none focus:border-[#ff7759] focus:ring-2 focus:ring-[#ff7759]/20 text-sm"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-[#d9d9dd] block mb-1.5">Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-white placeholder:text-[#93939f] focus:outline-none focus:border-[#ff7759] focus:ring-2 focus:ring-[#ff7759]/20 text-sm"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[34px] text-[#93939f] hover:text-white transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ff7759] hover:bg-[#e85c3a] text-white rounded-[32px] py-3 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#93939f] mt-6">
          Not an admin?{' '}
          <Link href="/login" className="text-white hover:underline">
            Go to main login
          </Link>
        </p>
      </div>
    </div>
  )
}
