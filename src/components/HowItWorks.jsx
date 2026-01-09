import { Card, CardContent } from './ui/Card.jsx'
import {
  FiTarget,
  FiTrendingUp,
  FiMessageCircle,
  FiUsers,
  FiZap,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiCompass,
  FiSmile
} from 'react-icons/fi'
import SectionHeading from './SectionHeading.jsx'
import { useSiteContent } from '../hooks/queries'

const defaultSteps = [
  {
    id: 1,
    icon: 'target',
    title: 'Join a Challenge',
    description: 'Browse through our diverse collection of eco-friendly challenges and pick ones that match your lifestyle and goals.'
  },
  {
    id: 2,
    icon: 'trending-up',
    title: 'Track Progress',
    description: 'Monitor your daily activities, log your achievements, and watch your environmental impact grow with detailed analytics.'
  },
  {
    id: 3,
    icon: 'chat',
    title: 'Share Tips',
    description: 'Connect with our community by sharing your experiences, tips, and inspiring others on their sustainability journey.'
  }
]

const iconMap = {
  target: FiTarget,
  'trending-up': FiTrendingUp,
  chat: FiMessageCircle,
  message: FiMessageCircle,
  users: FiUsers,
  zap: FiZap,
  map: FiMapPin,
  calendar: FiCalendar,
  award: FiAward,
  compass: FiCompass,
  smile: FiSmile
}

export default function HowItWorks() {
  const { data } = useSiteContent()
  const steps = data?.howItWorks?.length ? data.howItWorks : defaultSteps

  return (
    <section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <SectionHeading
            badge="Process"
            title="How It Works"
            subtitle="Getting started with EcoTrack is simple. Follow these three easy steps to begin your sustainable living journey."
            centered={true}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const IconComponent = typeof step.icon === 'function' ? step.icon : (iconMap[step.icon] || FiTarget)
              return (
                <div key={step.id || step.title} className="h-full">
                  <Card className="h-full border-border shadow-sm bg-surface/70 backdrop-blur-sm">
                    <CardContent className="p-8 text-center space-y-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>

                      <h3 className="text-xl font-heading font-bold text-heading">
                        {step.title}
                      </h3>

                      <p className="text-text/80 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
