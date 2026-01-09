import { motion } from 'framer-motion'

/**
 * Reusable empty state component for admin pages
 * @param {Component} icon - Lucide icon component
 * @param {string} title - Main heading text
 * @param {string} message - Description text
 * @param {ReactNode} action - Optional action button or element
 */
export default function EmptyState({
  icon: Icon,
  title,
  message,
  action
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border bg-surface/30"
    >
      <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center text-text/20 mb-4">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-heading font-bold text-heading mb-2">
        {title}
      </h3>
      <p className="text-text/60 text-center max-w-md mb-6">
        {message}
      </p>
      {action && action}
    </motion.div>
  )
}
