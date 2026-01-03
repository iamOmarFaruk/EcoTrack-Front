import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { useEffect } from 'react'
import { defaultImages } from '../config/env.js'
import Logo from '../components/Logo.jsx'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  useDocumentTitle('Login')
  const { login, loginWithGoogle, loading, auth } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

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
      await login(values)
      const redirectTo = sessionStorage.getItem('redirectTo') || '/'
      sessionStorage.removeItem('redirectTo')
      navigate(redirectTo, { replace: true })
    } catch (e) {
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      const redirectTo = sessionStorage.getItem('redirectTo') || '/'
      sessionStorage.removeItem('redirectTo')
      navigate(redirectTo, { replace: true })
    } catch (e) {
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
              Powering the transition to a <span className="underline decoration-primary decoration-4 underline-offset-8">sustainable future</span>.
            </h2>
            <p className="max-w-md text-lg text-white/80">
              Join thousands of eco-conscious individuals making a real impact every single day.
            </p>
          </div>

          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} EcoTrack. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex w-full items-center justify-center p-8 bg-surface lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight lg:hidden">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-heading">EcoTrack</span>
          </Link>

          <StaggerContainer>
            <StaggerItem>
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="mt-2 text-sm text-text/60">Enter your credentials to access your account.</p>
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
              </StaggerItem>
              <StaggerItem>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </StaggerItem>
            </form>

            <StaggerItem className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-text/40 uppercase tracking-wider">Or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </StaggerItem>

            <StaggerItem className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-3 border-border hover:bg-muted/50"
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </StaggerItem>

            <StaggerItem className="mt-8 text-center text-sm">
              <span className="text-text/60">New to EcoTrack?</span>{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                Create an account
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </div>
  )
}


