import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import SectionHeading from '../components/SectionHeading.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

const schema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  photoURL: z.string().url('Valid URL required').optional().or(z.literal('')),
})

export default function Settings() {
  const isLoading = useMinimumLoading(300)
  const { auth, updateUserProfile } = useAuth()
  const [previewPhoto, setPreviewPhoto] = useState('')
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: auth.user?.name || '',
      photoURL: auth.user?.avatarUrl || '',
    }
  })

  const watchedPhotoURL = watch('photoURL')

  const onSubmit = async (values) => {
    try {
      await updateUserProfile(values)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handlePhotoPreview = () => {
    setPreviewPhoto(watchedPhotoURL)
  }

  const clearPhoto = () => {
    setValue('photoURL', '')
    setPreviewPhoto('')
  }

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading title="Settings" subtitle="Manage your account preferences" />
      
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Profile Photo</label>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <ProfileAvatar 
                  user={previewPhoto ? { ...auth.user, avatarUrl: previewPhoto } : auth.user} 
                  size="xl" 
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <input 
                    {...register('photoURL')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    placeholder="https://example.com/your-photo.jpg" 
                  />
                  {errors.photoURL && (
                    <p className="mt-1 text-sm text-red-600">{errors.photoURL.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handlePhotoPreview}
                    disabled={!watchedPhotoURL}
                  >
                    Preview
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={clearPhoto}
                  >
                    Clear
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter a direct URL to your profile photo. Leave empty to use your initials.
                </p>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input 
              {...register('displayName')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Your display name" 
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              value={auth.user?.email || ''}
              disabled
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500" 
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Profile Photos</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Google Sign-in users automatically get their Google profile photo</li>
          <li>• You can override this by adding a custom photo URL</li>
          <li>• If no photo is available, your initials will be displayed</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
        </ul>
      </div>
    </div>
  )
}
