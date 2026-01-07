import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { Calendar, ToggleLeft, ToggleRight, Filter, Search, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const statusBadges = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    completed: 'bg-primary/10 text-primary dark:text-primary/90 border-primary/20',
    cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
}

export default function AdminEvents() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'events'],
        queryFn: () => adminApi.getEvents({ limit: 40 })
    })

    const updateEvent = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateEventStatus(id, { status }),
        onSuccess: () => {
            showSuccess('Event status updated successfully')
            queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
        },
        onError: (err) => showError(err.message || 'Failed to update event')
    })

    if (isLoading) return <EcoLoader />

    const events = data?.data || data || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={event._id}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/15 group-hover:bg-primary/15 transition-colors">
                                        <Calendar className="text-primary/50 group-hover:text-primary transition-colors" size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors truncate">{event.title}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium">
                                            <span className={clsx(
                                                "rounded-full border px-3 py-0.5 uppercase tracking-wider text-[10px]",
                                                statusBadges[event.status] || 'bg-zinc-100 text-zinc-600'
                                            )}>
                                                {event.status}
                                            </span>
                                            {event.creatorIsActive === false && (
                                                <span className="rounded-full border border-danger/20 bg-danger/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
                                                    {event.creatorName ? `Hidden: ${event.creatorName} suspended` : 'Hidden: creator suspended'}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5 text-text/50">
                                                <MapPin size={14} className="text-primary/60" />
                                                {event.location || 'Online'}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-text/50">
                                                <Clock size={14} className="text-primary/60" />
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                                    <button
                                        onClick={() => updateEvent.mutate({ id: event._id, status: 'active' })}
                                        disabled={event.status === 'active'}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            event.status === 'active'
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-text/50 hover:bg-white dark:hover:bg-zinc-700"
                                        )}
                                    >
                                        <ToggleRight size={16} />
                                        Active
                                    </button>
                                    <button
                                        onClick={() => updateEvent.mutate({ id: event._id, status: 'draft' })}
                                        disabled={event.status === 'draft'}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            event.status === 'draft'
                                                ? "bg-zinc-500 text-white shadow-lg shadow-zinc-500/20"
                                                : "text-text/50 hover:bg-white dark:hover:bg-zinc-700"
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
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-heading">No events found</h3>
                        <p className="text-text/50">Start by creating new community events.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
