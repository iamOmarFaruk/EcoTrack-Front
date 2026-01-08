import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Wand2, Save, Plus, Trash2, Edit3, Info, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
    FiTarget,
    FiTrendingUp,
    FiMessageCircle,
    FiUsers,
    FiZap,
    FiMapPin,
    FiCalendar,
    FiAward,
    FiCompass,
    FiSmile
} from 'react-icons/fi'

const emptyStep = { title: '', description: '', icon: 'target' }
const clone = (val) => (typeof structuredClone === 'function' ? structuredClone(val) : JSON.parse(JSON.stringify(val)))
const iconCatalog = [
    { key: 'target', label: 'Target', Icon: FiTarget },
    { key: 'trending-up', label: 'Trending Up', Icon: FiTrendingUp },
    { key: 'chat', label: 'Chat', Icon: FiMessageCircle },
    { key: 'users', label: 'Community', Icon: FiUsers },
    { key: 'zap', label: 'Energy', Icon: FiZap },
    { key: 'map', label: 'Location', Icon: FiMapPin },
    { key: 'calendar', label: 'Calendar', Icon: FiCalendar },
    { key: 'award', label: 'Achievement', Icon: FiAward },
    { key: 'compass', label: 'Compass', Icon: FiCompass },
    { key: 'smile', label: 'Smile', Icon: FiSmile }
]

export default function AdminHowItWorks() {
    const queryClient = useQueryClient()
    const [contentForm, setContentForm] = useState(null)
    const [openPickerIndex, setOpenPickerIndex] = useState(null)

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

    const getIconMeta = (key) => iconCatalog.find((item) => item.key === key) || iconCatalog[0]

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
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:translate-y-0 hover:shadow-lg"
                    >
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="sync" initial={false}>
                    {contentForm.howItWorks?.map((step, idx) => {
                        const iconMeta = getIconMeta(step.icon)
                        const IconComponent = iconMeta?.Icon || FiTarget
                        return (
                        <motion.div
                            layout="position"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={`how-it-works-${idx}`}
                            className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary font-bold text-lg">
                                        {idx + 1}
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-white dark:bg-zinc-900 text-primary">
                                        <IconComponent size={22} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem('howItWorks', idx)}
                                    className="p-2 rounded-lg text-text/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                                <div className="space-y-8">
                                <div className="relative group/input">
                                    <label className="text-[12px] font-semibold uppercase tracking-wider text-text/50 mb-[15px] block ml-1">Step Headline</label>
                                    <div className="relative">
                                        <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within/input:text-primary transition-colors pointer-events-none" size={16} />
                                        <input
                                            value={step.title}
                                            onChange={(e) => updateArrayItem('howItWorks', idx, 'title', e.target.value)}
                                            placeholder="e.g. Join a Challenge"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-bold text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-[12px] font-semibold uppercase tracking-wider text-text/50 mb-[15px] block ml-1">Process Icon</label>
                                    <button
                                        type="button"
                                        onClick={() => setOpenPickerIndex(openPickerIndex === idx ? null : idx)}
                                        className="w-full flex items-center justify-between gap-3 pl-4 pr-3 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <IconComponent size={18} />
                                            </span>
                                            <span className="text-heading font-semibold">{iconMeta?.label || 'Select Icon'}</span>
                                        </span>
                                        <span className="flex items-center gap-2 text-text/40">
                                            <Wand2 size={16} />
                                            <ChevronDown size={16} className={clsx('transition-transform', openPickerIndex === idx && 'rotate-180')} />
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {openPickerIndex === idx && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                className="mt-3 grid grid-cols-5 gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 p-3 shadow-xl"
                                            >
                                                {iconCatalog.map((item) => {
                                                    const ActiveIcon = item.Icon
                                                    const isActive = item.key === step.icon
                                                    return (
                                                        <button
                                                            key={item.key}
                                                            type="button"
                                                            onClick={() => {
                                                                updateArrayItem('howItWorks', idx, 'icon', item.key)
                                                                setOpenPickerIndex(null)
                                                            }}
                                                            className={clsx(
                                                                'flex h-11 w-11 items-center justify-center rounded-xl border transition-all',
                                                                isActive
                                                                    ? 'border-primary/50 bg-primary/10 text-primary shadow-sm'
                                                                    : 'border-transparent bg-zinc-100/70 dark:bg-zinc-800/70 text-text/60 hover:border-primary/30 hover:text-primary'
                                                            )}
                                                            title={item.label}
                                                            aria-label={item.label}
                                                        >
                                                            <ActiveIcon size={18} />
                                                        </button>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative group/input">
                                    <label className="text-[12px] font-semibold uppercase tracking-wider text-text/50 mb-[15px] block ml-1">Step Description</label>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => updateArrayItem('howItWorks', idx, 'description', e.target.value)}
                                        placeholder="Briefly explain what the user needs to do in this step..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}
