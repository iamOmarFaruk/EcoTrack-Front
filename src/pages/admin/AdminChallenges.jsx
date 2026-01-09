import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess, showConfirmation, showDeleteConfirmation } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import Tooltip from '../../components/ui/Tooltip.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import {
    Trophy,
    Search,
    Clock,
    Users,
    Filter,
    Edit3,
    Trash2,
    X,
    ChevronDown,
    CheckCircle,
    XCircle,
    FileText,
    Play,
    ExternalLink,
    Target,
    Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const statusConfig = {
    active: {
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        button: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
        icon: Play,
        label: 'Active'
    },
    draft: {
        badge: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
        button: 'bg-zinc-500 text-white shadow-lg shadow-zinc-500/20',
        icon: FileText,
        label: 'Draft'
    },
    completed: {
        badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        button: 'bg-blue-500 text-white shadow-lg shadow-blue-500/20',
        icon: CheckCircle,
        label: 'Completed'
    },
    cancelled: {
        badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        button: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
        icon: XCircle,
        label: 'Cancelled'
    }
}

const challengeCategories = [
    'Energy Saving',
    'Waste Reduction',
    'Water Conservation',
    'Transportation',
    'Sustainable Living',
    'Community Action',
    'Other'
]

function EditChallengeModal({ challenge, onClose, onSave, isLoading }) {
    const [formData, setFormData] = useState({
        title: challenge?.title || '',
        shortDescription: challenge?.shortDescription || '',
        detailedDescription: challenge?.detailedDescription || '',
        category: challenge?.category || '',
        status: challenge?.status || 'active',
        duration: challenge?.duration || '',
        startDate: challenge?.startDate ? new Date(challenge.startDate).toISOString().slice(0, 16) : '',
        endDate: challenge?.endDate ? new Date(challenge.endDate).toISOString().slice(0, 16) : '',
        communityImpact: challenge?.communityImpact || '',
        image: challenge?.image || '',
        featured: challenge?.featured || false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        showConfirmation({
            title: 'Save Challenge Changes',
            message: 'Are you sure you want to save these changes? This will update the challenge immediately.',
            confirmText: 'Save Changes',
            onConfirm: () => onSave(formData),
            type: 'warning'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 scrollbar-hide overflow-x-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800/60">
                    <h2 className="text-xl font-bold text-heading">Edit Challenge</h2>
                    <Tooltip content="Close">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </Tooltip>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 pr-10 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
                            >
                                <option value="">Select category</option>
                                {challengeCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 pr-10 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
                            >
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Start Date</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">End Date</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 30 days"
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Community Impact</label>
                            <input
                                type="text"
                                name="communityImpact"
                                value={formData.communityImpact}
                                onChange={handleChange}
                                placeholder="e.g., 100kg CO2 saved"
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Short Description</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Detailed Description</label>
                            <textarea
                                name="detailedDescription"
                                value={formData.detailedDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-primary/20 bg-surface/50 dark:bg-zinc-900/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary dark:focus:border-primary transition-all"
                            />
                            {formData.image && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={formData.image}
                                        alt="Challenge preview"
                                        className="w-full h-32 object-cover"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20"
                                />
                                <span className="text-sm font-medium text-heading">Featured Challenge</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                        <Tooltip content="Cancel editing">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </Tooltip>
                        <Tooltip content="Save challenge changes">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Tooltip>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}



export default function AdminChallenges() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [editingChallenge, setEditingChallenge] = useState(null)

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
            limit: 50,
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        keepPreviousData: true,
        placeholderData: (prev) => prev,
        staleTime: 1000
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateChallengeStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Challenge status updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
        },
        onError: (err) => showError(err.message || 'Failed to update challenge')
    })

    const updateChallenge = useMutation({
        mutationFn: ({ id, data }) => adminApi.updateChallenge(id, data),
        onSuccess: () => {
            showSuccess('Challenge updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
            setEditingChallenge(null)
        },
        onError: (err) => showError(err.message || 'Failed to update challenge')
    })

    const fetchChallengeForEdit = useMutation({
        mutationFn: (id) => adminApi.getChallenge(id),
        onSuccess: (response) => {
            setEditingChallenge(response.data)
        },
        onError: (err) => showError(err.message || 'Failed to load challenge details')
    })

    const deleteChallenge = useMutation({
        mutationFn: (id) => adminApi.deleteChallenge(id),
        onSuccess: (response) => {
            if (response.cancelled) {
                showSuccess('Challenge cancelled (had active participants)')
            } else {
                showSuccess('Challenge deleted successfully')
            }
            queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
        },
        onError: (err) => showError(err.message || 'Failed to delete challenge')
    })

    const handleStatusUpdate = (challengeId, newStatus) => {
        showConfirmation({
            title: 'Change Challenge Status',
            message: `Are you sure you want to change this challenge status to "${newStatus}"? This will affect how users can interact with the challenge.`,
            confirmText: 'Change Status',
            onConfirm: () => updateStatus.mutate({ id: challengeId, status: newStatus }),
            type: 'warning'
        })
    }

    const handleEditChallenge = (challenge) => {
        showConfirmation({
            title: 'Edit Challenge',
            message: 'You are about to edit this challenge. Make sure to save your changes when done.',
            confirmText: 'Continue Editing',
            onConfirm: () => fetchChallengeForEdit.mutate(challenge._id),
            type: 'warning'
        })
    }

    const handleDeleteChallenge = (challenge) => {
        showDeleteConfirmation({
            itemName: `Challenge "${challenge.title}"`,
            onConfirm: () => deleteChallenge.mutate(challenge._id)
        })
    }

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value
        debouncedSearch(value, setSearchQuery)
    }, [debouncedSearch])

    if (isInitialLoading) return <EcoLoader />

    const challenges = data?.data || data || []

    const stats = {
        total: challenges.length,
        active: challenges.filter(c => c.status === 'active').length,
        draft: challenges.filter(c => c.status === 'draft').length,
        completed: challenges.filter(c => c.status === 'completed').length,
        cancelled: challenges.filter(c => c.status === 'cancelled').length
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/30" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Content Control</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Challenges <span className="text-primary">Management</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Approve, archive and monitor environmental challenges.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            onChange={handleSearchChange}
                            className="pl-11 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-900/60 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64"
                        />
                        {isFetching && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        )}
                    </div>

                    {/* Filter Button */}
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
                        <ChevronDown size={16} className={clsx("transition-transform", showFilters && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-zinc-500' },
                    { label: 'Active', value: stats.active, color: 'bg-emerald-500' },
                    { label: 'Draft', value: stats.draft, color: 'bg-zinc-400' },
                    { label: 'Completed', value: stats.completed, color: 'bg-blue-500' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500' }
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60"
                    >
                        <div className={clsx("h-10 w-1 rounded-full", stat.color)} />
                        <div>
                            <p className="text-2xl font-bold text-heading">{stat.value}</p>
                            <p className="text-xs font-medium text-text/50">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-text/60">Status:</span>
                                {['all', 'active', 'draft', 'completed', 'cancelled'].map(status => (
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Challenges Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {challenges.length > 0 ? (
                    challenges.map((challenge, index) => {
                        const daysRemaining = challenge.endDate
                            ? Math.max(0, Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
                            : null

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                key={challenge._id}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                            >
                                {/* Card Header */}
                                <div className="p-5 pb-3">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/15 group-hover:bg-primary/15 transition-colors">
                                            <Trophy className="text-primary/60 group-hover:text-primary transition-colors" size={20} />
                                        </div>
                                        <span className={clsx(
                                            "shrink-0 rounded-full border px-2.5 py-0.5 uppercase tracking-wider text-[10px] font-bold",
                                            statusConfig[challenge.status]?.badge || 'bg-zinc-100 text-zinc-600'
                                        )}>
                                            {challenge.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                        {challenge.title}
                                    </h3>

                                    {challenge.creatorIsActive === false && (
                                        <span className="inline-block rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">
                                            {challenge.creatorName ? `Hidden: ${challenge.creatorName} suspended` : 'Hidden: creator suspended'}
                                        </span>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="px-5 pb-3 space-y-3">
                                    {/* Category */}
                                    <div className="flex items-center gap-2 text-[13px] text-text/70">
                                        <Target size={14} className="text-primary/60 shrink-0" />
                                        <span className="truncate">{challenge.category || 'Environmental'}</span>
                                    </div>

                                    {/* Duration/Dates */}
                                    <div className="flex items-center gap-2 text-[13px] text-text/70">
                                        <Calendar size={14} className="text-primary/60 shrink-0" />
                                        {challenge.startDate ? (
                                            <span>
                                                {new Date(challenge.startDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })} - {challenge.endDate ? new Date(challenge.endDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'Ongoing'}
                                            </span>
                                        ) : (
                                            <span>{challenge.duration || 'No duration set'}</span>
                                        )}
                                    </div>

                                    {/* Participants */}
                                    <div className="flex items-center gap-2 text-[13px] text-text/70">
                                        <Users size={14} className="text-primary/60 shrink-0" />
                                        <span>{challenge.registeredParticipants || challenge.participantCount || 0} Participants</span>
                                        {daysRemaining !== null && challenge.status === 'active' && (
                                            <span className="text-[11px] text-text/40">({daysRemaining} days left)</span>
                                        )}
                                    </div>

                                    {/* Progress indicator for active challenges */}
                                    {challenge.status === 'active' && daysRemaining !== null && challenge.startDate && challenge.endDate && (
                                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            {(() => {
                                                const totalDays = Math.ceil((new Date(challenge.endDate) - new Date(challenge.startDate)) / (1000 * 60 * 60 * 24))
                                                const progress = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100))
                                                return (
                                                    <div
                                                        className={clsx(
                                                            "h-full rounded-full transition-all",
                                                            progress >= 90 ? "bg-red-500" :
                                                            progress >= 70 ? "bg-amber-500" : "bg-primary"
                                                        )}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                )
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer - Actions */}
                                <div className="px-5 py-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        {/* Status Toggle Buttons */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {Object.entries(statusConfig).slice(0, 2).map(([status, config]) => {
                                                const Icon = config.icon
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusUpdate(challenge._id, status)}
                                                        disabled={challenge.status === status || updateStatus.isPending}
                                                        className={clsx(
                                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all border border-transparent",
                                                            challenge.status === status
                                                                ? config.button
                                                                : "text-text/60 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700"
                                                        )}
                                                    >
                                                        <Icon size={12} />
                                                        <span>{config.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                            <a
                                                href={`/challenges/${challenge.slug || challenge._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                                            >
                                                <ExternalLink size={16} />
                                                <span>View</span>
                                            </a>
                                            <button
                                                onClick={() => handleEditChallenge(challenge)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500/20 text-sm font-medium text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                                            >
                                                <Edit3 size={16} />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChallenge(challenge)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 text-sm font-medium text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Additional Status Buttons */}
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        {Object.entries(statusConfig).slice(2).map(([status, config]) => {
                                            const Icon = config.icon
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(challenge._id, status)}
                                                    disabled={challenge.status === status || updateStatus.isPending}
                                                    className={clsx(
                                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all border border-transparent",
                                                        challenge.status === status
                                                            ? config.button
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-text/60"
                                                    )}
                                                >
                                                    <Icon size={12} />
                                                    <span>{config.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
                            <Trophy size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading">No challenges found</h3>
                        <p className="text-text/50">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Start by creating new environmental challenges.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingChallenge && (
                    <EditChallengeModal
                        challenge={editingChallenge}
                        onClose={() => setEditingChallenge(null)}
                        onSave={(data) => updateChallenge.mutate({ id: editingChallenge._id, data })}
                        isLoading={updateChallenge.isPending}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
