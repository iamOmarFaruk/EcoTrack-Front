import clsx from 'clsx'
import { defaultImages } from '../config/env'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

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
    light: 'bg-dark/30',
    medium: 'bg-dark/50',
    dark: 'bg-dark/70'
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
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container px-6 md:px-8">
          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {title && (
              <motion.h1
                className="text-3xl font-heading font-bold tracking-tight text-surface sm:text-4xl md:text-5xl"
                variants={itemVariants}
              >
                {title}
              </motion.h1>
            )}

            {subtitle && (
              <motion.p
                className="mt-3 text-lg text-surface/90 sm:text-xl md:text-2xl"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            )}

            {children && (
              <motion.div
                className="mt-6"
                variants={itemVariants}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Optional decorative elements */}
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-20">
        <div className="absolute -left-1/4 top-0 h-full w-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-full w-1/2 rounded-full bg-secondary/30 blur-3xl" />
      </div>
    </section>
  )
}