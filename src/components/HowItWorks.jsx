import { Card, CardContent } from './ui/Card.jsx'
import { FiTarget, FiTrendingUp, FiMessageCircle } from 'react-icons/fi'
import SectionHeading from './SectionHeading.jsx'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

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
      <SectionHeading
        badge="Process"
        title="How It Works"
        subtitle="Getting started with EcoTrack is simple. Follow these three easy steps to begin your sustainable living journey."
        centered={true}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {steps.map((step) => {
          const IconComponent = step.icon
          return (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="h-full border-border/50 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-heading">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text/80 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}