import { useCallback, useRef } from 'react'

/**
 * Custom hook for debouncing function calls
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} Debounced function
 */
export function useDebounce(callback, delay = 300) {
  const timeoutRef = useRef(null)

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
}

export default useDebounce
