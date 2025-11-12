import { useEffect, useState } from 'react'

/**
 * Custom hook that ensures a minimum loading time is shown, even for static content
 * @param {number} minimumMs - Minimum time to show loading (default: 300ms)
 * @returns {boolean} - Whether the component should show loading state
 */
export function useMinimumLoading(minimumMs = 300) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, minimumMs)

    return () => clearTimeout(timer)
  }, [minimumMs])

  return isLoading
}