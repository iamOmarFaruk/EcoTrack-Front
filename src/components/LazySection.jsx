import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'

/**
 * LazySection component that loads content when in viewport
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show when loaded
 * @param {React.ReactNode} props.fallback - Loading skeleton to show
 * @param {Object} props.intersectionOptions - Options for intersection observer
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 */
export default function LazySection({
  children,
  fallback,
  intersectionOptions = {},
  className = '',
  style = {},
  ...props
}) {
  const [setTarget, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before element is visible
    triggerOnce: true,
    ...intersectionOptions
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true)
    }
  }, [isIntersecting])

  return (
    <div
      ref={setTarget}
      className={className}
      style={style}
      {...props}
    >
      {isVisible ? children : fallback}
    </div>
  )
}