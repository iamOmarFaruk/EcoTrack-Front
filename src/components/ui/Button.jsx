import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center gap-2 text-sm font-heading font-semibold transition-all duration-300 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 touch-manipulation relative overflow-hidden'

const sizes = {
  sm: 'px-2 py-1.5 text-xs min-h-[36px]',
  md: 'px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]',
  lg: 'px-4 py-3 sm:px-6 sm:py-3 text-base min-h-[50px]',
}

const variants = {
  // Original styles (kept for backward compatibility)
  primary:
    'bg-primary text-surface border-2 border-primary rounded-xl shadow-lg hover:bg-primary-darker hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  secondary:
    'bg-secondary text-surface ring-1 ring-secondary/20 rounded-xl shadow-lg hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  outline:
    'bg-surface text-text border-2 border-primary rounded-xl shadow-md hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm',
  destructive:
    'bg-danger text-surface ring-1 ring-danger/20 rounded-xl shadow-lg hover:bg-danger/90 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md',
  ghost:
    'text-primary rounded-xl hover:bg-primary/10',
  
  // NEW ECO-THEMED VARIANTS
  
  // Organic/Leaf style - More rounded, nature-inspired
  organic:
    'bg-gradient-to-br from-primary via-primary to-secondary text-surface rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-100 transition-transform duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:via-primary/20 before:to-secondary/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
  
  // Gradient eco style - Vibrant eco gradient
  gradient:
    'bg-gradient-to-r from-primary via-emerald-500 to-secondary text-surface rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all duration-300 ring-1 ring-primary/30',
  
  // Minimal clean style - Subtle and modern
  minimal:
    'bg-primary/10 text-primary border-2 border-primary/30 rounded-lg hover:bg-primary/20 hover:border-primary/50 hover:shadow-md active:shadow-sm transition-all duration-200',
  
  // Animated fill style - Outline that fills on hover
  fill:
    'bg-transparent text-primary border-2 border-primary rounded-xl relative overflow-hidden group hover:text-surface transition-colors duration-300 before:absolute before:inset-0 before:bg-primary before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-300 before:z-[-1] z-0',
  
  // Soft eco style - Gentle shadows, natural feel
  soft:
    'bg-primary/90 text-surface rounded-2xl shadow-sm hover:bg-primary hover:shadow-lg active:shadow-md transition-all duration-200 backdrop-blur-sm',
  
  // Icon button style - Perfect for icon-only buttons
  icon:
    'rounded-full p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-surface hover:scale-110 active:scale-100 transition-all duration-200 shadow-sm hover:shadow-md',
  
  // Outline with animated underline
  underline:
    'bg-transparent text-primary border-0 rounded-lg hover:bg-primary/5 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all after:duration-300',
  
  // Eco glow style - Subtle glow effect
  glow:
    'bg-primary text-surface rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-100 transition-all duration-300 ring-1 ring-primary/20',
}

export default function Button({ 
  as: Comp = 'button', 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) {
  return <Comp className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}

