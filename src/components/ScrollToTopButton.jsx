import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      setScrollProgress(progress)
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // SVG circle parameters
  const size = 52
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  // Calculate particle positions
  const getParticlePosition = (index) => {
    const angle = index * 60 * Math.PI / 180
    return {
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 30
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 cursor-pointer group"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0,
            opacity: 0,
            y: 20,
            transition: { duration: 0.2, ease: 'easeIn' }
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.3
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Main button container */}
          <div className="relative w-[52px] h-[52px]">
            {/* SVG Progress Circle */}
            <svg
              className="absolute inset-0 -rotate-90 transform"
              width={size}
              height={size}
            >
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className="stroke-border/30"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className="stroke-primary"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </svg>

            {/* Inner button */}
            <div className="absolute inset-[4px] rounded-full bg-surface shadow-lg border border-border/50 flex items-center justify-center overflow-hidden">
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />

              {/* Arrow icon with bounce animation */}
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <ArrowUp className="w-5 h-5 text-primary relative z-10" />
              </motion.div>
            </div>

            {/* Completion celebration effect */}
            <AnimatePresence>
              {scrollProgress >= 99 && (
                <>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const pos = getParticlePosition(i)
                    return (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                        initial={{
                          x: '-50%',
                          y: '-50%',
                          scale: 0,
                          opacity: 1
                        }}
                        animate={{
                          x: pos.x - 3,
                          y: pos.y - 3,
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05,
                          ease: 'easeOut'
                        }}
                      />
                    )
                  })}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Tooltip */}
          <motion.span
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium bg-surface text-text rounded-md shadow-lg border border-border/50 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
          >
            Back to top
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
