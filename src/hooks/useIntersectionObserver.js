import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for intersection observer API
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early/late triggering
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {Array} [setTarget, isIntersecting, entry]
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const targetRef = useRef(null)
  const observerRef = useRef(null)

  const setTarget = (element) => {
    if (targetRef.current && observerRef.current) {
      observerRef.current.unobserve(targetRef.current)
    }
    targetRef.current = element
    
    if (element && observerRef.current) {
      observerRef.current.observe(element)
    }
  }

  useEffect(() => {
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsIntersecting(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setEntry(entry)
        
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          
          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce && observerRef.current && entry.target) {
            observerRef.current.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    // Observe the current target if it exists
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return [setTarget, isIntersecting, entry]
}