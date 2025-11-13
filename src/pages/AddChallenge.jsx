import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Waste Reduction', 'Energy Conservation', 'Food', 'Water', 'Community']),
  description: z.string().min(10, 'Description must be at least 10 chars'),
  duration: z.string().min(1, 'Duration is required'),
  target: z.string().min(1, 'Target is required'),
  impactMetric: z.string().min(1, 'Impact metric is required'),
  imageUrl: z.string().url('Valid image URL required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

export default function AddChallenge() {
  useDocumentTitle('Create Challenge')
  const isLoading = useMinimumLoading(300)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 900))
    toast.success('Challenge created (mock).')
    reset()
  }

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Create Challenge</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('title')} />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('category')}>
            {['Waste Reduction', 'Energy Conservation', 'Food', 'Water', 'Community'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Duration</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g., 14 days" {...register('duration')} />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Target</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g., 20% reduction" {...register('target')} />
          {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Impact Metric</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g., CO₂ saved" {...register('impactMetric')} />
          {errors.impactMetric && <p className="mt-1 text-sm text-red-600">{errors.impactMetric.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <input className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="https://..." {...register('imageUrl')} />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Start Date</label>
          <input type="date" className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('startDate')} />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">End Date</label>
          <input type="date" className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('endDate')} />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea rows="4" className="w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('description')} />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="h-10" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Challenge'}
          </Button>
        </div>
      </form>
    </div>
  )
}


