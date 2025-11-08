import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  useDocumentTitle('Login')
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@eco.com', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Welcome back!')
      const redirectTo = sessionStorage.getItem('redirectTo') || '/'
      sessionStorage.removeItem('redirectTo')
      navigate(redirectTo, { replace: true })
    } catch (e) {
      toast.error('Invalid credentials (use admin@eco.com / admin)')
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Login to EcoTrack</h1>
      <p className="mt-1 text-sm text-slate-600">Use the demo account to continue.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="w-full rounded-md border px-3 py-2" placeholder="admin@eco.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="admin" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="h-10" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/register" className="text-slate-700 hover:text-emerald-700">Register</Link>
        <Link to="/forgot-password" className="text-slate-700 hover:text-emerald-700">Forgot Password</Link>
      </div>
    </div>
  )
}


