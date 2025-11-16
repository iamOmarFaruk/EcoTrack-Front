import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { eventApi } from '../services/api.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function AddEvent() {
  useDocumentTitle('Create Event')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    date: '',
    location: '',
    capacity: '',
    duration: '',
    requirements: '',
    benefits: '',
    image: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Title validation (3-100 chars)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3 || formData.title.length > 100) {
      newErrors.title = 'Title must be between 3 and 100 characters'
    }

    // Description validation (10-200 chars)
    if (!formData.description.trim()) {
      newErrors.description = 'Short description is required'
    } else if (formData.description.length < 10 || formData.description.length > 200) {
      newErrors.description = 'Description must be between 10 and 200 characters'
    }

    // Detailed description validation (50-2000 chars)
    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription = 'Detailed description is required'
    } else if (formData.detailedDescription.length < 50 || formData.detailedDescription.length > 2000) {
      newErrors.detailedDescription = 'Detailed description must be between 50 and 2000 characters'
    }

    // Date validation (must be at least 24 hours in future)
    if (!formData.date) {
      newErrors.date = 'Event date is required'
    } else {
      const selectedDate = new Date(formData.date)
      const minDate = new Date()
      minDate.setHours(minDate.getHours() + 24)
      if (selectedDate < minDate) {
        newErrors.date = 'Event date must be at least 24 hours in the future'
      }
    }

    // Location validation (3-100 chars)
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.length < 3 || formData.location.length > 100) {
      newErrors.location = 'Location must be between 3 and 100 characters'
    }

    // Capacity validation (1-10000)
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required'
    } else if (formData.capacity < 1 || formData.capacity > 10000) {
      newErrors.capacity = 'Capacity must be between 1 and 10000'
    }

    // Duration validation (3-50 chars)
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    } else if (formData.duration.length < 3 || formData.duration.length > 50) {
      newErrors.duration = 'Duration must be between 3 and 50 characters'
    }

    // Requirements validation (10-500 chars)
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required'
    } else if (formData.requirements.length < 10 || formData.requirements.length > 500) {
      newErrors.requirements = 'Requirements must be between 10 and 500 characters'
    }

    // Benefits validation (10-500 chars)
    if (!formData.benefits.trim()) {
      newErrors.benefits = 'Benefits are required'
    } else if (formData.benefits.length < 10 || formData.benefits.length > 500) {
      newErrors.benefits = 'Benefits must be between 10 and 500 characters'
    }

    // Image validation (required, must be valid URL)
    if (!formData.image.trim()) {
      newErrors.image = 'Event image is required'
    } else {
      try {
        new URL(formData.image)
        if (!formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
          newErrors.image = 'Image URL must start with http:// or https://'
        }
      } catch {
        newErrors.image = 'Please enter a valid image URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      showError('You must be logged in to create an event')
      navigate('/login')
      return
    }

    if (!user.name) {
      showError('User profile is not complete. Please update your profile.')
      return
    }

    if (!validateForm()) {
      showError('Please fix the form errors')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const eventData = {
        ...formData,
        organizer: user.name,
        capacity: parseInt(formData.capacity),
        date: new Date(formData.date).toISOString()
      }

      const response = await eventApi.create(eventData)
      const event = response?.data?.event || response?.event

      showSuccess('Event created successfully!')
      
      // Navigate to the event detail page using slug (SEO-friendly)
      if (event?.slug) {
        navigate(`/events/${event.slug}`)
      } else if (event?._id) {
        navigate(`/events/${event._id}`)
      } else {
        navigate('/events')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      
      // Handle validation errors from backend
      if (error.data?.error?.details) {
        const backendErrors = {}
        error.data.error.details.forEach(err => {
          backendErrors[err.field] = err.message
        })
        setErrors(backendErrors)
        showError('Please fix the validation errors')
      } else {
        showError(error.message || 'Failed to create event')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/events')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create New Event
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Organize an eco-friendly event and bring your community together
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.title ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g., City Tree Planting Marathon"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.title.length}/100 characters</p>
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.description ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Brief description for event cards (10-200 characters)"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.description.length}/200 characters</p>
              </div>

              {/* Detailed Description */}
              <div>
                <label htmlFor="detailedDescription" className="block text-sm font-medium text-slate-900 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="detailedDescription"
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.detailedDescription ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Full description with all details about the event (50-2000 characters)"
                />
                {errors.detailedDescription && <p className="mt-1 text-sm text-red-500">{errors.detailedDescription}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.detailedDescription.length}/2000 characters</p>
              </div>

              {/* Date and Location Row */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-900 mb-2">
                    Event Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.date ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                  <p className="mt-1 text-xs text-slate-500">Must be at least 24 hours from now</p>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-900 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.location ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Central Park, New York"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-900 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.duration ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g., 4 hours"
                />
                {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-slate-900 mb-2">
                  Maximum Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.capacity ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g., 100"
                />
                {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
                <p className="mt-1 text-xs text-slate-500">Maximum participants (1-10000)</p>
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-slate-900 mb-2">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.requirements ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="What participants need to bring or prepare (10-500 characters)"
                />
                {errors.requirements && <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.requirements.length}/500 characters</p>
              </div>

              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-slate-900 mb-2">
                  Benefits <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.benefits ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="What participants will receive or gain (10-500 characters)"
                />
                {errors.benefits && <p className="mt-1 text-sm text-red-500">{errors.benefits}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.benefits.length}/500 characters</p>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-900 mb-2">
                  Event Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.image ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="https://images.unsplash.com/photo-... or any valid image URL"
                />
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  Enter a valid landscape image URL (from Unsplash, Pexels, or any other source)
                </p>
                
                {/* Image Preview */}
                {formData.image && (formData.image.startsWith('http://') || formData.image.startsWith('https://')) && (
                  <div className="mt-4 rounded-lg overflow-hidden border-2 border-green-200 shadow-md">
                    <img 
                      src={formData.image} 
                      alt="Event preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-red-50 flex items-center justify-center"><p class="text-red-600 text-sm">Failed to load image. Please check the URL.</p></div>'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
