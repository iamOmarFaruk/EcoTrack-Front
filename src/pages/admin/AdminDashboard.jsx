import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from 'recharts'
import {
  Users,
  Layers,
  CalendarClock,
  FileText,
  Clock3,
  CheckCircle
} from 'lucide-react'
import EcoLoader from '../../components/EcoLoader.jsx'

const metricIcons = {
  users: Users,
  challenges: Layers,
  events: CalendarClock,
  tips: FileText
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-[0_20px_60px_-25px_rgba(16,185,129,0.6)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ item }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
      <Clock3 className="text-emerald-300" size={16} />
      <div className="flex-1">
        <p className="text-sm text-white">{item.detail || item.action}</p>
        <p className="text-[11px] uppercase tracking-wide text-white/40">{item.performedBy}</p>
      </div>
      <span className="text-[11px] text-white/50">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.dashboard(),
    staleTime: 60 * 1000
  })

  const dashboard = data?.data || data

  const statusChartData = useMemo(() => {
    if (!dashboard?.breakdown) return []
    return [
      {
        name: 'Challenges',
        active: dashboard.breakdown.challenges.active,
        draft: dashboard.breakdown.challenges.draft,
        completed: dashboard.breakdown.challenges.completed
      },
      {
        name: 'Events',
        active: dashboard.breakdown.events.active,
        draft: dashboard.breakdown.events.draft
      },
      {
        name: 'Tips',
        active: dashboard.breakdown.tips.published,
        draft: dashboard.breakdown.tips.draft
      }
    ]
  }, [dashboard])

  if (isLoading) return <EcoLoader />

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Users" value={dashboard?.stats?.users ?? 0} icon={metricIcons.users} />
        <MetricCard label="Active Users" value={dashboard?.stats?.activeUsers ?? 0} icon={Users} />
        <MetricCard label="Challenges" value={dashboard?.stats?.challenges ?? 0} icon={metricIcons.challenges} />
        <MetricCard label="Events" value={dashboard?.stats?.events ?? 0} icon={metricIcons.events} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Publishing Status</p>
              <h3 className="text-xl font-semibold text-white">Inventory snapshot</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.3)', color: '#fff' }} />
                <Bar dataKey="active" stackId="a" fill="rgb(var(--color-primary))" />
                <Bar dataKey="draft" stackId="a" fill="rgba(52,211,153,0.5)" />
                <Bar dataKey="completed" stackId="a" fill="rgba(79,70,229,0.6)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Content freshness</p>
              <h3 className="text-xl font-semibold text-white">Latest activity</h3>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">
              Updated {dashboard?.latestContentUpdatedAt ? new Date(dashboard.latestContentUpdatedAt).toLocaleDateString() : 'today'}
            </span>
          </div>
          <div className="grid gap-3">
            {dashboard?.recentActivity?.length ? dashboard.recentActivity.map((item) => (
              <ActivityItem key={item._id || `${item.entity}-${item.createdAt}`} item={item} />
            )) : (
              <p className="text-sm text-white/60">No admin actions logged yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Challenges</p>
              <h3 className="text-xl font-semibold text-white">Latest submissions</h3>
            </div>
            <CheckCircle className="text-emerald-300" size={18} />
          </div>
          <div className="space-y-3">
            {dashboard?.latestChallenges?.length ? dashboard.latestChallenges.map((item) => (
              <div key={item._id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                <p className="font-semibold text-white">{item.title}</p>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">{item.status}</span>
                  <span>{item.registeredParticipants} participants</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No challenges found.</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Events</p>
              <h3 className="text-xl font-semibold text-white">Latest listings</h3>
            </div>
            <CalendarClock className="text-emerald-300" size={18} />
          </div>
          <div className="space-y-3">
            {dashboard?.latestEvents?.length ? dashboard.latestEvents.map((item) => (
              <div key={item._id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                <p className="font-semibold text-white">{item.title}</p>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">{item.status}</span>
                  <span>{item.registeredParticipants}/{item.capacity} going</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p className="text-sm text-white/60">No events found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
