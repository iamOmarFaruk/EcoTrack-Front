import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { MessageSquare, Plus, Save, Trash2, User, Quote, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const emptyTestimonial = { name: '', role: '', quote: '', initials: '', colorClass: 'bg-emerald-100 text-emerald-700' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

export default function AdminTestimonials() {
    const queryClient = useQueryClient()
    const [contentForm, setContentForm] = useState(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'content'],
        queryFn: () => adminApi.getContent()
    })

    const saveMutation = useMutation({
        mutationFn: (payload) => adminApi.updateContent(payload),
        onSuccess: () => {
            showSuccess('Testimonials updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
        },
        onError: (err) => showError(err.message || 'Failed to save testimonials')
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
            [key]: [...(prev[key] || []), clone(template)]
        }))
    }

    const removeItem = (key, index) => {
        setContentForm((prev) => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }))
    }

    const handleSave = () => {
        saveMutation.mutate({ testimonials: contentForm.testimonials })
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

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => addItem('testimonials', emptyTestimonial)}
                        variant="ghost"
                        className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                    >
                        <Plus size={18} />
                        Add New
                    </Button>
                    <Button
                        onClick={handleSave}
                        loading={saveMutation.isPending}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    >
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {contentForm.testimonials?.map((item, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            key={`${item.name}-${idx}`}
                            className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 md:p-8 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
                        >
                            <div className="absolute top-6 right-6">
                                <button
                                    onClick={() => removeItem('testimonials', idx)}
                                    className="p-2 rounded-xl text-text/30 hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3 flex flex-col gap-4">
                                    <div className="relative">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Full Name</label>
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                            <input
                                                value={item.name}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)}
                                                placeholder="e.g. Sarah J. Wilson"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Subject / Role</label>
                                        <div className="relative group/input">
                                            <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                            <input
                                                value={item.role}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)}
                                                placeholder="e.g. Certified Eco-Specialist"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-text focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Initials</label>
                                            <input
                                                value={item.initials}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'initials', e.target.value)}
                                                placeholder="SW"
                                                maxLength={2}
                                                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-center text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Style Class</label>
                                            <input
                                                value={item.colorClass || ''}
                                                onChange={(e) => updateArrayItem('testimonials', idx, 'colorClass', e.target.value)}
                                                placeholder="bg-primary/10 text-primary"
                                                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-text focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">The Testimonial Quote</label>
                                    <div className="relative flex-1 group/input">
                                        <Quote className="absolute left-5 top-5 text-primary/20" size={32} />
                                        <textarea
                                            value={item.quote}
                                            onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)}
                                            placeholder="Share what this user had to say about their experience..."
                                            rows={5}
                                            className="w-full min-h-[160px] pl-6 pr-6 py-5 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-base italic font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
