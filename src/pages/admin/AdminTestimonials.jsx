import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess, showDeleteConfirmation } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Plus, Save, User, Briefcase, MessageSquareQuote, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Color palette for auto-assignment
const colorPalette = [
    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
    'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
]

const getColorClass = (index) => colorPalette[index % colorPalette.length]

const emptyTestimonial = { name: '', role: '', quote: '', initials: '' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

export default function AdminTestimonials() {
    const queryClient = useQueryClient()
    const [contentForm, setContentForm] = useState(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'content'],
        queryFn: () => adminApi.getContent()
    })

    const [savingIndex, setSavingIndex] = useState(null)

    const saveMutation = useMutation({
        mutationFn: (payload) => adminApi.updateContent(payload),
        onSuccess: () => {
            showSuccess('Testimonial saved successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
            queryClient.invalidateQueries({ queryKey: ['site', 'content'] })
            setSavingIndex(null)
        },
        onError: (err) => {
            showError(err.message || 'Failed to save testimonial')
            setSavingIndex(null)
        }
    })

    useEffect(() => {
        if (data?.data || data) {
            const incoming = data.data || data
            setContentForm(clone(incoming))
        }
    }, [data])

    if (isLoading || !contentForm) return <EcoLoader />

    const updateArrayItem = (key, index, field, value) => {
        setContentForm((prev) => {
            const copy = clone(prev)
            copy[key][index][field] = value
            return copy
        })
    }

    const addItem = (key, template) => {
        setContentForm((prev) => ({
            ...prev,
            [key]: [clone(template), ...(prev[key] || [])]
        }))
    }

    const handleDeleteItem = (index) => {
        const item = contentForm.testimonials[index]
        showDeleteConfirmation({
            itemName: item.name ? `"${item.name}"` : 'Testimonial',
            onConfirm: () => {
                setContentForm((prev) => ({
                    ...prev,
                    testimonials: prev.testimonials.filter((_, i) => i !== index)
                }))
            }
        })
    }

    const handleSaveItem = (index) => {
        if (saveMutation.isPending) return // Prevent duplicate saves

        setSavingIndex(index)
        // Auto-assign colorClass based on position before saving
        const testimonialsWithColors = contentForm.testimonials.map((t, i) => ({
            ...t,
            colorClass: getColorClass(i)
        }))
        saveMutation.mutate({ testimonials: testimonialsWithColors })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/30" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Social Proof</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Testimonials <span className="text-primary">Studio</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Curate and manage user reviews displayed on the home page.</p>
                </div>

                <Button
                    onClick={() => addItem('testimonials', emptyTestimonial)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Add Testimonial
                </Button>
            </div>

            <div className="grid gap-5">
                <AnimatePresence mode="popLayout">
                    {contentForm.testimonials?.map((item, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25 }}
                            key={`testimonial-${idx}`}
                            className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden"
                        >
                            {/* Card Header with Preview Avatar */}
                            <div className="flex items-center justify-between px-6 py-4 bg-zinc-50/80 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-700/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${getColorClass(idx)} flex items-center justify-center font-bold text-sm`}>
                                        {item.initials || '??'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-heading text-sm">{item.name || 'New Testimonial'}</p>
                                        <p className="text-xs text-text/50">{item.role || 'Add role'}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-text/40 bg-zinc-200/50 dark:bg-zinc-700/50 px-2.5 py-1 rounded-full">
                                    #{idx + 1}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Left Column - Personal Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[11px] font-semibold uppercase tracking-wider text-text/50 mb-2 block">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/30" size={16} />
                                                <input
                                                    value={item.name}
                                                    onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)}
                                                    placeholder="Sarah J. Wilson"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-sm font-medium text-heading placeholder:text-text/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold uppercase tracking-wider text-text/50 mb-2 block">
                                                Role / Title
                                            </label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/30" size={16} />
                                                <input
                                                    value={item.role}
                                                    onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)}
                                                    placeholder="Eco Enthusiast"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-sm text-text placeholder:text-text/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold uppercase tracking-wider text-text/50 mb-2 block">
                                                Initials (Avatar)
                                            </label>
                                            <input
                                                value={item.initials}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'initials', e.target.value.toUpperCase())}
                                                placeholder="SW"
                                                maxLength={2}
                                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-sm font-bold text-center text-heading uppercase placeholder:text-text/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column - Quote */}
                                    <div className="md:col-span-2 flex flex-col">
                                        <label className="text-[11px] font-semibold uppercase tracking-wider text-text/50 mb-2 flex items-center gap-2">
                                            <MessageSquareQuote size={14} className="text-primary/60" />
                                            Testimonial Quote
                                        </label>
                                        <div className="relative flex-1">
                                            <textarea
                                                value={item.quote}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)}
                                                placeholder="Share what this user had to say about their experience with EcoTrack..."
                                                rows={4}
                                                className="w-full h-full min-h-[140px] px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-sm text-heading placeholder:text-text/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                                    <Button
                                        onClick={() => handleDeleteItem(idx)}
                                        disabled={saveMutation.isPending}
                                        size="sm"
                                        variant="ghost"
                                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </Button>
                                    <Button
                                        onClick={() => handleSaveItem(idx)}
                                        loading={saveMutation.isPending && savingIndex === idx}
                                        disabled={saveMutation.isPending}
                                        size="sm"
                                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5"
                                    >
                                        <Save size={16} />
                                        Save Testimonial
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {(!contentForm.testimonials || contentForm.testimonials.length === 0) && (
                    <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <MessageSquareQuote size={48} className="mx-auto text-text/20 mb-4" />
                        <h3 className="text-lg font-semibold text-heading mb-2">No testimonials yet</h3>
                        <p className="text-text/50 mb-6">Add your first testimonial to showcase on the home page.</p>
                        <Button
                            onClick={() => addItem('testimonials', emptyTestimonial)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
                        >
                            <Plus size={18} />
                            Add First Testimonial
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
