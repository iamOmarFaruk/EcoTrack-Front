import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import {
    Calendar,
    Search,
    MapPin,
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
    ExternalLink
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

const eventCategories = [
    'Tree Planting',
    'Waste Management',
    'Ocean Cleanup',
    'Solar & Energy',
    'Community Workshop',
    'Conservation',
    'Other'
]

function EditEventModal({ event, onClose, onSave, isLoading }) {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        detailedDescription: event?.detailedDescription || '',
        date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event?.location || '',
        organizer: event?.organizer || '',
        capacity: event?.capacity || '',
        duration: event?.duration || '',
        requirements: event?.requirements || '',
        benefits: event?.benefits || '',
        category: event?.category || '',
        status: event?.status || 'active'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
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
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800/60">
                    <h2 className="text-xl font-bold text-heading">Edit Event</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
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
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            >
                                <option value="">Select category</option>
                                {eventCategories.map(cat => (
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
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            >
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Organizer</label>
                            <input
                                type="text"
                                name="organizer"
                                value={formData.organizer}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 2 hours"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Short Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-heading mb-2">Detailed Description</label>
                            <textarea
                                name="detailedDescription"
                                value={formData.detailedDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-heading mb-2">Benefits</label>
                            <textarea
                                name="benefits"
                                value={formData.benefits}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

function DeleteConfirmModal({ event, onClose, onConfirm, isLoading }) {
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
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <Trash2 className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-heading">Delete Event</h3>
                        <p className="text-sm text-text/60">This action cannot be undone</p>
                    </div>
                </div>

                <p className="text-text/80 mb-6">
                    Are you sure you want to delete <span className="font-semibold text-heading">"{event?.title}"</span>?
                    {event?.registeredParticipants > 0 && (
                        <span className="block mt-2 text-amber-600 dark:text-amber-400 text-sm">
                            This event has {event.registeredParticipants} registered participant(s).
                        </span>
                    )}
                </p>

                <div className="flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Event'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function AdminEvents() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [deletingEvent, setDeletingEvent] = useState(null)

    const debouncedSearch = useMemo(() => {
        let timeout
        return (value, callback) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => callback(value), 300)
        }
    }, [])

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'events', searchQuery, statusFilter],
        queryFn: () => adminApi.getEvents({
            limit: 50,
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        })
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateEventStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Event status updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
        },
        onError: (err) => showError(err.message || 'Failed to update event')
    })

    const updateEvent = useMutation({
        mutationFn: ({ id, data }) => adminApi.updateEvent(id, data),
        onSuccess: () => {
            showSuccess('Event updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
            setEditingEvent(null)
        },
        onError: (err) => showError(err.message || 'Failed to update event')
    })

    const deleteEvent = useMutation({
        mutationFn: (id) => adminApi.deleteEvent(id),
        onSuccess: () => {
            showSuccess('Event deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
            setDeletingEvent(null)
        },
        onError: (err) => showError(err.message || 'Failed to delete event')
    })

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value
        debouncedSearch(value, setSearchQuery)
    }, [debouncedSearch])

    if (isLoading) return <EcoLoader />

    const events = data?.data || data || []

    const stats = {
        total: events.length,
        active: events.filter(e => e.status === 'active').length,
        draft: events.filter(e => e.status === 'draft').length,
        completed: events.filter(e => e.status === 'completed').length,
        cancelled: events.filter(e => e.status === 'cancelled').length
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/30" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Event Coordination</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Events <span className="text-primary">Management</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Coordinate, publish and moderate community gatherings.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            onChange={handleSearchChange}
                            className="pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64"
                        />
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

            {/* Events List */}
            <div className="grid gap-4">
                {events.length > 0 ? (
                    events.map((event, index) => {
                        const capacityPercentage = event.capacity > 0
                            ? Math.round((event.registeredParticipants / event.capacity) * 100)
                            : 0

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                key={event._id}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                                        {/* Event Info */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/15 group-hover:bg-primary/15 transition-colors">
                                                <Calendar className="text-primary/60 group-hover:text-primary transition-colors" size={24} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors truncate">
                                                        {event.title}
                                                    </h3>
                                                    <span className={clsx(
                                                        "shrink-0 rounded-full border px-3 py-0.5 uppercase tracking-wider text-[10px] font-bold",
                                                        statusConfig[event.status]?.badge || 'bg-zinc-100 text-zinc-600'
                                                    )}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium">
                                                    {event.creatorIsActive === false && (
                                                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                                                            {event.creatorName ? `Hidden: ${event.creatorName} suspended` : 'Hidden: creator suspended'}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5 text-text/50">
                                                        <MapPin size={14} className="text-primary/60" />
                                                        {event.location || 'Online'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-text/50">
                                                        <Clock size={14} className="text-primary/60" />
                                                        {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'TBD'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-text/50">
                                                        <Users size={14} className="text-primary/60" />
                                                        {event.registeredParticipants || 0} / {event.capacity || 0}
                                                        <span className="text-[11px] text-text/40">({capacityPercentage}%)</span>
                                                    </span>
                                                </div>
                                                {/* Capacity Progress Bar */}
                                                <div className="mt-3 w-full max-w-xs h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx(
                                                            "h-full rounded-full transition-all",
                                                            capacityPercentage >= 90 ? "bg-red-500" :
                                                            capacityPercentage >= 70 ? "bg-amber-500" : "bg-primary"
                                                        )}
                                                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            {/* Status Toggle Buttons */}
                                            <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                                                {Object.entries(statusConfig).map(([status, config]) => {
                                                    const Icon = config.icon
                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateStatus.mutate({ id: event._id, status })}
                                                            disabled={event.status === status || updateStatus.isPending}
                                                            className={clsx(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                                                                event.status === status
                                                                    ? config.button
                                                                    : "text-text/40 hover:bg-white dark:hover:bg-zinc-700 hover:text-text/70"
                                                            )}
                                                            title={config.label}
                                                        >
                                                            <Icon size={14} />
                                                            <span className="hidden lg:inline">{config.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1">
                                                <a
                                                    href={`/events/${event.slug || event._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 rounded-lg text-text/40 hover:text-primary hover:bg-primary/5 transition-colors"
                                                    title="View Event"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                                <button
                                                    onClick={() => setEditingEvent(event)}
                                                    className="p-2.5 rounded-lg text-text/40 hover:text-blue-500 hover:bg-blue-500/5 transition-colors"
                                                    title="Edit Event"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingEvent(event)}
                                                    className="p-2.5 rounded-lg text-text/40 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                                                    title="Delete Event"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Status Buttons */}
                                    <div className="md:hidden mt-4 flex flex-wrap items-center gap-2">
                                        {Object.entries(statusConfig).map(([status, config]) => {
                                            const Icon = config.icon
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => updateStatus.mutate({ id: event._id, status })}
                                                    disabled={event.status === status || updateStatus.isPending}
                                                    className={clsx(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                                                        event.status === status
                                                            ? config.button
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-text/40"
                                                    )}
                                                >
                                                    <Icon size={14} />
                                                    {config.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading">No events found</h3>
                        <p className="text-text/50">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Start by creating new community events.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingEvent && (
                    <EditEventModal
                        event={editingEvent}
                        onClose={() => setEditingEvent(null)}
                        onSave={(data) => updateEvent.mutate({ id: editingEvent._id, data })}
                        isLoading={updateEvent.isPending}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingEvent && (
                    <DeleteConfirmModal
                        event={deletingEvent}
                        onClose={() => setDeletingEvent(null)}
                        onConfirm={() => deleteEvent.mutate(deletingEvent._id)}
                        isLoading={deleteEvent.isPending}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
