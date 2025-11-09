import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import { Card, CardContent } from './ui/Card.jsx'
import Skeleton from './Skeleton.jsx'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { mockCommunityStatsList } from '../data/mockStats.js'

function formatValue(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
  return value.toLocaleString()
}

// Simple easing for a smoother finish
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// Observe element once and flip true when it first enters the viewport
function useInViewOnce(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current || inView) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      options || { threshold: 0.25 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView, options])

  return [ref, inView]
}

// Animated number that counts from 0 to target when isActive becomes true
function AnimatedNumber({ value, isActive, durationMs = 1600 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const rafRef = useRef(null)
  const startTsRef = useRef(null)

  useEffect(() => {
    if (!isActive) return
    // Cancel any previous animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    startTsRef.current = null

    const endValue = Number.isFinite(value) ? value : 0
    const duration = Math.max(300, durationMs)

    const tick = (ts) => {
      if (!startTsRef.current) startTsRef.current = ts
      const elapsed = ts - startTsRef.current
      const progress = Math.min(1, elapsed / duration)
      const eased = easeOutCubic(progress)
      const current = Math.round(eased * endValue)
      setDisplayValue(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // Only start when flag flips true or value changes
  }, [isActive, value, durationMs])

  return <>{formatValue(displayValue)}</>
}

export default function CommunityStats() {
  const { data: stats, loading } = useMockFetch(() => mockCommunityStatsList, 450)
  // Use a small sentinel placed just above the grid so animation starts
  // when the user actually reaches this section (not on initial page load).
  const [triggerRef, inView] = useInViewOnce({ rootMargin: '0px 0px -25% 0px', threshold: 0 })

  return (
    <section>
      <SectionHeading
        title="Live Community Impact"
        subtitle="Community-wide impact at a glance"
      />
      {/* Invisible sentinel that enters view right before the grid */}
      <span ref={triggerRef} aria-hidden="true" className="block h-px w-px opacity-0" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}

        {!loading &&
          stats?.map((item) => (
            <Card key={item.key} className="h-full">
              <CardContent className="flex h-full items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="truncate text-xl font-extrabold tracking-tight text-slate-900">
                    <AnimatedNumber value={item.value} isActive={inView} />{' '}
                    <span className="text-xs font-semibold text-slate-500 align-middle">{item.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  )
}


