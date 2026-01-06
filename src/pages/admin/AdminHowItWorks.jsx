import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Wand2, Save, Plus, Trash2, Edit3, Type, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const emptyStep = { title: '', description: '', icon: 'target' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))

export default function AdminHowItWorks() {
    const queryClient = useQueryClient()
    const [contentForm, setContentForm] = useState(null)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'content'],
        queryFn: () => adminApi.getContent()
    })

    const saveMutation = useMutation({
        mutationFn: (payload) => adminApi.updateContent(payload),
        onSuccess: () => {
            showSuccess('Process steps updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'content'] })
        },
        onError: (err) => showError(err.message || 'Failed to save steps')
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
        saveMutation.mutate({ howItWorks: contentForm.howItWorks })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Platform Onboarding</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        How It <span className="text-primary">Works</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Define the workflow steps displayed to new users on the platform.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => addItem('howItWorks', emptyStep)}
                        variant="ghost"
                        className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                    >
                        <Plus size={18} />
                        Append Step
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

            <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                    {contentForm.howItWorks?.map((step, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={`${step.title}-${idx}`}
                            className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary font-bold text-lg">
                                    {idx + 1}
                                </div>
                                <button
                                    onClick={() => removeItem('howItWorks', idx)}
                                    className="p-2 rounded-lg text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Step Headline</label>
                                    <Type className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                    <input
                                        value={step.title}
                                        onChange={(e) => updateArrayItem('howItWorks', idx, 'title', e.target.value)}
                                        placeholder="e.g. Join a Challenge"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>

                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Process Icon Name</label>
                                    <Wand2 className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                    <input
                                        value={step.icon}
                                        onChange={(e) => updateArrayItem('howItWorks', idx, 'icon', e.target.value)}
                                        placeholder="e.g. target, trending-up, heart"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-text focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>

                                <div className="relative group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-text/40 mb-1.5 block ml-1">Step Description</label>
                                    <Info className="absolute left-4 top-[38px] text-text/30 group-focus-within/input:text-primary transition-colors" size={16} />
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => updateArrayItem('howItWorks', idx, 'description', e.target.value)}
                                        placeholder="Briefly explain what the user needs to do in this step..."
                                        rows={3}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
