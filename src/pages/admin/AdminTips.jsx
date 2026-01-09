import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess, showConfirmation } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Lightbulb, ToggleLeft, ToggleRight, Search, User, Filter, Edit3, X, Check, Tag, ThumbsUp, Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const statusBadges = {
    published: 'bg-primary/10 text-primary border-primary/20',
    draft: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
}

const categoryColors = {
    'General': 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    'Energy': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'Water': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'Waste': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Transport': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    'Food': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'Shopping': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    'Home': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    'Garden': 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20',
    'Lifestyle': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
}

const categories = ['All', 'General', 'Energy', 'Water', 'Waste', 'Transport', 'Food', 'Shopping', 'Home', 'Garden', 'Lifestyle']

// Helper to determine if tip is published (handles different data formats)
const isPublished = (tip) => {
    if (tip.status === 'published') return true
    if (tip.status === 'draft') return false
    // Fallback: if no status field, assume published (visible tips)
    if (tip.isPublished !== undefined) return tip.isPublished
    return true // default to published if no status info
}

function EditTipModal({ tip, onClose, onSave, isLoading }) {
    const [formData, setFormData] = useState({
        title: tip.title || '',
        content: tip.content || '',
        category: tip.category || 'General',
        status: tip.status || 'published'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.title.trim()) {
            showError('Title is required')
            return
        }
        if (formData.title.trim().length < 5) {
            showError('Title must be at least 5 characters')
            return
        }
        if (!formData.content.trim()) {
            showError('Content is required')
            return
        }
        if (formData.content.trim().length < 20) {
            showError('Content must be at least 20 characters')
            return
        }
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Edit3 className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-heading">Edit Tip</h2>
                            <p className="text-sm text-text/50">Update tip details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} className="text-text/50" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-heading mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter tip title..."
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50 text-heading placeholder:text-text/30 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-heading mb-2">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Enter tip content..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50 text-heading placeholder:text-text/30 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                        />
                        <p className="mt-1 text-xs text-text/40">{formData.content.length}/500 characters</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-heading mb-2">Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50 text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-heading mb-2">Status</label>
                            <div className="relative">
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50 text-heading focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Check size={16} />
                                    Save Changes
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

export default function AdminTips() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [editingTip, setEditingTip] = useState(null)
    const [showFilters, setShowFilters] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'tips'],
        queryFn: () => adminApi.getTips({ limit: 100 })
    })

    const updateTip = useMutation({
        mutationFn: ({ id, ...payload }) => adminApi.updateTip(id, payload),
        onSuccess: () => {
            showSuccess('Tip updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'tips'] })
            setEditingTip(null)
        },
        onError: (err) => showError(err.message || 'Failed to update tip')
    })

    const handleStatusChange = (tip, newStatus) => {
        const action = newStatus === 'published' ? 'publish' : 'unpublish'
        showConfirmation({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Tip`,
            message: `Are you sure you want to ${action} "${tip.title}"? ${newStatus === 'draft' ? 'This will hide the tip from users.' : 'This will make the tip visible to all users.'}`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            type: newStatus === 'draft' ? 'warning' : 'warning',
            onConfirm: () => {
                updateTip.mutate({ id: tip.id || tip._id, status: newStatus })
            }
        })
    }

    const handleEditSave = (formData) => {
        if (!editingTip) return
        updateTip.mutate({
            id: editingTip.id || editingTip._id,
            ...formData
        })
    }

    const tips = useMemo(() => data?.data || data || [], [data])

    // Filter tips based on search, category, and status
    const filteredTips = useMemo(() => {
        return tips.filter(tip => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                tip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tip.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tip.authorName?.toLowerCase().includes(searchQuery.toLowerCase())

            // Category filter
            const matchesCategory = categoryFilter === 'All' || tip.category === categoryFilter

            // Status filter
            const matchesStatus = statusFilter === 'All' || tip.status === statusFilter

            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [tips, searchQuery, categoryFilter, statusFilter])

    // Stats
    const stats = useMemo(() => ({
        total: tips.length,
        published: tips.filter(t => t.status === 'published').length,
        draft: tips.filter(t => t.status === 'draft').length
    }), [tips])

    if (isLoading) return <EcoLoader />

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-8 rounded-full bg-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Knowledge Base</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
                        Tips <span className="text-primary">Management</span>
                    </h1>
                    <p className="mt-2 text-text/60 font-medium">Verify, edit and publish eco-friendly tips from the community.</p>
                </div>

                {/* Stats badges */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                        <span className="text-xs font-medium text-text/50">Total</span>
                        <span className="text-sm font-bold text-heading">{stats.total}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Published</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.published}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Draft</span>
                        <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{stats.draft}</span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search tips by title, content, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50 backdrop-blur-sm text-sm text-heading placeholder:text-text/40 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={14} className="text-text/40" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle Button */}
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white hover:bg-primary/90 transition-all"
                >
                    <Filter size={18} />
                    Filters
                    {(categoryFilter !== 'All' || statusFilter !== 'All') && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white text-primary text-[10px] font-bold">
                            {(categoryFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Dropdowns */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/60">
                            <div className="flex items-center gap-2">
                                <Tag size={16} className="text-text/40" />
                                <span className="text-sm font-medium text-text/60">Category:</span>
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="pl-3 pr-8 py-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 text-sm text-heading focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ToggleRight size={16} className="text-text/40" />
                                <span className="text-sm font-medium text-text/60">Status:</span>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="pl-3 pr-8 py-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 text-sm text-heading focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="All">All</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                                </div>
                            </div>

                            {(categoryFilter !== 'All' || statusFilter !== 'All') && (
                                <button
                                    onClick={() => {
                                        setCategoryFilter('All')
                                        setStatusFilter('All')
                                    }}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <X size={14} />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results count */}
            {(searchQuery || categoryFilter !== 'All' || statusFilter !== 'All') && (
                <p className="text-sm text-text/50">
                    Showing <span className="font-semibold text-heading">{filteredTips.length}</span> of {tips.length} tips
                </p>
            )}

            {/* Tips Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {filteredTips.length > 0 ? (
                    filteredTips.map((tip, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            key={tip.id || tip._id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                        >
                            <div className="p-6">
                                {/* Header with icon and badges */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/15 transition-colors">
                                        <Lightbulb className="text-primary/70 group-hover:text-primary transition-colors" size={22} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            "rounded-full border px-3 py-1 uppercase tracking-wider text-[10px] font-bold",
                                            isPublished(tip) ? statusBadges.published : statusBadges.draft
                                        )}>
                                            {isPublished(tip) ? 'Published' : 'Draft'}
                                        </span>
                                        <span className={clsx(
                                            "rounded-full border px-3 py-1 text-[10px] font-bold",
                                            categoryColors[tip.category] || categoryColors['General']
                                        )}>
                                            {tip.category || 'General'}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    {tip.title}
                                </h3>

                                {/* Author info */}
                                <div className="flex items-center gap-3 text-xs font-medium text-text/40 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} className="text-primary/60" />
                                        <span>By {tip.authorName || 'Anonymous'}</span>
                                    </div>
                                    {tip.upvoteCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp size={12} />
                                            <span>{tip.upvoteCount}</span>
                                        </div>
                                    )}
                                    {tip.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content preview */}
                                <p className="text-sm text-text/60 line-clamp-3 leading-relaxed">
                                    {tip.content}
                                </p>

                                {/* Suspended author warning */}
                                {tip.authorIsActive === false && (
                                    <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
                                        <span className="text-[11px] font-bold text-danger">
                                            Hidden: {tip.authorDisplayName || tip.authorName || 'creator'} suspended
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/20">
                                <div className="flex items-center justify-end gap-2">
                                    {/* Edit button */}
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingTip(tip)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm border-primary text-primary hover:bg-white hover:text-primary dark:hover:bg-zinc-900 dark:hover:text-primary"
                                    >
                                        <Edit3 size={14} />
                                        Edit
                                    </Button>

                                    {/* Status toggle button */}
                                    {isPublished(tip) ? (
                                        <Button
                                            onClick={() => handleStatusChange(tip, 'draft')}
                                            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 shadow-[0_2px_0_0_rgba(220,38,38,1)] hover:shadow-[0_1px_0_0_rgba(220,38,38,1)]"
                                        >
                                            <ToggleLeft size={14} />
                                            Draft
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleStatusChange(tip, 'published')}
                                            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90"
                                        >
                                            <ToggleRight size={14} />
                                            Publish
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/50 dark:bg-zinc-800/20">
                        <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-text/20 mb-4">
                            <Lightbulb size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading mb-1">
                            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All' ? 'No tips match your filters' : 'No tips found'}
                        </h3>
                        <p className="text-text/50 text-center max-w-sm">
                            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start by creating new environmental tips.'}
                        </p>
                        {(searchQuery || categoryFilter !== 'All' || statusFilter !== 'All') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setCategoryFilter('All')
                                    setStatusFilter('All')
                                }}
                                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                <X size={16} />
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingTip && (
                    <EditTipModal
                        tip={editingTip}
                        onClose={() => setEditingTip(null)}
                        onSave={handleEditSave}
                        isLoading={updateTip.isPending}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
