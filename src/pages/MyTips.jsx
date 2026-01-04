import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    MoreVertical,
    ThumbsUp,
    Clock,
    CheckCircle2,
    FileText
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useMyTips, useTipMutations } from '../hooks/queries'
import { containerVariants, itemVariants } from '../utils/animations'
import { showDeleteConfirmation } from '../utils/toast.jsx'
import TipModal from '../components/TipModal.jsx'
import Button from '../components/ui/Button.jsx'
import { TipCardSkeleton } from '../components/Skeleton.jsx'
import clsx from 'clsx'

export default function MyTips() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all') // 'all', 'published', 'draft'
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTip, setEditingTip] = useState(null)

    const { data: tips = [], isLoading } = useMyTips({
        limit: 100,
        sortBy: 'createdAt',
        order: 'desc'
    })

    const { updateTip, deleteTip, createTip } = useTipMutations()

    const filteredTips = useMemo(() => {
        let result = tips

        if (searchQuery) {
            result = result.filter(tip =>
                tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tip.category || 'General').toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            result = result.filter(tip => tip.status === statusFilter)
        }

        return result
    }, [tips, searchQuery, statusFilter])

    const stats = useMemo(() => {
        return {
            total: tips.length,
            published: tips.filter(t => t.status === 'published').length,
            drafts: tips.filter(t => t.status === 'draft').length,
            upvotes: tips.reduce((acc, t) => acc + (t.upvotes || 0), 0)
        }
    }, [tips])

    const handleEdit = (tip) => {
        setEditingTip(tip)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        showDeleteConfirmation({
            itemName: 'Tip',
            onConfirm: () => deleteTip.mutate(id)
        })
    }

    const handleToggleStatus = (tip) => {
        const newStatus = tip.status === 'published' ? 'draft' : 'published'
        updateTip.mutate({
            id: tip.id,
            data: { status: newStatus }
        })
    }

    const handleSubmitTip = async (tipData) => {
        if (editingTip) {
            await updateTip.mutateAsync({ id: editingTip.id, data: tipData })
        } else {
            await createTip.mutateAsync(tipData)
        }
        setIsModalOpen(false)
        setEditingTip(null)
    }
    return (
        <motion.div
            key={`my-tips-page-${statusFilter}-${searchQuery}-${tips.length}`}
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-8 pb-12"
        >
            <motion.header
                variants={itemVariants}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-heading">My Tips</h1>
                    <p className="text-text/60">Share your eco-wisdom and manage your contributions</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingTip(null)
                        setIsModalOpen(true)
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Craft New Tip
                </Button>
            </motion.header>

            {/* Summary Stats */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
                {[
                    { label: 'Total Tips', value: stats.total, icon: BookOpen, color: 'text-primary' },
                    { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-500' },
                    { label: 'Drafts', value: stats.drafts, icon: EyeOff, color: 'text-orange-500' },
                    { label: 'Total Upvotes', value: stats.upvotes, icon: ThumbsUp, color: 'text-amber-500' }
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <stat.icon className={stat.color} size={20} />
                            <div className="h-6 w-1 rounded-full bg-light" />
                        </div>
                        <p className="mt-4 text-2xl font-bold text-heading">{stat.value}</p>
                        <p className="text-xs font-medium text-text/40">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search your tips..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
                    {['all', 'published', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={clsx(
                                'rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all',
                                statusFilter === status ? 'bg-primary text-surface shadow-md' : 'text-text/60 hover:text-text'
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips Grid */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {Array.from({ length: 3 }).map((_, i) => <TipCardSkeleton key={i} />)}
                    </motion.div>
                ) : filteredTips.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center"
                    >
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-4xl">💡</div>
                        <h3 className="text-xl font-bold text-heading">No tips found</h3>
                        <p className="mt-2 text-text/60">Share your first eco-tip to inspire the community!</p>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => {
                                setEditingTip(null)
                                setIsModalOpen(true)
                            }}
                        >
                            Share a Tip
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`tips-grid-${statusFilter}-${searchQuery}-${filteredTips.length}`}
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredTips.map((tip) => (
                            <motion.div
                                key={tip.id}
                                variants={itemVariants}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="p-6 flex-1">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                            {tip.category || 'General'}
                                        </span>
                                        <span className={clsx(
                                            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
                                            tip.status === 'published' ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                                        )}>
                                            {tip.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {tip.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors">
                                        {tip.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-3 text-sm text-text/70 leading-relaxed">
                                        {tip.content}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text/40">
                                                <ThumbsUp size={14} />
                                                {tip.upvotes || 0}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text/40">
                                                <Clock size={14} />
                                                {new Date(tip.updatedAt || tip.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleToggleStatus(tip)}
                                                className="rounded-lg p-2 text-text/40 transition-colors hover:bg-light hover:text-primary"
                                                title={tip.status === 'published' ? "Make Draft" : "Publish"}
                                            >
                                                {tip.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(tip)}
                                                className="rounded-lg p-2 text-text/40 transition-colors hover:bg-light hover:text-primary"
                                                title="Edit Tip"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tip.id)}
                                                className="rounded-lg p-2 text-text/40 transition-colors hover:bg-danger/10 hover:text-danger"
                                                title="Delete Tip"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <TipModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingTip(null)
                }}
                onSubmit={handleSubmitTip}
                editTip={editingTip}
            />
        </motion.div>
    )
}
