import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import EcoLoader from '../../components/EcoLoader.jsx'
import Button from '../../components/ui/Button.jsx'
import { showDeleteConfirmation, showError, showSuccess } from '../../utils/toast.jsx'
import { ActivitySquare, Clock, Shield, Database, User, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function AdminActivity() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminApi.getActivity({ limit: 40 })
  })

  const clearLog = useMutation({
    mutationFn: () => adminApi.clearActivity(),
    onSuccess: (response) => {
      const deletedCount = response?.data?.deletedCount || 0
      showSuccess(deletedCount ? `Cleared ${deletedCount} activity records.` : 'Activity log cleared.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] })
    },
    onError: (err) => showError(err.message || 'Failed to clear activity log')
  })

  const deleteEntry = useMutation({
    mutationFn: (id) => adminApi.deleteActivity(id),
    onSuccess: () => {
      showSuccess('Activity deleted.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] })
    },
    onError: (err) => showError(err.message || 'Failed to delete activity')
  })

  const activity = data?.data || data || []

  if (isLoading) return <EcoLoader />

  const handleClearLog = () => {
    showDeleteConfirmation({
      itemName: 'Activity Log',
      onConfirm: () => clearLog.mutate()
    })
  }

  const handleDeleteEntry = (itemId) => {
    showDeleteConfirmation({
      itemName: 'Activity',
      onConfirm: () => deleteEntry.mutate(itemId)
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-8 rounded-full bg-primary/30" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Security & Logs</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
              Audit <span className="text-primary">Trail</span>
            </h1>
            <p className="mt-1 text-text/60 font-medium">Monitoring every administrative operation in real-time.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleClearLog}
            disabled={clearLog.isPending || activity.length === 0}
            className="flex items-center gap-2 bg-danger text-white hover:bg-danger/90 hover:shadow-danger/30 disabled:opacity-60"
          >
            <Trash2 size={18} />
            Clear Log
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[120px] top-0 bottom-0 w-px bg-primary/20 dark:bg-primary/20" />

        <div className="space-y-6 relative">
          {activity.length > 0 ? (
            activity.map((item, idx) => {
              const createdAt = new Date(item.createdAt)
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  key={item._id}
                  className="grid grid-cols-[92px_28px_1fr] gap-4 relative group items-center"
                >
                  <div className="text-right pr-1">
                    <div className="text-xs font-bold text-text/60 uppercase tracking-wide">
                      {createdAt.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[11px] text-text/40 font-medium">
                      {createdAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-white dark:bg-black border-2 border-primary/20 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary/30 dark:bg-primary/40 group-hover:bg-primary transition-colors" />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/40 p-5 transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">
                              {item.detail || item.action}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-text/50 uppercase">
                              {item.entity}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-text/40 font-medium">
                            <span className="flex items-center gap-1">
                              <Database size={12} />
                              {item.entityId}
                            </span>
                            <span className="flex items-center gap-1 text-primary/60">
                              <User size={12} />
                              {item.performedBy || 'System Admin'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text/30 bg-zinc-100/50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-xl">
                            <Clock size={12} />
                            {createdAt.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <button
                            onClick={() => handleDeleteEntry(item._id)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-danger/20 text-danger hover:bg-danger/10 hover:border-danger/40 transition-all"
                            aria-label="Delete activity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50">
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
                <Shield size={40} />
              </div>
              <h3 className="text-xl font-bold text-heading">No logs available</h3>
              <p className="text-text/50 text-center px-6">System activities and admin operations will appear here as they happen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
