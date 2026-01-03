import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import { showSuccess, showError } from '../utils/toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { defaultImages } from '../config/env.js'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'
import Logo from '../components/Logo.jsx'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPassword() {
  useDocumentTitle('Forgot Password')
  const { resetPassword, loading, auth } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && auth.isLoggedIn) {
      navigate('/', { replace: true })
    }
  }, [auth.isLoggedIn, loading, navigate])

  const onSubmit = async (values) => {
    try {
      await resetPassword(values.email)
      showSuccess('Password reset email sent! Check your inbox.')
      reset()
    } catch (e) {
      showError(e.message)
    }
  }

  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side: Hero Image (Hidden on mobile) */}
      <div className="hidden lg:relative lg:block lg:w-1/2">
        <img
          src={defaultImages.loginHero}
          alt="Eco Energy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Logo className="h-8 w-8 text-primary-light" />
            <span className="font-heading font-bold">EcoTrack</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Don't worry, even nature has <span className="underline decoration-primary decoration-4 underline-offset-8">cycles of renewal</span>.
            </h2>
            <p className="max-w-md text-lg text-white/80">
              Recover your account and continue your journey towards a greener world.
            </p>
          </div>

          <div className="text-sm text-white/60">
            © 2024 EcoTrack. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side: Recovery Form */}
      <div className="flex w-full items-center justify-center p-8 bg-surface lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight lg:hidden">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-heading">EcoTrack</span>
          </Link>

          <StaggerContainer>
            <StaggerItem>
              <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
              <p className="mt-2 text-sm text-text/60">Enter your email and we'll send you a recovery link.</p>
            </StaggerItem>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <StaggerItem>
                <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                <input
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="name@example.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
              </StaggerItem>
              <StaggerItem>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
                </Button>
              </StaggerItem>
            </form>

            <StaggerItem className="mt-8 text-center text-sm border-t border-border pt-6">
              <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </div>
  )
}



