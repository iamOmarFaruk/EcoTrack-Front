import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPassword() {
  useDocumentTitle('Forgot Password')
  const isLoading = useMinimumLoading(300)
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

  if (isLoading || loading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <p className="mt-1 text-sm text-heading">We'll send a reset link to your email address.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        Remember your password?{' '}
        <Link to="/login" className="text-text hover:text-primary font-medium">Sign In</Link>
      </div>
    </div>
  )
}


