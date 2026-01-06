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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  Layers,
  CalendarClock,
  FileText,
  Clock3,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import EcoLoader from '../../components/EcoLoader.jsx'

const metricIcons = {
  users: Users,
  challenges: Layers,
  events: CalendarClock,
  tips: FileText
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

function MetricCard({ label, value, icon: Icon, delay }) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
      }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md dark:shadow-none"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text/60">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-heading">{value}</p>
            {/* Mock trend for visual appeal */}
            <span className="flex items-center text-xs font-medium text-emerald-500">
              <TrendingUp size={12} className="mr-0.5" /> +2.5%
            </span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={24} />
        </div>
      </div>
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
    </motion.div>
  )
}

function ActivityItem({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock3 size={14} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-heading">{item.detail || item.action}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text/50 font-semibold">{item.performedBy}</span>
          <span className="text-[10px] text-text/40">•</span>
          <span className="text-[10px] text-text/40">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
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
        completed: dashboard.breakdown.challenges.completed || 0
      },
      {
        name: 'Events',
        active: dashboard.breakdown.events.active,
        draft: dashboard.breakdown.events.draft,
        completed: 0
      },
      {
        name: 'Tips',
        active: dashboard.breakdown.tips.published,
        draft: dashboard.breakdown.tips.draft,
        completed: 0
      }
    ]
  }, [dashboard])

  if (isLoading) return <EcoLoader />

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Users" value={dashboard?.stats?.users ?? 0} icon={metricIcons.users} />
        <MetricCard label="Active Users" value={dashboard?.stats?.activeUsers ?? 0} icon={Users} />
        <MetricCard label="Challenges" value={dashboard?.stats?.challenges ?? 0} icon={metricIcons.challenges} />
        <MetricCard label="Events" value={dashboard?.stats?.events ?? 0} icon={metricIcons.events} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50 font-bold">Content Overview</p>
              <h3 className="text-lg font-bold text-heading">Inventory Status</h3>
            </div>
            <Activity className="text-primary" size={20} />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--color-text))', fontSize: 12, opacity: 0.7 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--color-text))', fontSize: 12, opacity: 0.7 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgb(var(--color-bg-muted))', opacity: 0.5 }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgb(var(--color-border))',
                    backgroundColor: 'rgb(var(--color-surface))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: 'rgb(var(--color-text))'
                  }}
                />
                <Bar dataKey="active" name="Active/Published" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="draft" name="Draft" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50 font-bold">Audit Log</p>
              <h3 className="text-lg font-bold text-heading">Recent Activity</h3>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Updated {dashboard?.latestContentUpdatedAt ? new Date(dashboard.latestContentUpdatedAt).toLocaleDateString() : 'Today'}
            </span>
          </div>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {dashboard?.recentActivity?.length ? dashboard.recentActivity.map((item) => (
              <ActivityItem key={item._id || `${item.entity}-${item.createdAt}`} item={item} />
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-text/40">
                <Clock3 size={40} strokeWidth={1.5} className="mb-2 opacity-50" />
                <p>No recent activity recorded</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-heading">
              <Layers size={18} className="text-primary" />
              Latest Challenges
            </h3>
            <button className="text-xs font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {dashboard?.latestChallenges?.length ? dashboard.latestChallenges.map((item) => (
              <div key={item._id} className="group flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-3 hover:bg-muted/50 hover:border-border transition-all">
                <div>
                  <p className="font-semibold text-heading group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-text/50">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-heading">{item.registeredParticipants} joined</p>
                    <span className={clsx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide",
                      item.status === 'active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-500"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-text/60">No challenges found.</p>}
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-heading">
              <CalendarClock size={18} className="text-primary" />
              Latest Events
            </h3>
            <button className="text-xs font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {dashboard?.latestEvents?.length ? dashboard.latestEvents.map((item) => (
              <div key={item._id} className="group flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-3 hover:bg-muted/50 hover:border-border transition-all">
                <div>
                  <p className="font-semibold text-heading group-hover:text-primary transition-colors">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs text-text/50">
                    {/* Reverted to createdAt as item.date/location is uncertain */}
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium text-heading">{item.registeredParticipants}/{item.capacity}</p>
                    <span className={clsx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide",
                      item.status === 'active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-500"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-text/60">No events found.</p>}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
