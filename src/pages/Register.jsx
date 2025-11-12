import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

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
  const isLoading = useMinimumLoading(300)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Registered (mock). You can now login.')
    navigate('/login')
  }

  const pwd = watch('password') || ''
  const ruleChecks = [
    { ok: pwd.length >= 6, label: 'Min 6 characters' },
    { ok: /[A-Z]/.test(pwd), label: 'At least 1 uppercase letter' },
    { ok: /[a-z]/.test(pwd), label: 'At least 1 lowercase letter' },
    { ok: /[^A-Za-z0-9]/.test(pwd), label: 'At least 1 special character' },
  ]

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Join EcoTrack</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="w-full rounded-md border px-3 py-2" placeholder="Your name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Photo URL</label>
          <input className="w-full rounded-md border px-3 py-2" placeholder="https://..." {...register('photoUrl')} />
          {errors.photoUrl && <p className="mt-1 text-sm text-red-600">{errors.photoUrl.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="w-full rounded-md border px-3 py-2" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          <ul className="mt-2 space-y-1 text-xs">
            {ruleChecks.map((r) => (
              <li key={r.label} className={r.ok ? 'text-emerald-700' : 'text-slate-500'}>
                {r.ok ? '✓' : '•'} {r.label}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Register'}
        </Button>
      </form>
      <div className="mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-slate-700 hover:text-emerald-700">Login</Link>
      </div>
    </div>
  )
}


