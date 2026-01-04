import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Zap,
  Droplets,
  Trees,
  Activity,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
  Target,
  Leaf,
  Star
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useUserProfile } from '../hooks/queries'
import { containerVariants, itemVariants } from '../utils/animations'

// Mock data for the impact chart - in a real app, this would come from the backend
const impactData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 90 },
  { name: 'Sat', value: 70 },
  { name: 'Sun', value: 85 },
]

export default function Profile() {
  const { auth } = useAuth()
  const { data: userData, isLoading } = useUserProfile()

  if (isLoading) {
    return <EcoLoader />
  }

  const user = userData || auth.user || {}
  const displayName = user.name || user.displayName || 'Eco Warrior'
  const userRank = user.rank || 'Seedling'

  const stats = [
    { label: 'CO2 Saved', value: user.stats?.co2Saved || '12.4kg', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Water Saved', value: user.stats?.waterSaved || '450L', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Trees Planted', value: user.stats?.treesPlanted || '5', icon: Trees, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Activity Score', value: user.stats?.score || '850', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  return (
    <motion.div
      key={`profile-page-${user.id || 'loading'}`}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      {/* Premium Hero Section */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-xl"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* Avatar */}
          <div className="group relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-light/5 shadow-xl transition-transform duration-500 group-hover:scale-105 md:h-32 md:w-32">
              {user.avatarUrl || user.photoURL ? (
                <img src={user.avatarUrl || user.photoURL} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold uppercase text-primary backdrop-blur-md">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-surface shadow-lg">
              <Award size={18} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">{displayName}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <Target size={14} />
                {userRank}
              </span>
            </div>
            <p className="mt-2 text-text/60">{user.email}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-light px-4 py-2 text-sm font-semibold text-heading shadow-sm">
                <Calendar size={16} className="text-primary" />
                <span>Joined {user.membershipDuration || 'recently'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-light px-4 py-2 text-sm font-semibold text-heading shadow-sm">
                <TrendingUp size={16} className="text-primary" />
                <span>Level 4 Eco Hero</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-text/60">{stat.label}</p>
            <p className="text-2xl font-bold text-heading">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Impact Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-1 flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-heading">Impact Over Time</h3>
            <select className="rounded-lg border bg-light px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactData}>
                <defs>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--color-text))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--color-surface))',
                    border: '1px solid rgb(var(--color-border))',
                    borderRadius: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(var(--color-primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorImpact)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-heading">Featured Badges</h3>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {(user.badges && user.badges.length > 0 ? user.badges : [
              { name: 'Eco Pioneer', icon: Leaf, category: 'General', color: 'text-green-500' },
              { name: 'Water Saver', icon: Droplets, category: 'Resources', color: 'text-blue-500' },
              { name: 'Elite Member', icon: Star, category: 'Community', color: 'text-amber-500' }
            ]).slice(0, 3).map((badge, i) => (
              <div key={i} className="group flex items-center gap-4 rounded-xl border border-transparent p-2 transition-all hover:bg-light hover:border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light shadow-inner group-hover:scale-110 transition-transform">
                  {typeof badge.icon === 'string' ? (
                    <span className="text-2xl">{badge.icon}</span>
                  ) : (
                    <badge.icon size={20} className={badge.color || 'text-primary'} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-heading text-sm">{badge.name}</p>
                  <p className="text-xs text-text/60">{badge.category}</p>
                </div>
                <ChevronRight size={16} className="text-text/30" />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-light p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text/40">
              <Clock size={12} />
              Recent Achievement
            </div>
            <p className="mt-2 text-sm font-medium text-heading">Completed "No Plastic Week"</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full w-[85%] bg-primary rounded-full" />
            </div>
            <p className="mt-2 text-[10px] text-text/50">85% to Next Milestone</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
