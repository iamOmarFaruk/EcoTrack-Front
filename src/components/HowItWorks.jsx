import { Card, CardContent } from './ui/Card.jsx'
import { FiTarget, FiTrendingUp, FiMessageCircle } from 'react-icons/fi'

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: FiTarget,
      title: 'Join a Challenge',
      description: 'Browse through our diverse collection of eco-friendly challenges and pick ones that match your lifestyle and goals.'
    },
    {
      id: 2,
      icon: FiTrendingUp,
      title: 'Track Progress',
      description: 'Monitor your daily activities, log your achievements, and watch your environmental impact grow with detailed analytics.'
    },
    {
      id: 3,
      icon: FiMessageCircle,
      title: 'Share Tips',
      description: 'Connect with our community by sharing your experiences, tips, and inspiring others on their sustainability journey.'
    }
  ]

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading">
          How It Works
        </h2>
        <p className="text-base sm:text-lg text-text/80 max-w-2xl mx-auto">
          Getting started with EcoTrack is simple. Follow these three easy steps to begin your sustainable living journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => {
          const IconComponent = step.icon
          return (
            <Card key={step.id} className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-heading">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text/80 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}