import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  secondary: 'bg-white text-slate-900 border hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100',
}

export default function Button({ as: Comp = 'button', variant = 'primary', className, ...props }) {
  return <Comp className={clsx(base, variants[variant], className)} {...props} />
}


