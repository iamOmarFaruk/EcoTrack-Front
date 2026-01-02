import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Eco Enthusiast",
        quote: "EcoTrack has completely transformed how I view my daily impact. The challenges are fun and the community is incredibly supportive!",
        initials: "SJ",
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Sustainability Lead",
        quote: "As a professional in the field, I love how data-driven this platform is. It makes tracking carbon footprint reductions tangible and accurate.",
        initials: "MC",
        color: "bg-green-100 text-green-600"
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        role: "Student",
        quote: "I started using this for a class project and couldn't stop. It's addictive in the best way possible. Five stars!",
        initials: "ER",
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 4,
        name: "David Kim",
        role: "Urban Gardener",
        quote: "The specific tips for urban living have helped me reduce waste significantly. Highly recommend for city dwellers.",
        initials: "DK",
        color: "bg-yellow-100 text-yellow-600"
    },
    {
        id: 5,
        name: "Jessica Alba",
        role: "Homeowner",
        quote: "Finally, an app that doesn't just preach but gives practical steps. My energy bills are down 15% since following the tips.",
        initials: "JA",
        color: "bg-orange-100 text-orange-600"
    }
]

const TestimonialCard = ({ testimonial }) => (
    <div className="w-[350px] md:w-[400px] flex-shrink-0 p-6 md:p-8 rounded-2xl bg-surface border border-border/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mx-4">
        <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-lg mr-4`}>
                {testimonial.initials}
            </div>
            <div>
                <h4 className="font-heading font-bold text-lg text-heading">{testimonial.name}</h4>
                <p className="text-sm text-text/60">{testimonial.role}</p>
            </div>
        </div>
        <div className="mb-4">
            {/* Star rating decoration */}
            <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="text-text/80 leading-relaxed italic">"{testimonial.quote}"</p>
        </div>
    </div>
)

export default function Testimonials() {
    return (
        <section className="py-20 bg-primary/5 relative overflow-hidden">
            <div className="container mx-auto px-4 mb-10">
                <SectionHeading
                    badge="Community Stories"
                    title="Loved by Thousands"
                    subtitle="See what our community members are saying about their journey with EcoTrack"
                />
            </div>

            <div className="relative w-full overflow-hidden mask-linear-fade">
                {/* Gradient overlays for seamless feel edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-10 hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-10 hidden" />

                <div className="flex">
                    <motion.div
                        className="flex py-4"
                        animate={{
                            x: ["0%", "-50%"]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
