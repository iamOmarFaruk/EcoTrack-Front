import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import { Link } from 'react-router-dom'
import EcoLoader from '../components/EcoLoader.jsx'
import Button from '../components/ui/Button.jsx'

export default function About() {
  useDocumentTitle('About')
  const isLoading = useMinimumLoading(300)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-12 sm:space-y-16 pb-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 sm:space-y-6 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-heading mb-2 sm:mb-4">
          About EcoTrack
        </h1>
        <p className="text-lg sm:text-xl text-text/80 max-w-3xl mx-auto leading-relaxed">
          EcoTrack helps people build sustainable habits through challenges, tips, and events.
          We care about clean design, great UX, and meaningful impact.
        </p>
      </section>

      {/* Main Content with Images */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center px-4">
        {/* Left Image */}
        <div className="order-1">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center"
            alt="People planting trees together"
            className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
        
        {/* Content */}
        <div className="order-2 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-heading">
            Building a Sustainable Future Together
          </h2>
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
            <Button as={Link} to="/events" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
              Explore Events
            </Button>
          </div>
        </div>
      </section>

      {/* Second Section - Reversed Layout */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center px-4">
        {/* Content - First on desktop, second on mobile */}
        <div className="order-2 lg:order-1 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-heading">
            Join Our Growing Community
          </h2>
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
            <Button as={Link} to="/challenges" variant="primary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
              Check Challenges
            </Button>
          </div>
        </div>
        
        {/* Right Image - First on mobile, second on desktop */}
        <div className="order-1 lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
            alt="Sustainable living items and plants"
            className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mx-4">
        <div className="text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-heading">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm sm:text-base text-text/80">Active Members</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">500+</div>
              <div className="text-sm sm:text-base text-text/80">Challenges Completed</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">50+</div>
              <div className="text-sm sm:text-base text-text/80">Community Events</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


