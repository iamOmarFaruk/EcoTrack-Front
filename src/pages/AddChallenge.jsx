import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { challengeApi } from '../services/api.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

export default function AddChallenge() {
  useDocumentTitle('Create Challenge')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    category: 'Waste Reduction',
    title: '',
    shortDescription: '',
    detailedDescription: '',
    image: '',
    duration: '',
    impact: '',
    co2Saved: '',
    startDate: '',
    endDate: '',
    featured: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Auto-calculate duration based on start and end dates
  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (isNaN(start) || isNaN(end) || end <= start) return

    const diffMs = end.getTime() - start.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1

    let durationLabel
    if (diffDays % 7 === 0) {
      const weeks = diffDays / 7
      durationLabel = weeks === 1 ? '1 week' : `${weeks} weeks`
    } else {
      durationLabel = diffDays === 1 ? '1 day' : `${diffDays} days`
    }

    setFormData(prev => ({ ...prev, duration: durationLabel }))
  }, [formData.startDate, formData.endDate])

  const validateForm = () => {
    const newErrors = {}

    // Category validation (required, must be valid)
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    // Title validation (5-100 chars, required)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5 || formData.title.length > 100) {
      newErrors.title = 'Title must be between 5 and 100 characters'
    }

    // Short Description validation (20-250 chars, required)
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required'
    } else if (formData.shortDescription.length < 20 || formData.shortDescription.length > 250) {
      newErrors.shortDescription = 'Description must be between 20 and 250 characters'
    }

    // Detailed description (optional, max 2000 chars)
    if (formData.detailedDescription && formData.detailedDescription.length > 2000) {
      newErrors.detailedDescription = 'Detailed description must be less than 2000 characters'
    }

    // Image validation (required, must be valid HTTPS URL)
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else {
      try {
        const url = new URL(formData.image)
        if (url.protocol !== 'https:') {
          newErrors.image = 'Image URL must use HTTPS protocol'
        }
      } catch {
        newErrors.image = 'Please enter a valid image URL'
      }
    }

    // Duration validation (2-50 chars, required)
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    } else if (formData.duration.length < 2 || formData.duration.length > 50) {
      newErrors.duration = 'Duration must be between 2 and 50 characters'
    }

    // Impact validation (3-100 chars, required)
    if (!formData.impact.trim()) {
      newErrors.impact = 'Impact metric is required'
    } else if (formData.impact.length < 3 || formData.impact.length > 100) {
      newErrors.impact = 'Impact metric must be between 3 and 100 characters'
    }

    // CO2 saved validation (optional, 2-50 chars)
    if (formData.co2Saved && (formData.co2Saved.length < 2 || formData.co2Saved.length > 50)) {
      newErrors.co2Saved = 'CO₂ saved must be between 2 and 50 characters'
    }

    // Start date validation (required, must be today or future)
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const selectedDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.startDate = 'Start date must be today or in the future'
      }
    }

    // End date validation (required, must be after start date)
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('You must be logged in to create a challenge')
      navigate('/login')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const challengeData = {
        category: formData.category,
        title: formData.title,
        shortDescription: formData.shortDescription,
        image: formData.image,
        duration: formData.duration,
        impact: formData.impact,
        startDate: formData.startDate,
        endDate: formData.endDate
      }

      // Add optional fields if provided
      if (formData.detailedDescription) {
        challengeData.detailedDescription = formData.detailedDescription
      }
      if (formData.co2Saved) {
        challengeData.co2Saved = formData.co2Saved
      }
      if (formData.featured) {
        challengeData.featured = formData.featured
      }

      const response = await challengeApi.create(challengeData)
      const challenge = response?.data?.challenge || response?.challenge || response?.data

      toast.success('Challenge created successfully!')
      
      // Navigate to the challenge detail page
      if (challenge?.id) {
        navigate(`/challenges/${challenge.id}`)
      } else {
        navigate('/challenges')
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      
      // Handle validation errors from backend
      if (error.data?.errors) {
        const backendErrors = {}
        error.data.errors.forEach(err => {
          // Map backend error messages to form fields
          const message = err.toLowerCase()
          if (message.includes('title')) backendErrors.title = err
          else if (message.includes('description')) backendErrors.shortDescription = err
          else if (message.includes('category')) backendErrors.category = err
          else if (message.includes('image')) backendErrors.image = err
          else if (message.includes('duration')) backendErrors.duration = err
          else if (message.includes('impact')) backendErrors.impact = err
          else if (message.includes('start')) backendErrors.startDate = err
          else if (message.includes('end')) backendErrors.endDate = err
        })
        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors)
          toast.error('Please fix the validation errors')
          return
        }
      }
      
      toast.error(error.message || 'Failed to create challenge')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/challenges')
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create New Challenge
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create an eco-friendly challenge and inspire others to make a positive impact
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.category ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="Food">Food</option>
                  <option value="Waste Reduction">Waste Reduction</option>
                  <option value="Energy Conservation">Energy Conservation</option>
                  <option value="Water">Water</option>
                  <option value="Community">Community</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-2">
                  Challenge Title <span className="text-red-500">*</span>
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
                  placeholder="e.g., Plastic-Free Week"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.title.length}/100 characters</p>
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-900 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.shortDescription ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Brief description for challenge cards (20-250 characters)"
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-500">{errors.shortDescription}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.shortDescription.length}/250 characters</p>
              </div>

              {/* Detailed Description (Optional) */}
              <div>
                <label htmlFor="detailedDescription" className="block text-sm font-medium text-slate-900 mb-2">
                  Detailed Description <span className="text-slate-500">(Optional)</span>
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
                  placeholder="Full description with all details about the challenge (max 2000 characters)"
                />
                {errors.detailedDescription && <p className="mt-1 text-sm text-red-500">{errors.detailedDescription}</p>}
                <p className="mt-1 text-xs text-slate-500">{formData.detailedDescription.length}/2000 characters</p>
              </div>

              {/* Date Range */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-900 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.startDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-900 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || getMinDate()}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.endDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              {/* Duration (Auto-calculated) */}
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
                  placeholder="e.g., 7 days, 2 weeks (auto-calculated from dates)"
                />
                {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.startDate && formData.endDate 
                    ? 'Auto-calculated from dates (you can edit if needed)' 
                    : 'Select start and end dates to auto-calculate'}
                </p>
              </div>

              {/* Impact and CO2 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="impact" className="block text-sm font-medium text-slate-900 mb-2">
                    Impact Metric <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="impact"
                    name="impact"
                    value={formData.impact}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.impact ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="e.g., Bottles avoided"
                  />
                  {errors.impact && <p className="mt-1 text-sm text-red-500">{errors.impact}</p>}
                </div>

                <div>
                  <label htmlFor="co2Saved" className="block text-sm font-medium text-slate-900 mb-2">
                    CO₂ Saved <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="co2Saved"
                    name="co2Saved"
                    value={formData.co2Saved}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.co2Saved ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="e.g., 15 kg"
                  />
                  {errors.co2Saved && <p className="mt-1 text-sm text-red-500">{errors.co2Saved}</p>}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-900 mb-2">
                  Challenge Image URL <span className="text-red-500">*</span>
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
                  placeholder="https://images.unsplash.com/photo-... (must be HTTPS)"
                />
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  Enter a valid HTTPS image URL (from Unsplash, Pexels, or any other source)
                </p>
                
                {/* Image Preview */}
                {formData.image && formData.image.startsWith('https://') && (
                  <div className="mt-4 rounded-lg overflow-hidden border-2 border-green-200 shadow-md">
                    <img 
                      src={formData.image} 
                      alt="Challenge preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-red-50 flex items-center justify-center"><p class="text-red-600 text-sm">Failed to load image. Please check the URL.</p></div>'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-slate-900">
                  Mark as featured challenge
                </label>
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
                  {isSubmitting ? 'Creating Challenge...' : 'Create Challenge'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


