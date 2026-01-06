import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import EcoLoader from '../../components/EcoLoader.jsx'
import { ActivitySquare, Clock, Shield, Database, User } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function AdminActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminApi.getActivity({ limit: 40 })
  })

  const activity = data?.data || data || []

  if (isLoading) return <EcoLoader />

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
            <ActivitySquare size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-8 rounded-full bg-slate-400/40" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Security & Logs</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
              Audit <span className="text-slate-400">Trail</span>
            </h1>
            <p className="mt-1 text-text/60 font-medium">Monitoring every administrative operation in real-time.</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 ml-[11px]" />

        <div className="space-y-6 relative">
          {activity.length > 0 ? (
            activity.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                key={item._id}
                className="relative pl-12 group"
              >
                <div className="absolute left-0 top-3 h-6 w-6 rounded-full bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors" />
                </div>

                <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 p-5 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors">
                          {item.detail || item.action}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-text/50 uppercase">
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

                    <div className="flex items-center gap-2 text-xs font-bold text-text/30 bg-slate-100/50 dark:bg-slate-800/30 px-3 py-1.5 rounded-xl shrink-0">
                      <Clock size={14} />
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/50 ml-12">
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

