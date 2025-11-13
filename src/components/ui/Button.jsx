import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 shadow-lg touch-manipulation'

const sizes = {
  sm: 'px-2 py-1.5 text-xs min-h-[36px]',
  md: 'px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]',
  lg: 'px-4 py-3 sm:px-6 sm:py-3 text-base min-h-[50px]',
}

const variants = {
  primary:
    // Gradient light green + 3D hover/active feel
    'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white ring-1 ring-emerald-500/20 hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  secondary:
    // Subtle light surface with similar 3D behavior
    'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border border-slate-200 hover:to-slate-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  outline:
    // Outline style for secondary actions
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  ghost:
    'text-emerald-700 hover:bg-emerald-50',
}

export default function Button({ as: Comp = 'button', variant = 'primary', size = 'md', className, ...props }) {
  return <Comp className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}


