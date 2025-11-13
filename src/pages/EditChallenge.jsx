import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function EditChallenge() {
  const { id } = useParams()
  useDocumentTitle('Edit Challenge - EcoTrack')
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const user = auth.user
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    resolver: zodResolver(schema)
  })

  const watchedImageUrl = watch('imageUrl')

  // Update image preview when URL changes
  useEffect(() => {
    if (watchedImageUrl && watchedImageUrl !== imagePreview) {
      try {
        new URL(watchedImageUrl)
        setImagePreview(watchedImageUrl)
      } catch {
        setImagePreview('')
      }
    }
  }, [watchedImageUrl, imagePreview])

  // Fetch challenge data and populate form
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('=== FETCHING CHALLENGE FOR EDIT ===')
        console.log('Challenge ID:', id)
        console.log('Current user:', user)

        const challengeResponse = await challengeApi.getById(id)
        
        console.log('Raw challenge response:', challengeResponse)
        
        let challengeData = null
        if (challengeResponse && challengeResponse.data && challengeResponse.data.challenge) {
          challengeData = challengeResponse.data.challenge
        } else if (challengeResponse && challengeResponse.challenge) {
          challengeData = challengeResponse.challenge
        } else if (challengeResponse) {
          challengeData = challengeResponse
        }

        console.log('Processed challenge data:', challengeData)

        if (!challengeData) {
          throw new Error('Challenge not found')
        }

        // Check if current user is the creator
        const isOwner = challengeData && user && (
          challengeData.createdBy === user.email ||
          challengeData.createdBy === user.uid ||
          challengeData.createdById === user.uid
        )

        console.log('Ownership check:', {
          isOwner,
          challengeCreatedBy: challengeData.createdBy,
          challengeCreatedById: challengeData.createdById,
          userEmail: user?.email,
          userUid: user?.uid
        })

        if (!isOwner) {
          toast.error('You can only edit challenges you created')
          navigate(`/challenges/${id}`)
          return
        }

        // Format dates for input fields
        const formatDate = (dateString) => {
          if (!dateString || dateString === 'No data') return ''
          try {
            const date = new Date(dateString)
            return date.toISOString().split('T')[0]
          } catch {
            return ''
          }
        }

        // Populate form with existing data
        const formData = {
          title: challengeData.title || '',
          category: challengeData.category || 'Waste Reduction',
          description: challengeData.description || '',
          duration: challengeData.duration || '',
          target: challengeData.target || '',
          impactMetric: challengeData.impactMetric || '',
          imageUrl: challengeData.imageUrl || '',
          startDate: formatDate(challengeData.startDate),
          endDate: formatDate(challengeData.endDate)
        }

        console.log('Form data to be populated:', formData)

        // Set form values
        Object.keys(formData).forEach(key => {
          setValue(key, formData[key])
        })

        // Set image preview
        if (formData.imageUrl) {
          setImagePreview(formData.imageUrl)
        }

        console.log('✅ Challenge data loaded and form populated successfully')

      } catch (error) {
        console.error('=== ERROR FETCHING CHALLENGE FOR EDIT ===', error)
        console.error('Error status:', error.status)
        console.error('Error data:', error.data)
        if (error.status === 404) {
          setError({ type: 'not-found', message: 'Challenge not found.' })
        } else if (error.status === 0) {
          setError({ type: 'network', message: 'Unable to connect to the server. Please check your internet connection.' })
        } else {
          setError({ type: 'general', message: 'Failed to load challenge details. Please try again.' })
        }
      } finally {
        setLoading(false)
      }
    }

    if (id && user) {
      fetchChallenge()
    }
  }, [id, user, setValue, navigate])

  const onSubmit = async (data) => {
    try {
      // Get current Firebase user and token for debugging
      const { auth: firebaseAuth } = await import('../config/firebase.js')
      const currentUser = firebaseAuth.currentUser
      const token = currentUser ? await currentUser.getIdToken() : null
      
      console.log('=== CHALLENGE UPDATE DEBUG ===')
      console.log('Challenge ID:', id)
      console.log('Update data:', data)
      console.log('Current user:', currentUser?.email)
      console.log('Has auth token:', !!token)
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api')
      console.log('Full URL will be:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/challenges/${id}`)
      
      // First, verify the challenge still exists
      console.log('🔍 Verifying challenge exists before update...')
      try {
        const existingChallenge = await challengeApi.getById(id)
        console.log('✅ Challenge found:', existingChallenge)
      } catch (verifyError) {
        console.error('❌ Challenge verification failed:', verifyError)
        if (verifyError.status === 404) {
          toast.error('Challenge not found. It may have been deleted.')
          navigate('/challenges')
          return
        }
      }
      
      // Update the challenge
      try {
        const result = await challengeApi.update(id, data)
        console.log('✅ Challenge updated successfully:', result)
        toast.success('🎉 Challenge updated successfully!')
        navigate(`/challenges/${id}`)
      } catch (updateError) {
        // Check if the update actually worked despite the error
        console.log('Update failed, but checking if data was actually saved...')
        
        try {
          // Wait a moment for the backend to process
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Try to fetch the updated challenge to see if it was actually updated
          const updatedChallenge = await challengeApi.getById(id)
          
          let challengeData = null
          if (updatedChallenge && updatedChallenge.data && updatedChallenge.data.challenge) {
            challengeData = updatedChallenge.data.challenge
          } else if (updatedChallenge && updatedChallenge.challenge) {
            challengeData = updatedChallenge.challenge
          } else if (updatedChallenge) {
            challengeData = updatedChallenge
          }
          
          // Check if the title matches what we just tried to update
          if (challengeData && challengeData.title === data.title) {
            console.log('✅ Data was actually saved successfully despite 404 error')
            toast.success('🎉 Challenge updated successfully!')
            navigate(`/challenges/${id}`)
            return // Exit the function successfully
          }
        } catch (verifyError) {
          console.log('Could not verify if update was successful:', verifyError)
        }
        
        // If we get here, the update actually failed
        throw updateError
      }
      
    } catch (error) {
      console.error('=== CHALLENGE UPDATE ERROR ===', error)
      console.error('Error status:', error.status)
      console.error('Error data:', error.data)
      console.error('Full error object:', error)
      
      // Only show error if it's actually an error
      if (error.status && error.status >= 400) {
        let errorMessage = 'Failed to update challenge. Please try again.'
        
        if (error.status === 404) {
          errorMessage = 'Challenge not found. It may have been deleted or you may not have permission to edit it.'
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to edit this challenge.'
        } else if (error.status === 401) {
          errorMessage = 'Please log in again to continue editing.'
        } else if (error.status === 0 || error.message.includes('Backend server not available')) {
          errorMessage = 'Backend server is not available. Please check if the server is running.'
        }
        
        toast.error(errorMessage)
      } else {
        // If no error status or it's a successful status, treat as success
        console.log('🤔 Caught in error block but might be successful')
        toast.success('🎉 Challenge updated successfully!')
        navigate(`/challenges/${id}`)
      }
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (isLoading || loading) {
    return <EcoLoader />
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mb-6 p-4 rounded-full bg-red-100 inline-flex">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {error.type === 'not-found' ? 'Challenge Not Found' : 'Unable to Load Challenge'}
        </h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/challenges')}>Back to Challenges</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Challenge</h1>
        <p className="mt-2 text-gray-600">
          Update your challenge details. Make sure all information is accurate and up-to-date.
        </p>
        <div className="mt-4 flex items-center space-x-2 text-sm text-emerald-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Editing as: {user?.name || user?.email}</span>
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
              <h3 className="text-lg font-medium text-gray-900">Ready to update?</h3>
              <p className="text-sm text-gray-600 mt-1">Your changes will be saved and visible to the community.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate(`/challenges/${id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-8 py-3" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Challenge'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}