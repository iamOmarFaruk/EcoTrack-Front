import { useEffect, useState } from 'react'
import { fakeDelay } from '../utils/fakeDelay.js'

export function useMockFetch(factory, delayMs = 700) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function run() {
      try {
        setLoading(true)
        await fakeDelay(delayMs)
        const result = typeof factory === 'function' ? factory() : factory
        if (active) setData(result)
      } catch (e) {
        if (active) setError(e)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [factory, delayMs])

  return { data, loading, error }
}


