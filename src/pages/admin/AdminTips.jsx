import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Lightbulb, ToggleLeft, ToggleRight, Search, User } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const statusBadges = {
    published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20'
}

export default function AdminTips() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'tips'],
        queryFn: () => adminApi.getTips({ limit: 40 })
    })

    const updateTip = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateTipStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Tip status updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'tips'] })
        },
        onError: (err) => showError(err.message || 'Failed to update tip')
    })

    if (isLoading) return <EcoLoader />

    const tips = data?.data || data || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-amber-400/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-500">Knowledge Base</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Tips <span className="text-amber-500">Management</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Verify and publish eco-friendly tips from the community.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search tips..."
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {tips.length > 0 ? (
                    tips.map((tip, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            key={tip.id || tip._id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-6 transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/20"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-500/10 transition-colors">
                                        <Lightbulb className="text-amber-500/40 group-hover:text-amber-500 transition-colors" size={20} />
                                    </div>
                                    <span className={clsx(
                                        "rounded-full border px-3 py-1 uppercase tracking-wider text-[10px] font-bold",
                                        statusBadges[tip.status] || 'bg-zinc-100 text-zinc-600'
                                    )}>
                                        {tip.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-heading group-hover:text-amber-500 transition-colors mb-2 line-clamp-2">{tip.title}</h3>
                                <div className="flex items-center gap-2 text-xs font-medium text-text/40 mb-4">
                                    <User size={14} className="text-amber-500/60" />
                                    By {tip.authorName || 'Anonymous'}
                                </div>
                                <p className="text-sm text-text/60 line-clamp-3 mb-6 leading-relaxed">
                                    {tip.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                                <button
                                    onClick={() => updateTip.mutate({ id: tip.id || tip._id, status: 'published' })}
                                    disabled={tip.status === 'published'}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                                        tip.status === 'published'
                                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                            : "text-text/50 hover:bg-white dark:hover:bg-zinc-700"
                                    )}
                                >
                                    <ToggleRight size={16} />
                                    Publish
                                </button>
                                <button
                                    onClick={() => updateTip.mutate({ id: tip.id || tip._id, status: 'draft' })}
                                    disabled={tip.status === 'draft'}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                                        tip.status === 'draft'
                                            ? "bg-zinc-500 text-white shadow-lg shadow-zinc-500/20"
                                            : "text-text/50 hover:bg-white dark:hover:bg-zinc-700"
                                    )}
                                >
                                    <ToggleLeft size={16} />
                                    Draft
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
                            <Lightbulb size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading">No tips found</h3>
                        <p className="text-text/50">Start by creating new environmental tips.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
