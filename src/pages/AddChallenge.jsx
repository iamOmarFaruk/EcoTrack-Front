import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf,
  Target,
  Info,
  Calendar,
  Image as ImageIcon,
  Globe,
  Droplets,
  Zap,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Recycle,
  Lightbulb,
  UtensilsCrossed,
  Users,
  Sprout
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { challengeApi } from '../services/api.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import { showSuccess, showError } from '../utils/toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const CATEGORIES = [
  { id: 'Waste Reduction', label: 'Waste Reduction', icon: Recycle },
  { id: 'Energy Conservation', label: 'Energy Conservation', icon: Lightbulb },
  { id: 'Water', label: 'Water Conservation', icon: Droplets },
  { id: 'Food', label: 'Sustainable Food', icon: UtensilsCrossed },
  { id: 'Community', label: 'Community Action', icon: Users },
  { id: 'Biodiversity', label: 'Biodiversity', icon: Sprout }
]

export default function AddChallenge() {
  useDocumentTitle('Create Challenge | EcoTrack')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    category: 'Waste Reduction',
    title: '',
    shortDescription: '',
    detailedDescription: '',
    image: '',
    duration: '',
    startDate: '',
    endDate: '',
    featured: false,
    communityImpact: {
      co2SavedKg: 10,
      plasticReducedKg: 5,
      waterSavedL: 100,
      energySavedKwh: 15
    }
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('info') // info, impact, details

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImpactChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      communityImpact: {
        ...prev.communityImpact,
        [name]: parseFloat(value) || 0
      }
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

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

    if (!formData.category) newErrors.category = 'Category is required'

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5 || formData.title.length > 100) {
      newErrors.title = 'Title must be 5-100 characters'
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required'
    } else if (formData.shortDescription.length < 20 || formData.shortDescription.length > 250) {
      newErrors.shortDescription = 'Description must be 20-250 characters'
    }

    if (formData.detailedDescription && formData.detailedDescription.length > 2000) {
      newErrors.detailedDescription = 'Max 2000 characters'
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    } else {
      try {
        const url = new URL(formData.image)
        if (url.protocol !== 'https:') newErrors.image = 'Must use HTTPS'
      } catch {
        newErrors.image = 'Invalid URL'
      }
    }

    if (!formData.duration.trim()) newErrors.duration = 'Duration is required'

    if (formData.communityImpact.co2SavedKg < 0) newErrors.co2SavedKg = 'Must be positive'
    if (formData.communityImpact.plasticReducedKg < 0) newErrors.plasticReducedKg = 'Must be positive'
    if (formData.communityImpact.waterSavedL < 0) newErrors.waterSavedL = 'Must be positive'
    if (formData.communityImpact.energySavedKwh < 0) newErrors.energySavedKwh = 'Must be positive'

    if (!formData.startDate) {
      newErrors.startDate = 'Required'
    } else {
      const selectedDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) newErrors.startDate = 'Cannot be in past'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Required'
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) newErrors.endDate = 'Must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      showError('Login required to create a challenge')
      navigate('/login')
      return
    }

    if (!validateForm()) {
      showError('Please check the form for errors')
      // If there are errors in specific tabs, maybe switch to that tab?
      if (errors.title || errors.category || errors.shortDescription || errors.startDate || errors.endDate) {
        setActiveTab('info')
      } else if (errors.co2SavedKg || errors.plasticReducedKg || errors.waterSavedL || errors.energySavedKwh) {
        setActiveTab('impact')
      } else if (errors.image) {
        setActiveTab('details')
      }
      return
    }

    setIsSubmitting(true)

    try {
      const challengeData = {
        category: formData.category,
        title: formData.title,
        shortDescription: formData.shortDescription,
        image: formData.image,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        communityImpact: formData.communityImpact,
        featured: formData.featured,
        detailedDescription: formData.detailedDescription || ''
      }

      const response = await challengeApi.create(challengeData)
      const challenge = response?.data?.challenge || response?.challenge || response?.data

      showSuccess('Challenge created successfully!')

      if (challenge?.slug) {
        navigate(`/challenges/${challenge.slug}`)
      } else {
        navigate('/challenges')
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      showError(error.message || 'Failed to create challenge')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-light pb-20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />

      <div className="container max-w-5xl mx-auto pt-8 relative z-10">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 text-text/60 hover:text-primary transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Back to Challenges</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Create Mode
                </span>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-heading mb-4 tracking-tight"
              >
                Launch a New <span className="text-primary italic">Challenge</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-text/70 max-w-2xl"
              >
                Inspire the community by creating an actionable, eco-friendly challenge.
                Fill out the details below to get started.
              </motion.p>
            </div>


          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex p-1 bg-surface border border-border/50 rounded-xl shadow-sm mb-6 backdrop-blur-sm">
              {[
                { id: 'info', label: 'General Info', icon: Info },
                { id: 'impact', label: 'Impact Metrics', icon: Globe },
                { id: 'details', label: 'Media & Details', icon: ImageIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text/60 hover:text-text hover:bg-muted/50'
                    }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="overflow-hidden border-none shadow-xl shadow-primary/5">
                      <div className="h-2 bg-primary w-full" />
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              Challenge Title <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="e.g., Plastic-Free Journey"
                              className={`w-full px-6 py-5 bg-muted/30 border-2 rounded-2xl outline-none transition-all focus:bg-surface text-base ${errors.title ? 'border-danger focus:border-danger ring-4 ring-danger/10' : 'border-border/40 focus:border-primary ring-4 ring-primary/10'
                                }`}
                            />
                            {errors.title && <p className="mt-2.5 text-sm text-danger flex items-center gap-1.5 font-medium"><AlertCircle className="w-4 h-4" /> {errors.title}</p>}
                          </div>

                          <div className="md:col-span-2 group">
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              Short Description <span className="text-danger">*</span>
                            </label>
                            <textarea
                              name="shortDescription"
                              value={formData.shortDescription}
                              onChange={handleChange}
                              rows={3}
                              placeholder="A brief catchy description for the challenge card..."
                              className={`w-full px-6 py-5 bg-muted/30 border-2 rounded-2xl outline-none transition-all focus:bg-surface resize-none text-base ${errors.shortDescription ? 'border-danger focus:border-danger ring-4 ring-danger/10' : 'border-border/40 focus:border-primary ring-4 ring-primary/10'
                                }`}
                            />
                            <div className="flex justify-between mt-2.5">
                              {errors.shortDescription ? (
                                <p className="text-sm text-danger flex items-center gap-1.5 font-medium"><AlertCircle className="w-4 h-4" /> {errors.shortDescription}</p>
                              ) : <div />}
                              <p className="text-[11px] text-text/40 font-bold uppercase tracking-tight">{formData.shortDescription.length}/250 characters</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              Category <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-6 py-5 bg-muted/30 border-2 border-border/40 rounded-2xl outline-none transition-all focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer font-medium text-base"
                              >
                                {CATEGORIES.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text/40">
                                <Leaf className="w-5 h-5" />
                              </div>
                            </div>
                            {errors.category && <p className="mt-2 text-sm text-danger flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {errors.category}</p>}
                          </div>

                          <div>
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              Target Duration
                            </label>
                            <div className="w-full px-6 py-5 bg-muted/20 border-2 border-border/30 rounded-2xl text-text/60 font-semibold flex items-center gap-3 text-base">
                              {formData.duration ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 text-primary" />
                                  <span>{formData.duration} (auto-calculated)</span>
                                </>
                              ) : (
                                <>
                                  <Calendar className="w-5 h-5 opacity-40" />
                                  <span>Select dates below</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                min={getMinDate()}
                                className={`w-full px-6 py-5 bg-muted/30 border-2 rounded-2xl outline-none transition-all focus:bg-surface text-base ${errors.startDate ? 'border-danger focus:border-danger ring-4 ring-danger/10' : 'border-border/40 focus:border-primary ring-4 ring-primary/10'
                                  }`}
                              />
                            </div>
                            {errors.startDate && <p className="mt-2.5 text-sm text-danger flex items-center gap-1.5 font-medium"><AlertCircle className="w-4 h-4" /> {errors.startDate}</p>}
                          </div>

                          <div>
                            <label className="block text-[13px] font-bold text-heading mb-3 uppercase tracking-wider">
                              End Date <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate || getMinDate()}
                                className={`w-full px-6 py-5 bg-muted/30 border-2 rounded-2xl outline-none transition-all focus:bg-surface text-base ${errors.endDate ? 'border-danger focus:border-danger ring-4 ring-danger/10' : 'border-border/40 focus:border-primary ring-4 ring-primary/10'
                                  }`}
                              />
                            </div>
                            {errors.endDate && <p className="mt-2.5 text-sm text-danger flex items-center gap-1.5 font-medium"><AlertCircle className="w-4 h-4" /> {errors.endDate}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'impact' && (
                  <motion.div
                    key="impact"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="border-none shadow-xl shadow-primary/5">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-heading">Estimated Community Impact</h3>
                            <p className="text-sm text-text/60">Define the collective impact per participant</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { name: 'co2SavedKg', label: 'CO₂ Saved (kg)', icon: Target, color: 'emerald' },
                            { name: 'plasticReducedKg', label: 'Plastic Saved (kg)', icon: Leaf, color: 'teal' },
                            { name: 'waterSavedL', label: 'Water Saved (L)', icon: Droplets, color: 'blue' },
                            { name: 'energySavedKwh', label: 'Energy Saved (kWh)', icon: Zap, color: 'yellow' }
                          ].map((metric) => (
                            <div
                              key={metric.name}
                              className="p-5 rounded-2xl bg-muted/30 border-2 border-border/50 hover:border-primary/20 transition-all group"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg bg-${metric.color}-500/10 text-${metric.color}-600`}>
                                  <metric.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tight text-text/40">Per Participant</span>
                              </div>
                              <label className="block text-sm font-semibold text-heading mb-2">{metric.label}</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name={metric.name}
                                  value={formData.communityImpact[metric.name]}
                                  onChange={handleImpactChange}
                                  min="0"
                                  step="0.1"
                                  className={`w-full px-5 py-4 bg-surface border-2 rounded-2xl outline-none transition-all focus:border-primary/50 text-base ${errors[metric.name] ? 'border-danger' : 'border-border/40'
                                    }`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  +
                                </div>
                              </div>
                              {errors[metric.name] && <p className="mt-1 text-xs text-danger">{errors[metric.name]}</p>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="border-none shadow-xl shadow-primary/5">
                      <CardContent className="p-8">
                        <div className="space-y-8">
                          {/* Image Section */}
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-heading">Challenge Media</h3>
                                <p className="text-sm text-text/60">Upload or link a high-quality cover image</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <label className="block text-sm font-bold text-heading uppercase tracking-wide">Image URL <span className="text-danger">*</span></label>
                                <input
                                  type="url"
                                  name="image"
                                  value={formData.image}
                                  onChange={handleChange}
                                  placeholder="https://images.unsplash.com/..."
                                  className={`w-full px-6 py-5 bg-muted/30 border-2 rounded-2xl outline-none transition-all focus:bg-surface text-base ${errors.image ? 'border-danger focus:border-danger ring-4 ring-danger/10' : 'border-border/40 focus:border-primary ring-4 ring-primary/10'
                                    }`}
                                />
                                {errors.image && <p className="text-sm text-danger flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.image}</p>}
                                <p className="text-xs text-text/50 leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10 italic flex items-start gap-3">
                                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                  <span>Professional tip: Use Unsplash for high-quality eco-themed images. Make sure the URL begins with <span className="font-bold text-primary">https://</span></span>
                                </p>
                              </div>

                              <div className="relative group min-h-[220px]">
                                {formData.image && formData.image.startsWith('https://') ? (
                                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-border shadow-inner relative">
                                    <img
                                      src={formData.image}
                                      alt="Preview"
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                                      <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase">Live Preview</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text/30 p-8 text-center bg-muted/20">
                                    <ImageIcon className="w-12 h-12 mb-4 opacity-10" />
                                    <p className="text-sm font-semibold">No Image Preview</p>
                                    <p className="text-xs mt-2">Add a valid HTTPS image URL to see preview</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <hr className="border-border" />

                          {/* Detailed Content */}
                          <div>
                            <label className="block text-sm font-bold text-heading mb-4 uppercase tracking-wide">Detailed Description (Optional)</label>
                            <textarea
                              name="detailedDescription"
                              value={formData.detailedDescription}
                              onChange={handleChange}
                              rows={6}
                              placeholder="Provide in-depth details, steps, and motivation for participants..."
                              className="w-full px-6 py-5 bg-muted/30 border-2 border-border/40 rounded-2xl outline-none transition-all focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none text-base"
                            />
                            <div className="flex justify-end mt-2">
                              <p className="text-xs text-text/40 font-medium">{formData.detailedDescription?.length || 0}/2000</p>
                            </div>
                          </div>

                          {/* Options */}
                          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                            <label className="flex items-center gap-4 cursor-pointer select-none">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  name="featured"
                                  checked={formData.featured}
                                  onChange={handleChange}
                                  className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-text/10 rounded-full peer peer-checked:bg-primary transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:left-8 transition-all duration-300 shadow-sm"></div>
                              </div>
                              <div>
                                <span className="text-base font-bold text-heading block leading-none mb-1">Mark as Featured</span>
                                <span className="text-xs text-text/60 italic font-medium">Featured challenges appear on the home page hero section.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Navigation/Submit */}
              <div className="mt-8 flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (activeTab === 'impact') setActiveTab('info')
                    if (activeTab === 'details') setActiveTab('impact')
                  }}
                  disabled={activeTab === 'info'}
                  className={activeTab === 'info' ? 'opacity-0 pointer-events-none' : 'whitespace-nowrap'}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex gap-4">
                  {activeTab !== 'details' ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        if (activeTab === 'info') setActiveTab('impact')
                        else if (activeTab === 'impact') setActiveTab('details')
                      }}
                      className="whitespace-nowrap shadow-lg shadow-primary/10"
                    >
                      Next Section
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      disabled={isSubmitting}
                      className="px-8 shadow-lg shadow-primary/20 whitespace-nowrap"
                    >
                      {isSubmitting ? 'Creating...' : 'Launch Challenge'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar / Guidelines */}
          <div className="lg:col-span-4 max-w-sm">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-bold">Creation Guide</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { icon: Target, text: 'Define a clear, achievable goal' },
                      { icon: Calendar, text: 'Set a realistic timeframe (7-30 days works best)' },
                      { icon: Globe, text: 'Be honest with impact estimations' },
                      { icon: ImageIcon, text: 'A good image increases engagement by 70%' }
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3">
                        <tip.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-text/70 leading-relaxed">{tip.text}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-primary/5">
                <CardContent className="p-6">
                  <h4 className="font-bold text-heading mb-4">Preview Summary</h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-[10px] font-bold text-text/40 uppercase mb-1">Challenge Idea</p>
                      <p className="font-bold text-sm text-heading truncate">{formData.title || 'Untitled Challenge'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-[10px] font-bold text-text/40 uppercase mb-1">Category</p>
                      <p className="font-bold text-sm text-primary flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> {formData.category}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-[10px] font-bold text-text/40 uppercase mb-1">CO₂ Goal</p>
                        <p className="font-bold text-sm text-heading">{formData.communityImpact.co2SavedKg}kg</p>
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-[10px] font-bold text-text/40 uppercase mb-1">Water Goal</p>
                        <p className="font-bold text-sm text-heading">{formData.communityImpact.waterSavedL}L</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



