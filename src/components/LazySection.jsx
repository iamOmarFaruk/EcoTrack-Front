import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'

/**
 * LazySection component that loads content when in viewport with minimum loading time
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show when loaded
 * @param {React.ReactNode} props.fallback - Loading skeleton to show
 * @param {number} props.minimumLoadingTime - Minimum time to show skeleton (default: 2000ms)
 * @param {Object} props.intersectionOptions - Options for intersection observer
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 */
export default function LazySection({
  children,
  fallback,
  minimumLoadingTime = 2000, // 2 seconds as requested
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
  
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const isMinimumLoadingTime = useMinimumLoading(minimumLoadingTime)
  
  // Start "data loading" when element comes into viewport
  useEffect(() => {
    if (isIntersecting && !isDataLoaded) {
      // Simulate data loading - in real app, this would be actual data fetching
      const timer = setTimeout(() => {
        setIsDataLoaded(true)
      }, 0) // Immediate for static content, but minimum time still applies
      
      return () => clearTimeout(timer)
    }
  }, [isIntersecting, isDataLoaded])
  
  // Show content only when both conditions are met:
  // 1. Element is in viewport and data is loaded
  // 2. Minimum loading time has passed (isMinimumLoadingTime will be false after the minimum time)
  const shouldShowContent = isIntersecting && isDataLoaded && !isMinimumLoadingTime
  
  return (
    <div
      ref={setTarget}
      className={className}
      style={style}
      {...props}
    >
      {shouldShowContent ? children : fallback}
    </div>
  )
}