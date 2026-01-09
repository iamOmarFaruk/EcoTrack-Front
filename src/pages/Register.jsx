import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useEffect, useState } from 'react'
import { defaultImages } from '../config/env.js'
import Logo from '../components/Logo.jsx'
import { Typewriter } from '../components/ui/Typewriter.jsx'

const passwordRules = z.string()
  .min(6, 'Min 6 characters')
  .regex(/[A-Z]/, 'At least 1 uppercase letter')
  .regex(/[a-z]/, 'At least 1 lowercase letter')
  .regex(/[^A-Za-z0-9]/, 'At least 1 special character')

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  photoUrl: z.string().url('Valid URL required').optional().or(z.literal('')),
  password: passwordRules,
})

export default function Register() {
  useDocumentTitle('Register')
  const { register: registerUser, loginWithGoogle, loading, auth } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(schema),
  })
  const [imageError, setImageError] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && auth.isLoggedIn) {
      const redirectTo = sessionStorage.getItem('redirectTo') || '/'
      sessionStorage.removeItem('redirectTo')
      navigate(redirectTo, { replace: true })
    }
  }, [auth.isLoggedIn, loading, navigate])

  const onSubmit = async (values) => {
    try {
      sessionStorage.removeItem('redirectTo')
      await registerUser(values)
      window.location.href = '/profile'
    } catch (e) {
    }
  }

  const handleGoogleSignup = async () => {
    try {
      sessionStorage.removeItem('redirectTo')
      await loginWithGoogle()
      window.location.href = '/profile'
    } catch (e) {
    }
  }

  const pwd = watch('password') || ''
  const photoUrl = watch('photoUrl') || ''

  const ruleChecks = [
    { ok: pwd.length >= 6, label: 'Min 6 characters' },
    { ok: /[A-Z]/.test(pwd), label: 'At least 1 uppercase letter' },
    { ok: /[a-z]/.test(pwd), label: 'At least 1 lowercase letter' },
    { ok: /[^A-Za-z0-9]/.test(pwd), label: 'At least 1 special character' },
  ]

  useEffect(() => {
    setImageError(false)
  }, [photoUrl])

  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side: Hero Image (Hidden on mobile) */}
      <div className="hidden lg:relative lg:block lg:w-1/2">
        <img
          src={defaultImages.registerHero}
          alt="Clean Nature"
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
              Begin your journey towards <span className="underline decoration-primary decoration-4 underline-offset-8">conscious living</span>.
            </h2>
            <p className="max-w-md text-lg text-white/80 min-h-[4.5rem]">
              <Typewriter
                text="Create an account to track your carbon footprint, join challenges, and connect with a community that cares."
                delay={1000}
              />
            </p>
          </div>

          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} EcoTrack. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex w-full items-center justify-center p-8 bg-surface lg:w-1/2 overflow-y-auto">
        <div className="w-full max-w-md py-12 lg:py-0">
          {/* Mobile Logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight lg:hidden">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-heading">EcoTrack</span>
          </Link>

          <StaggerContainer>
            <StaggerItem>
              <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
              <p className="mt-2 text-sm text-text/60">Join our community and start making a difference.</p>
            </StaggerItem>

            <StaggerItem className="mt-8">
              <Button
                type="button"
                variant="secondary"
                className="w-full h-11 flex items-center justify-center gap-3 border shadow-sm hover:bg-muted/50 font-semibold"
                onClick={handleGoogleSignup}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </Button>
            </StaggerItem>

            <StaggerItem className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-text/40 uppercase tracking-wider">Or register with email</span>
              <div className="h-px flex-1 bg-border" />
            </StaggerItem>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StaggerItem>
                  <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                  <input className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Doe" {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                </StaggerItem>
                <StaggerItem>
                  <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                  <input className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="name@example.com" {...register('email')} />
                  {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                </StaggerItem>
              </div>

              <StaggerItem>
                <label className="mb-1.5 block text-sm font-medium">Photo URL (Optional)</label>
                <div className="flex items-center gap-4">
                  {photoUrl && !errors.photoUrl && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-muted shrink-0">
                      {!imageError ? (
                        <img
                          src={photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text/40">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  <input className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Avatar URL" {...register('photoUrl')} />
                </div>
                {errors.photoUrl && <p className="mt-1 text-xs text-danger">{errors.photoUrl.message}</p>}
              </StaggerItem>

              <StaggerItem>
                <label className="mb-1.5 block text-sm font-medium">Password</label>
                <input type="password" className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="••••••••" {...register('password')} />
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                  {ruleChecks.map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <div className={`h-1 flex-1 rounded-full transition-colors ${r.ok ? 'bg-primary' : 'bg-border'}`} />
                      <span className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-tight ${r.ok ? 'text-primary' : 'text-text/40'}`}>
                        {r.label.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
                {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
              </StaggerItem>

              <StaggerItem className="pt-2">
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Get Started'}
                </Button>
              </StaggerItem>
            </form>

            <StaggerItem className="mt-8 text-center text-sm">
              <span className="text-text/60">Already have an account?</span>{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                Sign In
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </div>
  )
}
