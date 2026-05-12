'use client'

import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

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
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#edfce9] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="font-display text-xl font-semibold text-[#17171c] mb-2">Check your email</h1>
              <p className="text-sm text-[#93939f] mb-6">
                If an account exists for {email}, you&apos;ll receive a password reset link shortly.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-[#17171c] mb-2">Reset Password</h1>
              <p className="text-sm text-[#93939f] mb-8">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="w-full" onClick={() => setSubmitted(true)}>
                  Send Reset Link
                </Button>
              </div>
              <p className="text-center text-sm text-[#93939f] mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-[#17171c] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
