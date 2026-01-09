import { useMemo } from 'react'

/**
 * Custom hook to calculate content statistics by status
 * @param {Array} items - Array of items with status field
 * @param {string} statusField - Name of the status field (default: 'status')
 * @returns {Object} Statistics object with counts by status
 */
export function useContentStats(items, statusField = 'status') {
  return useMemo(() => {
    const stats = {
      total: items.length,
      active: 0,
      draft: 0,
      completed: 0,
      cancelled: 0,
      published: 0
    }

    items.forEach(item => {
      const status = item[statusField]
      if (status && stats.hasOwnProperty(status)) {
        stats[status]++
      }
    })

    return stats
  }, [items, statusField])
}

export default useContentStats
