import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
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
  Pencil,
  Sparkles,
  ShieldCheck,
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
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
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

export default function EditChallenge() {
  const { slug } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [notAuthorized, setNotAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  useDocumentTitle(challenge ? `Edit ${challenge.title} | EcoTrack` : 'Edit Challenge')

  useEffect(() => {
    fetchChallenge()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchChallenge = async () => {
    try {
      setLoading(true)
      const response = await challengeApi.getBySlug(slug)
      const challengeData = response?.data || response

      if (!challengeData) {
        setNotFound(true)
        return
      }

      if (challengeData.createdBy !== user?.uid && challengeData.createdById !== user?.uid) {
        setNotAuthorized(true)
        return
      }

      setChallenge({
        ...challengeData,
        _id: challengeData._id || challengeData.id,
        slug: challengeData.slug || slug
      })

      const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
          const date = new Date(dateString)
          return date.toISOString().split('T')[0]
        } catch {
          return ''
        }
      }

      setFormData({
        category: challengeData.category || 'Waste Reduction',
        title: challengeData.title || '',
        shortDescription: challengeData.shortDescription || challengeData.description || '',
        detailedDescription: challengeData.detailedDescription || '',
        image: challengeData.image || challengeData.imageUrl || '',
        duration: challengeData.duration || '',
        startDate: formatDate(challengeData.startDate),
        endDate: formatDate(challengeData.endDate),
        featured: challengeData.featured || false,
        communityImpact: {
          co2SavedKg: challengeData.communityImpact?.co2SavedKg || 10,
          plasticReducedKg: challengeData.communityImpact?.plasticReducedKg || 5,
          waterSavedL: challengeData.communityImpact?.waterSavedL || 100,
          energySavedKwh: challengeData.communityImpact?.energySavedKwh || 15
        }
      })
    } catch (error) {
      console.error('Error fetching challenge:', error)
      if (error.status === 404) setNotFound(true)
      else if (error.status === 403) setNotAuthorized(true)
      else showError('Failed to load challenge')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (isNaN(start) || iNaN(end) || end <= start) return

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.category) newErrors.category = 'Required'
    if (!formData.title.trim() || formData.title.length < 5) newErrors.title = 'Title too short'
    if (!formData.shortDescription.trim() || formData.shortDescription.length < 20) newErrors.shortDescription = 'Description too short'
    if (!formData.image.trim()) newErrors.image = 'Image required'
    if (!formData.startDate) newErrors.startDate = 'Required'
    if (!formData.endDate) newErrors.endDate = 'Required'
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) newErrors.endDate = 'Must be after start'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!validateForm()) return showError('Check errors')

    setIsSubmitting(true)
    try {
      const challengeData = {
        ...formData,
        detailedDescription: formData.detailedDescription || ''
      }

      const response = await challengeApi.update(challenge._id, challengeData)
      const updatedChallenge = response?.data || response
      showSuccess('Updated successfully!')

      const targetSlug = updatedChallenge?.slug || challenge?.slug || slug
      navigate(`/challenges/${targetSlug}`)
    } catch (error) {
      showError(error.message || 'Update failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <EcoLoader />
  if (notFound) return <NotFound />
  if (notAuthorized) return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6 text-danger">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-heading mb-4">Unauthorized Access</h2>
          <p className="text-text/60 mb-8 leading-relaxed">Only the visionary who created this challenge can modify its destiny. Please check your credentials.</p>
          <Button onClick={() => navigate('/challenges')} variant="primary" className="w-full">Back to Challenges</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-light pb-20">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />

      <div className="container max-w-5xl mx-auto pt-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to={`/challenges/${slug}`} className="inline-flex items-center gap-2 text-text/60 hover:text-primary transition-colors group">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Back to Challenge</span>
          </Link>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Pencil className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">Edit Mode</span>
                  <span className="text-xs text-text/40 font-bold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Managed by You
                  </span>
                </div>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-heading mb-4 tracking-tight">
                Refine Your <span className="text-primary italic">Challenge</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg text-text/70 max-w-2xl">
                Keep the momentum going by updating visuals, metrics, or details to better serve the community.
              </motion.p>
            </div>


          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex p-1 bg-surface border border-border/50 rounded-xl shadow-sm mb-6 backdrop-blur-sm">
              {[
                { id: 'info', label: 'Basics', icon: Info },
                { id: 'impact', label: 'Impact', icon: Globe },
                { id: 'details', label: 'Visuals', icon: ImageIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text/60 hover:text-text hover:bg-muted/50'
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
                  <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <Card className="overflow-hidden border-none shadow-xl shadow-primary/5">
                      <div className="h-2 bg-primary w-full" />
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Challenge Title</label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              className={`w-full rounded-xl border ${errors.title ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40`}
                            />
                            {errors.title && <p className="text-xs text-danger font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                          </div>

                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Short Description</label>
                            <textarea
                              name="shortDescription"
                              value={formData.shortDescription}
                              onChange={handleChange}
                              rows={3}
                              className={`w-full rounded-xl border ${errors.shortDescription ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40 resize-none`}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Category</label>
                            <div className="relative">
                              <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading appearance-none cursor-pointer"
                              >
                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text/40">
                                <Leaf className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Duration Status</label>
                            <div className="w-full rounded-xl border border-border px-4 py-3 bg-muted/50 text-text/60 font-medium flex items-center gap-3">
                              {formData.duration ? <><CheckCircle2 className="w-4 h-4 text-primary" /> <span>{formData.duration}</span></> : <><Calendar className="w-4 h-4 opacity-40" /> <span>Update dates</span></>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Start Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`w-full rounded-xl border ${errors.startDate ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading`}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">End Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`w-full rounded-xl border ${errors.endDate ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading`}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'impact' && (
                  <motion.div key="impact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <Card className="border-none shadow-xl shadow-primary/5">
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { name: 'co2SavedKg', label: 'CO₂ Saved (kg)', icon: Target, color: 'emerald' },
                            { name: 'plasticReducedKg', label: 'Plastic Saved (kg)', icon: Leaf, color: 'teal' },
                            { name: 'waterSavedL', label: 'Water Saved (L)', icon: Droplets, color: 'blue' },
                            { name: 'energySavedKwh', label: 'Energy Saved (kWh)', icon: Zap, color: 'yellow' }
                          ].map((metric) => (
                            <div key={metric.name} className="p-5 rounded-2xl bg-muted/30 border-2 border-border/50 hover:border-primary/20 transition-all space-y-2">
                              <label className="text-sm font-bold text-heading ml-1">{metric.label}</label>
                              <input
                                type="number"
                                name={metric.name}
                                value={formData.communityImpact[metric.name]}
                                onChange={handleImpactChange}
                                className="w-full rounded-xl border border-border px-4 py-3 transition-all bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <Card className="border-none shadow-xl shadow-primary/5">
                      <CardContent className="p-8">
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-heading ml-1">Image URL</label>
                              <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className={`w-full rounded-xl border ${errors.image ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40`}
                              />
                              <p className="text-xs text-text/50 leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10 italic flex items-start gap-3">
                                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>Keep images high-resolution for professional look.</span>
                              </p>
                            </div>
                            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-border/50 bg-muted/20 relative group">
                              {formData.image && <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-heading ml-1">Detailed Description</label>
                            <textarea
                              name="detailedDescription"
                              value={formData.detailedDescription}
                              onChange={handleChange}
                              rows={6}
                              className="w-full rounded-xl border border-border px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40 resize-none"
                            />
                          </div>

                          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                            <label className="flex items-center gap-4 cursor-pointer select-none">
                              <div className="relative">
                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="sr-only peer" />
                                <div className="w-14 h-7 bg-text/10 rounded-full peer peer-checked:bg-primary transition-all duration-300"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:left-8 transition-all duration-300 shadow-sm"></div>
                              </div>
                              <div>
                                <span className="text-base font-bold text-heading block mb-1">Mark as Featured</span>
                                <span className="text-xs text-text/60 italic">Showcase this challenge on top placements.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between bg-surface p-4 rounded-2xl border border-border">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (activeTab === 'impact') setActiveTab('info')
                    if (activeTab === 'details') setActiveTab('impact')
                  }}
                  disabled={activeTab === 'info'}
                  className={activeTab === 'info' ? 'opacity-0' : 'whitespace-nowrap'}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="flex gap-4">
                  {activeTab !== 'details' ? (
                    <Button type="button" size="sm" variant="primary" onClick={() => activeTab === 'info' ? setActiveTab('impact') : setActiveTab('details')} className="whitespace-nowrap shadow-lg shadow-primary/10">Next</Button>
                  ) : (
                    <Button type="submit" size="sm" variant="primary" disabled={isSubmitting} className="px-8 shadow-lg shadow-primary/20 whitespace-nowrap">{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6">
                  <h4 className="font-bold text-heading mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Edit Insights
                  </h4>
                  <p className="text-xs text-text/60 leading-relaxed mb-4">Editing a challenge allows you to keep participants engaged with fresh details or corrected metrics.</p>
                  <div className="space-y-4">
                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <p className="text-[10px] font-bold text-text/40 uppercase mb-1">Status</p>
                      <p className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live & Active</p>
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