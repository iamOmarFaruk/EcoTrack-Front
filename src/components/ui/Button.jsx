import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center gap-2 text-base font-heading font-semibold transition-all duration-300 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 touch-manipulation relative overflow-hidden rounded-[5px]'

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2 min-h-[42px]',
  lg: 'px-6 py-2.5 text-lg min-h-[48px]',
}

const variants = {
  // PREMIUM SIMPLE VARIANTS
  primary:
    'bg-primary text-surface shadow-[0_2px_0_0_rgba(4,120,84,1)] hover:shadow-[0_1px_0_0_rgba(4,120,84,1)] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none border-0',

  secondary:
    'bg-white text-primary border-2 border-primary/10 shadow-sm hover:border-primary/30 hover:bg-light hover:-translate-y-0.5 active:translate-y-0',

  glass:
    'bg-primary/10 text-primary backdrop-blur-md border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300',

  outline:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition-all duration-300',

  ghost:
    'text-primary hover:bg-primary/5 rounded-[5px]',

  // Keep original for back-compat but update radius
  organic:
    'bg-gradient-to-br from-primary to-secondary text-surface shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-300',

  gradient:
    'bg-gradient-to-r from-primary via-emerald-500 to-secondary text-surface shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all',

  minimal:
    'bg-bg-muted text-text border border-border hover:bg-white hover:border-primary/50 transition-all duration-200',

  fill:
    'bg-transparent text-primary border-2 border-primary relative overflow-hidden group hover:text-white transition-colors duration-300 before:absolute before:inset-0 before:bg-primary before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300 before:z-[-1] z-0',

  glow:
    'bg-primary text-surface shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] hover:scale-[1.02] active:scale-100 transition-all duration-300',

  icon:
    'p-2 bg-primary/10 text-primary hover:bg-primary hover:text-surface transition-all duration-200',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Comp
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        loading && "opacity-50 cursor-wait",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </Comp>
  )
}

