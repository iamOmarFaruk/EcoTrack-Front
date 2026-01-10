import { Play, FileText, CheckCircle, XCircle } from 'lucide-react'

/**
 * Status configuration for consistent badge styling across admin pages
 */
export const statusConfig = {
  active: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: Play,
    label: 'Active'
  },
  draft: {
    badge: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    icon: FileText,
    label: 'Draft'
  },
  completed: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: CheckCircle,
    label: 'Completed'
  },
  cancelled: {
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    icon: XCircle,
    label: 'Cancelled'
  },
  published: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: CheckCircle,
    label: 'Published'
  }
}

/**
 * Reusable status badge component with consistent styling
 * @param {string} status - Status key (active, draft, completed, cancelled, published)
 * @param {boolean} showIcon - Whether to show the icon (default: true)
 */
export default function StatusBadge({ status, showIcon = true }) {
  const config = statusConfig[status] || statusConfig.draft
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.badge}`}>
      {showIcon && <Icon size={12} />}
      <span>{config.label}</span>
    </span>
  )
}
