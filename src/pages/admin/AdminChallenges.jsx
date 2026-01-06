import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Trophy, ToggleLeft, ToggleRight, Filter, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const statusBadges = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    completed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
}

export default function AdminChallenges() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'challenges'],
        queryFn: () => adminApi.getChallenges({ limit: 40 })
    })

    const updateChallenge = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateChallengeStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Challenge status updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
        },
        onError: (err) => showError(err.message || 'Failed to update challenge')
    })

    if (isLoading) return <EcoLoader />

    const challenges = data?.data || data || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Content Control</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Challenges <span className="text-primary">Management</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Approve, archive and monitor environmental challenges.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64"
                        />
                    </div>
                    <Button variant="ghost" className="flex items-center gap-2 border border-border bg-surface/50">
                        <Filter size={18} />
                        Filters
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {challenges.length > 0 ? (
                    challenges.map((challenge, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={challenge._id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 p-5 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                                        <Trophy className="text-text/40 group-hover:text-primary transition-colors" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors">{challenge.title}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                                            <span className={clsx(
                                                "rounded-full border px-3 py-1 uppercase tracking-wider",
                                                statusBadges[challenge.status] || 'bg-slate-100 text-slate-600'
                                            )}>
                                                {challenge.status}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-text/40">
                                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                {challenge.category || 'Environmental'}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-text/40">
                                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                {challenge.registeredParticipants || 0} Participants
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <button
                                        onClick={() => updateChallenge.mutate({ id: challenge._id, status: 'active' })}
                                        disabled={challenge.status === 'active'}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            challenge.status === 'active'
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-text/50 hover:bg-white dark:hover:bg-slate-700"
                                        )}
                                    >
                                        <ToggleRight size={16} />
                                        Active
                                    </button>
                                    <button
                                        onClick={() => updateChallenge.mutate({ id: challenge._id, status: 'draft' })}
                                        disabled={challenge.status === 'draft'}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            challenge.status === 'draft'
                                                ? "bg-slate-500 text-white shadow-lg shadow-slate-500/20"
                                                : "text-text/50 hover:bg-white dark:hover:bg-slate-700"
                                        )}
                                    >
                                        <ToggleLeft size={16} />
                                        Draft
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
                            <Trophy size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading">No challenges found</h3>
                        <p className="text-text/50">Start by creating or users submitting new challenges.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
