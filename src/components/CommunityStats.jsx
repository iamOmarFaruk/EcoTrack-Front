import { useEffect, useRef, useState } from 'react'
import { Leaf, Recycle, Droplets, Zap } from 'lucide-react'
import { animate, useInView } from 'framer-motion'
import SectionHeading from './SectionHeading.jsx'
import ImpactCard from './ui/ImpactCard.jsx'
import LazySection from './LazySection.jsx'
import { CommunityStatsCardSkeleton } from './Skeleton.jsx'
import { challengeApi } from '../services/api.js'
import { motion } from 'framer-motion'
import { stackedContainer, stackedItem } from '../utils/animations'

// Animated number using Framer Motion
function AnimatedNumber({ value, isActive, durationMs = 1600 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const node = ref.current
    const endValue = Number.isFinite(value) ? value : 0

    const controls = animate(0, endValue, {
      duration: durationMs / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (node) {
          node.textContent = Math.round(latest).toLocaleString()
        }
      }
    })

    return () => controls.stop()
  }, [isActive, value, durationMs])

  return <span ref={ref}>0</span>
}

export default function CommunityStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Use Framer Motion to detect when the section is in view
  const triggerRef = useRef(null)
  const inView = useInView(triggerRef, { once: true, margin: '0px 0px -25% 0px' })

  // Fetch live community impact summary from API
  useEffect(() => {
    let isMounted = true

    async function fetchCommunityImpact() {
      try {
        setLoading(true)
        setError(null)

        const response = await challengeApi.getCommunityImpactSummary()
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
            icon: Leaf
          },
          {
            key: 'plasticReducedKg',
            label: 'Plastic reduced',
            value: plasticReducedKg,
            unit: 'kg',
            icon: Recycle
          },
          {
            key: 'waterSavedL',
            label: 'Water saved',
            value: waterSavedL,
            unit: 'L',
            icon: Droplets
          },
          {
            key: 'energySavedKwh',
            label: 'Energy saved',
            value: energySavedKwh,
            unit: 'kWh',
            icon: Zap
          }
        ]

        if (isMounted) {
          setStats(mappedStats)
        }
      } catch (err) {
        if (isMounted) {
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
    return () => { isMounted = false }
  }, [])

  return (
    <section className="bg-light/50">
      <div className="container mx-auto">
        <SectionHeading
          badge="Live Impact"
          title="Our Community's Contribution"
          subtitle="Real-time environmental impact tracking across all active challenges"
        />

        <span ref={triggerRef} aria-hidden="true" className="block h-px w-px opacity-0" />

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0"
          variants={stackedContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={stackedItem}>
                <CommunityStatsCardSkeleton />
              </motion.div>
            ))
          ) : error ? (
            <div className="sm:col-span-2 lg:col-span-4 text-sm text-secondary bg-secondary/10 border border-secondary/40 rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          ) : (
            stats?.map((item) => (
              <motion.div key={item.key} variants={stackedItem}>
                <ImpactCard
                  label={item.label}
                  unit={item.unit}
                  icon={item.icon}
                  accentColor={item.key === 'co2SavedKg' ? 'primary' : 'secondary'}
                >
                  <AnimatedNumber value={item.value} isActive={inView} />
                </ImpactCard>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  )
}
