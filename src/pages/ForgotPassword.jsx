import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPassword() {
  useDocumentTitle('Forgot Password')
  const isLoading = useMinimumLoading(300)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Password reset email sent (mock).')
    reset()
  }

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <p className="mt-1 text-sm text-slate-900">We’ll send a reset link to your email.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  )
}


