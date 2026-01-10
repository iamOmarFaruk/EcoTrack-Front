import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSuccess, showError } from '../utils/toast.jsx'
import Button from '../components/ui/Button.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SubpageHero from '../components/SubpageHero.jsx'
import { defaultImages } from '../config/env.js'
import SectionHeading from '../components/SectionHeading.jsx'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'
import { RiMailLine, RiMapPinLine, RiPhoneLine } from 'react-icons/ri'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const contactInfo = [
  {
    icon: <RiMailLine className="w-6 h-6" />,
    label: 'Email',
    value: 'hello@ecotrack.com',
    description: 'Our friendly team is here to help.',
    link: 'mailto:hello@ecotrack.com'
  },
  {
    icon: <RiMapPinLine className="w-6 h-6" />,
    label: 'Office',
    value: '123 Eco Way, Green City, 94103',
    description: 'Come say hi at our eco-friendly HQ.',
    link: '#'
  },
  {
    icon: <RiPhoneLine className="w-6 h-6" />,
    label: 'Phone',
    value: '+1 (555) 000-0000',
    description: 'Mon-Fri from 8am to 5pm.',
    link: 'tel:+15550000000'
  }
]

export default function Contact() {
  useDocumentTitle('Contact Us')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      showSuccess('Message sent! We will get back to you soon.')
      reset()
    } catch (error) {
      showError(error.message || 'Failed to send message. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Contact Us"
          subtitle="We’d love to hear from you. Have a question or feedback? Drop us a message!"
          backgroundImage={defaultImages.contactHero}
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Main Contact Section */}
      <section>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Get in Touch"
            title="Let's start a conversation"
            subtitle="Have questions about our mission or want to partner with us? Reach out and we'll get back to you shortly."
            centered={true}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 mt-16 items-start"
          >
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <a
                      href={info.link}
                      className="group flex items-start p-8 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {info.icon}
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-bold text-heading leading-tight">{info.label}</h3>
                        <p className="mt-1 text-primary font-semibold text-lg">{info.value}</p>
                        <p className="mt-1 text-base text-text/60">{info.description}</p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="bg-surface p-8 rounded-3xl border border-border shadow-xl shadow-black/5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading ml-1">Full Name</label>
                  <input
                    className={`w-full rounded-xl border ${errors.name ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40`}
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-xs text-danger font-medium ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading ml-1">Email Address</label>
                  <input
                    className={`w-full rounded-xl border ${errors.email ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40`}
                    placeholder="john@example.com"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-xs text-danger font-medium ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-heading ml-1">Message</label>
                  <textarea
                    className={`w-full rounded-xl border ${errors.message ? 'border-danger' : 'border-border'} px-4 py-3 transition-all bg-muted/50 focus:bg-surface focus:ring-4 focus:ring-primary/10 text-heading placeholder:text-text/40 resize-none`}
                    rows="4"
                    placeholder="Tell us how we can help..."
                    {...register('message')}
                  />
                  {errors.message && <p className="text-xs text-danger font-medium ml-1">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Office Section */}
      <section className="full-bleed !mt-0 bg-surface border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Headquarters"
            title="Where the magic happens"
            subtitle="Nestled in the heart of Green City, our office is 100% solar powered and zero-waste certified."
            centered={true}
          />
          <div className="h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl relative group">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600"
              alt="Our sustainable office space"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <p className="text-white text-lg font-medium">EcoTrack HQ - Green City</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
