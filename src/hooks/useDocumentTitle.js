import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} | EcoTrack` : 'EcoTrack - Track Your Environmental Impact'
    
    return () => {
      document.title = prevTitle
    }
  }, [title])
}

