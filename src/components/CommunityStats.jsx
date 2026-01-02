import { useEffect, useRef, useState } from 'react'
import { Leaf, Recycle, Droplets, Zap } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { Card, CardContent } from './ui/Card.jsx'
import LazySection from './LazySection.jsx'
import { CommunityStatsCardSkeleton } from './Skeleton.jsx'
import { challengeApi } from '../services/api.js'

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
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Use a small sentinel placed just above the grid so animation starts
  // when the user actually reaches this section (not on initial page load).
  const [triggerRef, inView] = useInViewOnce({ rootMargin: '0px 0px -25% 0px', threshold: 0 })

  // Fetch live community impact summary from API
  useEffect(() => {
    let isMounted = true

    async function fetchCommunityImpact() {
      try {
        setLoading(true)
        setError(null)

        const response = await challengeApi.getCommunityImpactSummary()

        // Normalize different possible response shapes
        const root = response?.data || {}
        const payload = root.data || root

        const {
          co2SavedKg = 0,
          plasticReducedKg = 0,
          waterSavedL = 0,
          energySavedKwh = 0
        } = payload || {}

        const mappedStats = [
          {
            key: 'co2SavedKg',
            label: 'CO₂ avoided',
            value: co2SavedKg,
            unit: 'kg',
            icon: Leaf,
            accent: 'bg-primary/10 text-primary'
          },
          {
            key: 'plasticReducedKg',
            label: 'Plastic reduced',
            value: plasticReducedKg,
            unit: 'kg',
            icon: Recycle,
            accent: 'bg-secondary/10 text-secondary'
          },
          {
            key: 'waterSavedL',
            label: 'Water saved',
            value: waterSavedL,
            unit: 'L',
            icon: Droplets,
            accent: 'bg-secondary/10 text-secondary'
          },
          {
            key: 'energySavedKwh',
            label: 'Energy saved',
            value: energySavedKwh,
            unit: 'kWh',
            icon: Zap,
            accent: 'bg-secondary/10 text-secondary'
          }
        ]

        if (isMounted) {
          setStats(mappedStats)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load community impact stats:', err)
          setError('Unable to load live stats right now.')
          setStats([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCommunityImpact()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <SectionHeading
        title="Live Community Impact"
        subtitle="Community-wide impact at a glance"
      />
      {/* Invisible sentinel that enters view right before the grid */}
      <span ref={triggerRef} aria-hidden="true" className="block h-px w-px opacity-0" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {!loading && error && (
          <div className="sm:col-span-2 lg:col-span-4 text-sm text-secondary bg-secondary/10 border border-secondary/40 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <LazySection
              key={i}
              fallback={<CommunityStatsCardSkeleton />}
              minimumLoadingTime={2000}
            >
              <div style={{ display: 'none' }}>Hidden while loading</div>
            </LazySection>
          ))}

        {!loading && !error &&
          stats?.map((item) => (
            <LazySection
              key={item.key}
              fallback={<CommunityStatsCardSkeleton />}
              minimumLoadingTime={2000}
              intersectionOptions={{
                threshold: 0.1,
                rootMargin: '50px'
              }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-primary/30 ${item.accent || 'bg-primary/10 text-primary'}`}>
                    {item.icon && (
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text/70">{item.label}</p>
                    <p className="truncate text-xl font-heading font-extrabold tracking-tight text-heading">
                      <AnimatedNumber value={item.value} isActive={inView} />{' '}
                      <span className="text-xs font-semibold text-text/70 align-middle">{item.unit}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </LazySection>
          ))}
      </div>
    </section>
  )
}


