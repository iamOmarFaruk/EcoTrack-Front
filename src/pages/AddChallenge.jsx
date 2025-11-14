import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { challengeApi } from '../services/api.js'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  category: z.enum(['Waste Reduction', 'Energy Conservation', 'Food', 'Water', 'Community'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be less than 500 characters'),
  duration: z.string().min(1, 'Duration is required'),
  target: z.string().min(1, 'Target is required').max(100, 'Target must be less than 100 characters'),
  impactMetric: z.string().min(1, 'Impact metric is required').max(50, 'Impact metric must be less than 50 characters'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate > startDate
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

export default function AddChallenge() {
  useDocumentTitle('Create New Challenge - EcoTrack')
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const user = auth.user
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'Waste Reduction', // Set default category
    }
  })

  const watchedImageUrl = watch('imageUrl')

  // Update image preview when URL changes
  useEffect(() => {
    if (watchedImageUrl && watchedImageUrl !== imagePreview) {
      // Simple URL validation
      try {
        new URL(watchedImageUrl)
        setImagePreview(watchedImageUrl)
      } catch {
        setImagePreview('')
      }
    }
  }, [watchedImageUrl, imagePreview])

  const onSubmit = async (data) => {
    try {
      // Get current Firebase user directly
      const { auth: firebaseAuth } = await import('../config/firebase.js')
      const currentUser = firebaseAuth.currentUser
      const token = currentUser ? await currentUser.getIdToken() : null
      
      // Use Firebase user data as primary source
      const userData = user || {
        uid: currentUser?.uid,
        email: currentUser?.email,
        name: currentUser?.displayName || currentUser?.email
      }
      
      // Create the challenge data with user information
      const challengeData = {
        title: data.title,
        category: data.category,
        description: data.description,
        duration: data.duration,
        target: data.target,
        impactMetric: data.impactMetric,
        imageUrl: data.imageUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        // Include user identification from Firebase directly
        createdBy: userData.email,
        createdById: userData.uid,
        creatorName: userData.name || userData.email,
      }
      
      // Validate that we have required user data
      if (!userData.uid || !userData.email) {
        throw new Error('User authentication data is missing. Please try logging out and logging in again.')
      }
      
      // Send to backend API
      const newChallenge = await challengeApi.create(challengeData)
      
      toast.success('Challenge created successfully!')
      reset()
      setImagePreview('')
      
      // Navigate to the new challenge or challenges page
      navigate('/challenges')
      
    } catch (error) {
      toast.error(error.message || 'Failed to create challenge. Please try again.')
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Challenge</h1>
        <p className="mt-2 text-gray-600">
          Share your eco-friendly challenge idea with the community. Help others make a positive environmental impact!
        </p>
        <div className="mt-4 flex items-center space-x-2 text-sm text-emerald-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Logged in as: {user?.name || user?.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Challenge Title *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="e.g., Plastic-Free Week Challenge"
                {...register('title')} 
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Category *</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" {...register('category')}>
                {['Waste Reduction', 'Energy Conservation', 'Food', 'Water', 'Community'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Duration *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="e.g., 7 days, 2 weeks, 1 month" 
                {...register('duration')} 
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description *</label>
              <textarea 
                rows="4" 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="Describe your challenge, its goals, and how participants can get involved..."
                {...register('description')} 
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              <p className="mt-1 text-sm text-gray-500">Minimum 20 characters, maximum 500 characters</p>
            </div>
          </div>
        </div>

        {/* Challenge Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Challenge Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Target Goal *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="e.g., Reduce plastic usage by 50%" 
                {...register('target')} 
              />
              {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>}
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Impact Metric *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="e.g., Bottles avoided, CO₂ saved, kWh reduced" 
                {...register('impactMetric')} 
              />
              {errors.impactMetric && <p className="mt-1 text-sm text-red-600">{errors.impactMetric.message}</p>}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Timeline</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Start Date *</label>
              <input 
                type="date" 
                min={getMinDate()}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                {...register('startDate')} 
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">End Date *</label>
              <input 
                type="date" 
                min={getMinDate()}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                {...register('endDate')} 
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Challenge Image</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Image URL *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="https://example.com/your-image.jpg"
                {...register('imageUrl')} 
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Use high-quality images (1200x800px recommended). Try{' '}
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">
                  Unsplash
                </a>{' '}
                for free stock photos.
              </p>
            </div>
            
            {imagePreview && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Preview</label>
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Challenge preview" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ready to submit?</h3>
              <p className="text-sm text-gray-600 mt-1">Your challenge will be reviewed before being published to the community.</p>
            </div>
            <Button 
              type="submit" 
              className="px-8 py-3 text-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Challenge'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}


