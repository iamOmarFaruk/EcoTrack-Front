import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/adminApi.js'
import { challengeApi } from '../../services/api.js'
import { showError, showSuccess, showConfirmation, showDeleteConfirmation } from '../../utils/toast.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Trophy, ToggleRight, Filter, Search, CheckCircle, XCircle, FileText, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const statusBadges = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    completed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
}

export default function AdminChallenges() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    const debouncedSearch = useMemo(() => {
        let timeout
        return (value, callback) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => callback(value), 300)
        }
    }, [])

    const { data, isLoading, isInitialLoading, isFetching } = useQuery({
        queryKey: ['admin', 'challenges', searchQuery, statusFilter],
        queryFn: () => adminApi.getChallenges({
            limit: 40,
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        keepPreviousData: true,
        placeholderData: (prev) => prev,
        staleTime: 1000
    })

    const updateChallenge = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateChallengeStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Challenge status updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
        },
        onError: (err) => showError(err.message || 'Failed to update challenge')
    })

    const deleteChallenge = useMutation({
        mutationFn: (id) => challengeApi.delete(id),
        onSuccess: () => {
            showSuccess('Challenge deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
        },
        onError: (err) => showError(err.message || 'Failed to delete challenge')
    })

    const handleStatusChange = (challenge, status) => {
        if (challenge.status === status) return
        showConfirmation({
            title: 'Change Challenge Status',
            message: `Set "${challenge.title}" to ${status}? Participants will see this change immediately.`,
            confirmText: 'Update Status',
            type: 'warning',
            onConfirm: () => updateChallenge.mutate({ id: challenge._id, status })
        })
    }

    const handleDelete = (challenge) => {
        showDeleteConfirmation({
            itemName: `Challenge "${challenge.title}"`,
            onConfirm: () => deleteChallenge.mutate(challenge._id)
        })
    }

    const handleEdit = (challenge) => {
        showConfirmation({
            title: 'Edit Challenge',
            message: 'Proceed to the edit page? Remember to save your changes.',
            confirmText: 'Go to Edit',
            type: 'warning',
            onConfirm: () => navigate(`/edit-challenge/${challenge._id}`)
        })
    }

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value
        debouncedSearch(value, setSearchQuery)
    }, [debouncedSearch])

    if (isInitialLoading) return <EcoLoader />

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

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-900/60 backdrop-blur-sm text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64"
                        />
                        {isFetching && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                            showFilters
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-surface/50 text-text/70 hover:border-primary/50"
                        )}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            <motion.div
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0, marginTop: showFilters ? 0 : -12 }}
                className="overflow-hidden"
            >
                {showFilters && (
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-text/60">Status:</span>
                            {['all', 'active', 'draft', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                        statusFilter === status
                                            ? "bg-primary text-white"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-text/60 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {challenges.length > 0 ? (
                    challenges.map((challenge, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={challenge._id}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                        >
                            <div className="grid md:grid-cols-[1fr,auto] gap-6 items-start">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary/10 transition-colors">
                                        <Trophy className="text-text/40 group-hover:text-primary transition-colors" size={24} />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-heading leading-tight group-hover:text-primary transition-colors">{challenge.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={clsx(
                                                    "rounded-full border px-3 py-1 uppercase tracking-wider text-[11px] font-bold",
                                                    statusBadges[challenge.status] || 'bg-zinc-100 text-zinc-600'
                                                )}>
                                                    {challenge.status}
                                                </span>
                                                {challenge.creatorIsActive === false && (
                                                    <span className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-danger">
                                                        {challenge.creatorName ? `Hidden: ${challenge.creatorName} suspended` : 'Hidden: creator suspended'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-text/60">
                                            <span className="flex items-center gap-2">
                                                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                {challenge.category || 'Environmental'}
                                            </span>
                                            <span className="flex items-center gap-2 mt-1 sm:mt-0">
                                                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                {challenge.registeredParticipants || 0} Participants
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 md:items-end">
                                    <div className="flex flex-wrap items-center gap-2 justify-end">
                                        {[
                                            { key: 'active', label: 'Active', icon: ToggleRight, classes: "bg-emerald-500 text-white" },
                                            { key: 'draft', label: 'Draft', icon: FileText, classes: "bg-zinc-500 text-white" },
                                            { key: 'completed', label: 'Completed', icon: CheckCircle, classes: "bg-indigo-500 text-white" },
                                            { key: 'cancelled', label: 'Cancelled', icon: XCircle, classes: "bg-red-500 text-white" },
                                        ].map(option => {
                                            const Icon = option.icon
                                            const isActive = challenge.status === option.key
                                            return (
                                                <button
                                                    key={option.key}
                                                    onClick={() => handleStatusChange(challenge, option.key)}
                                                    disabled={isActive || updateChallenge.isPending}
                                                    className={clsx(
                                                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border border-transparent",
                                                        isActive
                                                            ? `${option.classes} shadow-sm`
                                                            : "text-text/60 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                    )}
                                                >
                                                    <Icon size={14} />
                                                    <span>{option.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 justify-end">
                                        <a
                                            href={`/challenges/${challenge.slug || challenge._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <ExternalLink size={16} />
                                            <span>View</span>
                                        </a>
                                        <button
                                            onClick={() => handleEdit(challenge)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 text-sm font-medium text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                                        >
                                            <Pencil size={16} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(challenge)}
                                            disabled={deleteChallenge.isPending}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 text-sm font-medium text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors disabled:opacity-60"
                                        >
                                            <Trash2 size={16} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
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
