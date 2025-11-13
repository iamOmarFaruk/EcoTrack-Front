import clsx from 'clsx'
import { defaultImages } from '../config/env'

export default function SubpageHero({
  title,
  subtitle,
  backgroundImage = defaultImages.hero,
  overlayIntensity = 'medium',
  height = 'medium',
  children,
  className,
  ...props
}) {
  const overlayClasses = {
    light: 'bg-black/30',
    medium: 'bg-black/50',
    dark: 'bg-black/70'
  }

  const heightClasses = {
    small: 'h-48 sm:h-56',
    medium: 'h-64 sm:h-72 md:h-80',
    large: 'h-80 sm:h-96 md:h-[28rem]'
  }

  return (
    <section 
      className={clsx(
        'relative flex items-center overflow-hidden',
        heightClasses[height],
        className
      )}
      {...props}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Overlay */}
      <div className={clsx('absolute inset-0', overlayClasses[overlayIntensity])} />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container px-6 md:px-8">
          <div className="max-w-2xl">
            {title && (
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                {title}
              </h1>
            )}
            
            {subtitle && (
              <p className="mt-3 text-lg text-white/90 sm:text-xl md:text-2xl">
                {subtitle}
              </p>
            )}
            
            {children && (
              <div className="mt-6">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional decorative elements */}
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-20">
        <div className="absolute -left-1/4 top-0 h-full w-1/2 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-full w-1/2 rounded-full bg-teal-400/30 blur-3xl" />
      </div>
    </section>
  )
}