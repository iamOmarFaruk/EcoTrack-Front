import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectFade,
  EffectCreative,
  EffectCards,
} from 'swiper/modules'

// Swiper core styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-creative'
import 'swiper/css/effect-cards'

export default function Hero({ slides = [], effect = 'coverflow' }) {
  return (
    <section className="hero-swiper relative isolate overflow-hidden">
      <Swiper
        modules={[
          Autoplay,
          Navigation,
          Pagination,
          EffectCube,
          EffectCoverflow,
          EffectFlip,
          EffectFade,
          EffectCreative,
          EffectCards,
        ]}
        effect={effect}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 40,
          shadowScale: 0.9,
        }}
        coverflowEffect={{
          rotate: 32,
          stretch: 0,
          depth: 240,
          modifier: 1,
          slideShadows: true,
        }}
        flipEffect={{
          slideShadows: true,
          limitRotation: true,
        }}
        fadeEffect={{
          crossFade: true,
        }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            rotate: [0, 0, -6],
          },
          next: {
            translate: ['20%', 0, -1],
            rotate: [0, 0, 6],
          },
        }}
        cardsEffect={{
          perSlideOffset: 8,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true,
        }}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        speed={900}
        loop
        navigation
        pagination={{ clickable: true }}
        grabCursor
        className="h-[52vh] min-h-[360px] w-full sm:h-[56vh] md:h-[72vh] md:min-h-[480px] lg:h-[78vh]"
      >
        {slides.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="relative h-full w-full">
              {/* Background image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              {/* Dark overlay + vignette + color wash for readability */}
              <div className="absolute inset-0 bg-dark/35 md:bg-dark/45" />
              <div className="absolute inset-0 bg-gradient-to-tr from-dark/70 via-dark/30 to-dark/0" />
              <div className="pointer-events-none absolute inset-0 mix-blend-screen">
                <div className="absolute -left-1/3 top-0 h-[120%] w-[60%] rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -right-1/3 bottom-0 h-[120%] w-[60%] rounded-full bg-secondary/20 blur-3xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6 md:px-8">
                <div className="max-w-2xl">
                  <div className="mb-3 hidden items-center gap-2 rounded-full bg-surface/10 px-3 py-1 text-xs font-semibold text-surface/90 ring-1 ring-surface/20 backdrop-blur-md md:inline-flex">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    <span>
                      {(() => {
                        const parsedDays = Number.parseInt(item.duration)
                        const daysLeftText = Number.isFinite(parsedDays)
                          ? `${parsedDays} ${parsedDays === 1 ? 'Day' : 'Days'}`
                          : (item.duration || 'Few days')
                        const count = typeof item.participants === 'number' ? item.participants : 0
                        const peopleLabel = count === 1 ? 'person' : 'people'
                        return `Only ${daysLeftText} left, ${count.toLocaleString()} ${peopleLabel} already joined`
                      })()}
                    </span>
                  </div>
                  <h1 className="text-balance text-3xl font-extrabold tracking-tight text-surface drop-shadow md:text-5xl">
                    {item.title}
                  </h1>
                  {item.description ? (
                    <p className="mt-3 max-w-prose text-pretty text-surface/90 md:text-lg">
                      {item.description}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button as={Link} to={`/challenges/${item.slug || item._id}`}>
                      View Challenge
                    </Button>
                    <Button as={Link} to="/challenges" variant="secondary">
                      Browse All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}


