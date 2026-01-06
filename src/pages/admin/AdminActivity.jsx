import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import EcoLoader from '../../components/EcoLoader.jsx'
import { ActivitySquare } from 'lucide-react'

export default function AdminActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminApi.getActivity({ limit: 40 })
  })

  const activity = data?.data || data || []

  if (isLoading) return <EcoLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <ActivitySquare size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text/40">Audit Trail</p>
          <h1 className="text-2xl font-bold text-heading">Every admin operation is tracked</h1>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        {activity.length ? activity.map((item) => (
          <div key={item._id} className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 px-3 py-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-heading">{item.detail || item.action}</p>
              <p className="text-xs text-text/50">{item.entity} • {item.entityId}</p>
            </div>
            <div className="text-right text-xs text-text/50">
              <p>{new Date(item.createdAt).toLocaleString()}</p>
              <p className="text-emerald-600 dark:text-emerald-300">{item.performedBy || 'admin'}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-text/60">No activity recorded yet.</p>
        )}
      </div>
    </div>
  )
}
