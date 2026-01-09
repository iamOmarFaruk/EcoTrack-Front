import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { eventApi } from '../services/api.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
import { showSuccess, showError } from '../utils/toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    date: '',
    location: '',
    organizer: '',
    capacity: '',
    duration: '',
    requirements: '',
    benefits: '',
    image: '',
    category: '',
    status: 'active'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [notAuthorized, setNotAuthorized] = useState(false)

  useDocumentTitle(event ? `Edit ${event.title}` : 'Edit Event')

  useEffect(() => {
    fetchEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getById(id)
      const eventData = response?.data?.event || response?.event || response

      if (!eventData) {
        setNotFound(true)
        return
      }

      // Check if user is the creator
      if (eventData.createdBy !== user?.uid) {
        setNotAuthorized(true)
        return
      }

      setEvent(eventData)

      // Convert ISO date to datetime-local format
      const eventDate = new Date(eventData.date)
      const localDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)

      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        detailedDescription: eventData.detailedDescription || '',
        date: localDate,
        location: eventData.location || '',
        organizer: eventData.organizer || '',
        capacity: eventData.capacity || '',
        duration: eventData.duration || '',
        requirements: eventData.requirements || '',
        benefits: eventData.benefits || '',
        image: eventData.image || '',
        category: eventData.category || '',
        status: eventData.status || 'active'
      })
    } catch (error) {
      if (error.status === 404) {
        setNotFound(true)
      } else if (error.status === 403) {
        setNotAuthorized(true)
      } else {
        showError('Failed to load event')
      }
    } finally {
      setLoading(false)
    }
  }

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

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Event date is required'
    }

    // Location validation (3-100 chars)
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (formData.location.length < 3 || formData.location.length > 100) {
      newErrors.location = 'Location must be between 3 and 100 characters'
    }

    // Capacity validation (1-10000, cannot be less than current participants)
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required'
    } else if (formData.capacity < 1 || formData.capacity > 10000) {
      newErrors.capacity = 'Capacity must be between 1 and 10000'
    } else if (event && formData.capacity < event.registeredParticipants) {
      newErrors.capacity = `Cannot reduce capacity below current participant count (${event.registeredParticipants})`
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

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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

      // MUST use _id for update operation (id param could be slug)
      const eventId = event._id
      const response = await eventApi.update(eventId, eventData)
      const updatedEvent = response?.data?.event || response?.event

      showSuccess('Event updated successfully!')

      // Navigate to the event detail page using slug (SEO-friendly)
      if (updatedEvent?.slug) {
        navigate(`/events/${updatedEvent.slug}`)
      } else if (updatedEvent?._id) {
        navigate(`/events/${updatedEvent._id}`)
      } else {
        navigate(`/events/${id}`)
      }
    } catch (error) {
      // Handle validation errors from backend
      if (error.data?.error?.details) {
        const backendErrors = {}
        error.data.error.details.forEach(err => {
          backendErrors[err.field] = err.message
        })
        setErrors(backendErrors)
        showError('Please fix the validation errors')
      } else {
        showError(error.message || 'Failed to update event')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/events/${id}`)
  }

  if (loading) {
    return <EcoLoader />
  }

  if (notFound) {
    return <NotFound />
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-danger/10 to-surface py-12 space-y-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="w-20 h-20 bg-danger/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-heading mb-3">Access Denied</h1>
              <p className="text-lg text-text/80 mb-8">
                You don't have permission to edit this event
              </p>
              <Button onClick={() => navigate('/events')} variant="primary">
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-surface py-12 space-y-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-heading mb-3">
            Edit Event
          </h1>
          <p className="text-lg text-text/80 max-w-2xl mx-auto">
            Update your event details and settings
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-heading mb-2">
                  Event Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., City Tree Planting Marathon"
                />
                {errors.title && <p className="mt-1 text-sm text-danger">{errors.title}</p>}
                <p className="mt-1 text-xs text-text/70">{formData.title.length}/100 characters</p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-heading mb-2">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.category ? 'border-danger' : 'border-border'
                    }`}
                >
                  <option value="">Select a category</option>
                  <option value="Tree Planting">Tree Planting</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Ocean Cleanup">Ocean Cleanup</option>
                  <option value="Solar & Energy">Solar & Energy</option>
                  <option value="Community Workshop">Community Workshop</option>
                  <option value="Sustainable Gardening">Sustainable Gardening</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-danger">{errors.category}</p>}
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-heading mb-2">
                  Short Description <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.description ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="Brief description for event cards (10-200 characters)"
                />
                {errors.description && <p className="mt-1 text-sm text-danger">{errors.description}</p>}
                <p className="mt-1 text-xs text-text/70">{formData.description.length}/200 characters</p>
              </div>

              {/* Detailed Description */}
              <div>
                <label htmlFor="detailedDescription" className="block text-sm font-medium text-heading mb-2">
                  Detailed Description <span className="text-danger">*</span>
                </label>
                <textarea
                  id="detailedDescription"
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.detailedDescription ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="Full description with all details about the event (50-2000 characters)"
                />
                {errors.detailedDescription && <p className="mt-1 text-sm text-danger">{errors.detailedDescription}</p>}
                <p className="mt-1 text-xs text-text/70">{formData.detailedDescription.length}/2000 characters</p>
              </div>

              {/* Date and Location Row */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-heading mb-2">
                    Event Date & Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.date ? 'border-danger' : 'border-border'
                      }`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-danger">{errors.date}</p>}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-heading mb-2">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.location ? 'border-danger' : 'border-border'
                      }`}
                    placeholder="e.g., Central Park, New York"
                  />
                  {errors.location && <p className="mt-1 text-sm text-danger">{errors.location}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-heading mb-2">
                  Duration <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.duration ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="e.g., 4 hours"
                />
                {errors.duration && <p className="mt-1 text-sm text-danger">{errors.duration}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-heading mb-2">
                  Maximum Capacity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={event?.registeredParticipants || 1}
                  max="10000"
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.capacity ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="e.g., 100"
                />
                {errors.capacity && <p className="mt-1 text-sm text-danger">{errors.capacity}</p>}
                <p className="mt-1 text-xs text-text/70">
                  Maximum participants (1-10000). Current participants: {event?.registeredParticipants || 0}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-heading mb-2">
                  Requirements <span className="text-danger">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.requirements ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="What participants need to bring or prepare (10-500 characters)"
                />
                {errors.requirements && <p className="mt-1 text-sm text-danger">{errors.requirements}</p>}
                <p className="mt-1 text-xs text-text/70">{formData.requirements.length}/500 characters</p>
              </div>

              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-heading mb-2">
                  Benefits <span className="text-danger">*</span>
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.benefits ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="What participants will receive or gain (10-500 characters)"
                />
                {errors.benefits && <p className="mt-1 text-sm text-danger">{errors.benefits}</p>}
                <p className="mt-1 text-xs text-text/70">{formData.benefits.length}/500 characters</p>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-heading mb-2">
                  Event Image URL <span className="text-danger">*</span>
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.image ? 'border-danger' : 'border-border'
                    }`}
                  placeholder="https://images.unsplash.com/photo-... or any valid image URL"
                />
                {errors.image && <p className="mt-1 text-sm text-danger">{errors.image}</p>}
                <p className="mt-1 text-xs text-text/70">
                  Enter a valid landscape image URL (from Unsplash, Pexels, or any other source)
                </p>

                {/* Image Preview */}
                {formData.image && (formData.image.startsWith('http://') || formData.image.startsWith('https://')) && (
                  <div className="mt-4 rounded-lg overflow-hidden border-2 border-primary shadow-md">
                    <img
                      src={formData.image}
                      alt="Event preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-danger/10 flex items-center justify-center"><p class="text-danger text-sm">Failed to load image. Please check the URL.</p></div>'
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
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating Event...' : 'Update Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
