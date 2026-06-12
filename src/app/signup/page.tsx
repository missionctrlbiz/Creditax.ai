'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { signUpWithOtp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setStatus('loading')
    setErrorMessage('')

    const { error } = await signUpWithOtp(data.email, data.fullName)

    if (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Failed to create account')
    } else {
      setStatus('success')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="bg-surface-base flex flex-col items-center justify-center relative p-10 max-md:hidden select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-no-repeat bg-contain pointer-events-none opacity-50"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'80\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.08\' stroke-width=\'1\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'60\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.06\' stroke-width=\'.8\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'40\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.05\' stroke-width=\'.6\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'20\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.4\'/%3E%3Cpath d=\'M100 20 L180 70 L180 130 L100 180 L20 130 L20 70Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.04\' stroke-width=\'.5\'/%3E%3Cpath d=\'M100 40 L160 80 L160 120 L100 160 L40 120 L40 80Z\' fill=\'none\' stroke=\'%230D7377\' stroke-opacity=\'.03\' stroke-width=\'.4\'/%3E%3C/svg%3E")'
          }}
        />
        <div className="w-[140px] relative z-10">
          <img src="/logo.png" alt="Creditax.ai" className="w-full h-auto" />
        </div>
        <div className="text-brand-primary text-base tracking-[0.08em] mt-4 text-center relative z-10 font-semibold font-sans">
          Tax Smart. Borrow Smart.
        </div>
        <div className="absolute bottom-10 text-text-secondary text-[13px] text-center max-w-[320px]">
          Join 2,400+ Nigerian developers and accountants
        </div>
      </div>

      <div className="bg-surface-raised flex flex-col items-center justify-center p-10 relative min-h-screen max-sm:px-5">
        <div className="bg-surface-overlay border border-border-default rounded-[20px] p-10 w-full max-w-[400px] shadow-card">
          <h1 className="text-3xl font-bold mb-2 font-sans tracking-tight">Create account</h1>
          <p className="text-text-secondary text-[15px] mb-6">Start your Creditax journey today</p>

          {status === 'success' ? (
            <div className="flex flex-col gap-4">
              <div className="bg-success-bg border border-success-border rounded-xl p-4 text-success-text text-sm">
                Check your email for a link to complete signup
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="text-text-muted text-sm hover:text-text-primary transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {status === 'error' && (
                <div className="bg-error-bg border border-error-border rounded-xl p-4 text-error-text text-sm">
                  {errorMessage}
                </div>
              )}

              <Input
                type="text"
                placeholder="Adebayo Johnson"
                label="Full name"
                error={!!errors.fullName}
                disabled={status === 'loading'}
                {...register('fullName')}
              />
              {errors.fullName && (
                <span className="text-error-text text-xs -mt-2">{errors.fullName.message}</span>
              )}

              <Input
                type="email"
                placeholder="you@company.com"
                label="Email address"
                error={!!errors.email}
                disabled={status === 'loading'}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-error-text text-xs -mt-2">{errors.email.message}</span>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  {...register('agreedToTerms')}
                  className="mt-1 w-4 h-4 rounded border-border-strong bg-surface-base text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="agreedToTerms" className="text-text-secondary text-sm cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreedToTerms && (
                <span className="text-error-text text-xs -mt-2">{errors.agreedToTerms.message}</span>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="xl"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-text-secondary text-sm text-center">
                Already have an account? <Link href="/login" className="text-brand-primary font-semibold hover:underline">Sign in →</Link>
              </p>
            </form>
          )}
        </div>
        <div className="absolute bottom-6 text-text-muted text-xs text-center">
          © 2026 Creditax.ai · Privacy · Terms
        </div>
      </div>
    </div>
  )
}