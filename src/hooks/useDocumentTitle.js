import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} | EcoTrack — Sustainable Living Community` : 'EcoTrack — Sustainable Living Community'
    
    return () => {
      document.title = prevTitle
    }
  }, [title])
}

