import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { defaultImages } from '../config/env.js'
import Logo from '../components/Logo.jsx'
import { Typewriter } from '../components/ui/Typewriter.jsx'
import { showError } from '../utils/toast.jsx'

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
      showError(e.message || 'Failed to sign in')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      const redirectTo = sessionStorage.getItem('redirectTo') || '/'
      sessionStorage.removeItem('redirectTo')
      navigate(redirectTo, { replace: true })
    } catch (e) {
      showError(e.message || 'Google sign-in failed')
    }
  }

  if (loading) {
    return <EcoLoader />
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const rightPanelVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const inputFocusVariants = {
    focus: { scale: 1.01, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side: Hero Image (Hidden on mobile) */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 lg:min-h-screen">
        <motion.img
          src={defaultImages.loginHero}
          alt="Eco Energy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Logo className="h-8 w-8 text-primary-light" />
              <span className="font-heading font-bold">EcoTrack</span>
            </Link>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold leading-tight text-white">
              Powering the transition to a <span className="underline decoration-primary decoration-4 underline-offset-8">sustainable future</span>.
            </h2>
            <p className="max-w-md text-lg text-white/80 min-h-[3rem]">
              <Typewriter
                text="Join thousands of eco-conscious individuals making a real impact every single day."
                delay={1000}
              />
            </p>
          </motion.div>

          <motion.div
            className="text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            © {new Date().getFullYear()} EcoTrack. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <motion.div
        className="flex w-full items-center justify-center p-8 bg-surface lg:w-1/2 lg:min-h-screen"
        variants={rightPanelVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight lg:hidden">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-heading font-bold text-heading">EcoTrack</span>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="mt-2 text-sm text-text/60">Enter your credentials to access your account.</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <motion.div variants={itemVariants}>
                <label className="mb-2.5 block text-sm font-semibold text-text/80 tracking-wide">Email Address</label>
                <motion.input
                  className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3.5 text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary focus:bg-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                  placeholder="name@example.com"
                  variants={inputFocusVariants}
                  whileFocus="focus"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-danger font-medium ml-1">{errors.email.message}</p>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-sm font-semibold text-text/80 tracking-wide">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <motion.input
                  type="password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3.5 text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary focus:bg-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                  placeholder="••••••••"
                  variants={inputFocusVariants}
                  whileFocus="focus"
                  {...register('password')}
                />
                {errors.password && <p className="mt-1 text-xs text-danger font-medium ml-1">{errors.password.message}</p>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 flex items-center gap-4">
              <motion.div
                className="h-px flex-1 bg-border"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              <span className="text-xs font-medium text-text/40 uppercase tracking-wider">Or continue with</span>
              <motion.div
                className="h-px flex-1 bg-border"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-11 flex items-center justify-center gap-3 border shadow-sm hover:bg-muted/50 dark:!bg-surface dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5"
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
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 text-center text-sm">
              <span className="text-text/60">New to EcoTrack?</span>{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                Create an account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
