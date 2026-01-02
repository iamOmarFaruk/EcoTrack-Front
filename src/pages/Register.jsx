import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useEffect, useState } from 'react'

// ... schema definitions ...

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
      // Clear any stored redirect before registration
      sessionStorage.removeItem('redirectTo')
      await registerUser(values)
      // Force navigate to profile page with full page reload
      window.location.href = '/profile'
    } catch (e) {
    }
  }

  const handleGoogleSignup = async () => {
    try {
      // Clear any stored redirect before Google signup
      sessionStorage.removeItem('redirectTo')
      await loginWithGoogle()
      // Always go to profile after signup
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

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false)
  }, [photoUrl])

  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Join EcoTrack</h1>
      <p className="mt-1 text-sm text-heading">Create your account to get started.</p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 w-full h-10 flex items-center justify-center gap-2"
        onClick={handleGoogleSignup}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </Button>

      <div className="mt-4 text-center">
        <span className="px-2 text-sm text-text/70">or</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Your name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Photo URL (Optional)</label>

          {/* Profile Image Preview */}
          {photoUrl && !errors.photoUrl && (
            <div className="mb-3 flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={photoUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-text/60 text-center p-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-text/80">Profile Picture Preview</p>
                {imageError && (
                  <p className="text-xs text-secondary mt-1">Unable to load image</p>
                )}
              </div>
            </div>
          )}

          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="https://..." {...register('photoUrl')} />
          {errors.photoUrl && <p className="mt-1 text-sm text-danger">{errors.photoUrl.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
          <ul className="mt-2 space-y-1 text-xs">
            {ruleChecks.map((r) => (
              <li key={r.label} className={r.ok ? 'text-primary' : 'text-text/70'}>
                {r.ok ? '✓' : '•'} {r.label}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-text hover:text-primary font-medium">Sign In</Link>
      </div>
    </div>
  )
}


