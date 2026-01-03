import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import CommunityStats from '../components/CommunityStats.jsx'
import CTA from '../components/CTA.jsx'
import { defaultImages } from '../config/env.js'

export default function About() {
  useDocumentTitle('About')

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="About EcoTrack"
          subtitle="EcoTrack helps people build sustainable habits through challenges, tips, and events. We care about clean design, great UX, and meaningful impact."
          backgroundImage={defaultImages.aboutHero}
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Main Content with Images */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center px-4">
        {/* Left Image */}
        <div className="order-1">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&h=400&auto=format&fit=crop"
            alt="Community volunteers planting trees"
            className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="order-2 space-y-4">
          <SectionHeading
            badge="Sustainability"
            title="Building a Sustainable Future Together"
            centered={false}
          />
          <div className="space-y-3 sm:space-y-4 text-text/80">
            <p className="text-base sm:text-lg leading-relaxed">
              At EcoTrack, we believe that small actions can create big changes. Our platform
              brings together a community of eco-conscious individuals who are passionate
              about making a positive impact on the environment.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              Through engaging challenges, practical tips, and community events, we make
              it easy and fun to adopt sustainable habits that last a lifetime.
            </p>
          </div>

          {/* Events Button */}
          <div className="pt-2 sm:pt-4">
            <Button as={Link} to="/events" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-center">
              Explore Events
            </Button>
          </div>
        </div>
      </section>

      {/* Second Section - Community with Background */}
      <section className="full-bleed bg-primary/5 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content - First on desktop, second on mobile */}
          <div className="order-2 lg:order-1 space-y-4">
            <SectionHeading
              badge="Community"
              title="Join Our Growing Community"
              centered={false}
            />
            <div className="space-y-3 sm:space-y-4 text-text/80">
              <p className="text-base sm:text-lg leading-relaxed">
                Whether you're just starting your sustainability journey or you're a
                seasoned environmental advocate, EcoTrack provides the tools and
                community support you need to make a real difference.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Track your progress, connect with like-minded individuals, and celebrate
                your achievements as you work towards a more sustainable lifestyle.
              </p>
            </div>

            {/* Call to Action */}
            <div className="pt-2 sm:pt-4">
              <Button as={Link} to="/challenges" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-center">
                Check Challenges
              </Button>
            </div>
          </div>

          {/* Right Image - First on mobile, second on desktop */}
          <div className="order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop"
              alt="Eco-friendly community gathering"
              className="w-full h-64 sm:h-72 lg:h-[28rem] object-cover rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Live Impact Section */}
      <div className="full-bleed">
        <CommunityStats />
      </div>

      {/* CTA Section */}
      <div className="full-bleed !mt-0">
        <CTA />
      </div>
    </div>
  )
}




