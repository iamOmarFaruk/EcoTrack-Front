import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCreative,
} from 'swiper/modules'

// Swiper core styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-creative'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

export default function Hero({ slides = [], effect = 'creative' }) {
  return (
    <section className="hero-swiper relative isolate overflow-hidden">
      <Swiper
        modules={[
          Autoplay,
          Navigation,
          Pagination,
          EffectFade,
          EffectCreative,
        ]}
        effect={effect}
        fadeEffect={{
          crossFade: true,
        }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            rotate: [0, 0, -6],
            opacity: 0,
          },
          next: {
            translate: ['100%', 0, 0],
            opacity: 0,
          },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        loop
        navigation
        pagination={{ clickable: true }}
        grabCursor
        className="h-[52vh] min-h-[360px] w-full sm:h-[56vh] md:h-[72vh] md:min-h-[480px] lg:h-[82vh]"
      >
        {slides.map((item) => (
          <SwiperSlide key={item._id}>
            {({ isActive }) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                  <motion.img
                    initial={{ scale: 1.3 }}
                    animate={{ scale: isActive ? 1 : 1.3 }}
                    transition={{
                      duration: 6.5,
                      ease: "linear"
                    }}
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-dark/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

                {/* Decorative glows */}
                <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50">
                  <div className="absolute -left-1/4 top-0 h-full w-1/2 rounded-full bg-primary/10 blur-[120px]" />
                  <div className="absolute -right-1/4 bottom-0 h-full w-1/2 rounded-full bg-secondary/10 blur-[120px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-12">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isActive ? 'visible' : 'hidden'}
                    className="w-full"
                  >
                    {/* Badge */}
                    <motion.div
                      variants={itemVariants}
                      className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-md"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                      </span>
                      <span>
                        {(() => {
                          const parsedDays = Number.parseInt(item.duration)
                          const daysLeftText = Number.isFinite(parsedDays)
                            ? `${parsedDays} ${parsedDays === 1 ? 'Day' : 'Days'}`
                            : (item.duration || 'Few days')
                          const count = typeof item.participants === 'number' ? item.participants : 0
                          return `Only ${daysLeftText} left • ${count.toLocaleString()} joined`
                        })()}
                      </span>
                    </motion.div>

                    {/* Heading - Balanced size, 1 line on desktop */}
                    <motion.h1
                      variants={itemVariants}
                      className="mb-4 max-w-none md:whitespace-nowrap text-3xl font-black tracking-tighter text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                      {item.title}
                    </motion.h1>

                    {/* Description */}
                    {item.description && (
                      <motion.p
                        variants={itemVariants}
                        className="mb-8 max-w-2xl text-pretty text-lg text-white/90 md:text-xl lg:text-2xl"
                      >
                        {item.description}
                      </motion.p>
                    )}

                    {/* Buttons */}
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <Button
                        as={Link}
                        to={`/challenges/${item.slug || item._id}`}
                        className="!px-8 !py-4 text-lg"
                      >
                        View Challenge
                      </Button>
                      <Button
                        as={Link}
                        to="/challenges"
                        variant="secondary"
                        className="bg-white/10 !px-8 !py-4 text-lg text-white hover:bg-white/20"
                      >
                        Browse All
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}



