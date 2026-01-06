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
    <div className="space-y-6 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-200">
          <ActivitySquare size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Audit Trail</p>
          <h1 className="text-2xl font-bold">Every admin operation is tracked</h1>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        {activity.length ? activity.map((item) => (
          <div key={item._id} className="flex flex-col gap-1 rounded-xl border border-white/5 bg-black/20 px-3 py-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">{item.detail || item.action}</p>
              <p className="text-xs text-white/50">{item.entity} • {item.entityId}</p>
            </div>
            <div className="text-right text-xs text-white/50">
              <p>{new Date(item.createdAt).toLocaleString()}</p>
              <p className="text-emerald-200">{item.performedBy || 'admin'}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-white/60">No activity recorded yet.</p>
        )}
      </div>
    </div>
  )
}
