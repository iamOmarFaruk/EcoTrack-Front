import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 shadow-lg touch-manipulation'

const sizes = {
  sm: 'px-2 py-1.5 text-xs min-h-[36px]',
  md: 'px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]',
  lg: 'px-4 py-3 sm:px-6 sm:py-3 text-base min-h-[50px]',
}

const variants = {
  primary:
    'bg-primary text-surface ring-1 ring-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  secondary:
    'bg-secondary text-surface ring-1 ring-secondary/20 hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  outline:
    'bg-surface text-text border border-border hover:bg-light hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  destructive:
    'bg-danger text-surface ring-1 ring-danger/20 hover:bg-danger/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  ghost:
    'text-primary hover:bg-primary/10',
}

export default function Button({ as: Comp = 'button', variant = 'primary', size = 'md', className, ...props }) {
  return <Comp className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}

