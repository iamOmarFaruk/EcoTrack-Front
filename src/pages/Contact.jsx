import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'
import Button from '../components/ui/Button.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SubpageHero from '../components/SubpageHero.jsx'
import { defaultImages } from '../config/env.js'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export default function Contact() {
  useDocumentTitle('Contact Us')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800))
    showSuccess('Message sent! We will get back to you soon.')
    reset()
  }

  return (
    <div className="space-y-12 pb-8">
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

      <div className="mx-auto max-w-xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-heading">Get in Touch</h2>
          <p className="mt-2 text-text/70">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-heading ml-1">Name</label>
            <input
              className="w-full rounded-xl border border-border px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface/50"
              placeholder="Your name"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-danger font-medium ml-1">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-heading ml-1">Email</label>
            <input
              className="w-full rounded-xl border border-border px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface/50"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-danger font-medium ml-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-heading ml-1">Message</label>
            <textarea
              className="w-full rounded-xl border border-border px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface/50 resize-none"
              rows="5"
              placeholder="Write your message..."
              {...register('message')}
            />
            {errors.message && <p className="mt-1 text-xs text-danger font-medium ml-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="h-12 text-lg mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  )
}


