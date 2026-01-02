import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from './ui/Button'

export default function CTA() {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden bg-primary text-white text-center py-16 px-6 sm:px-12 lg:py-24"
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight">
                            Ready to Make a Real Difference?
                        </h2>

                        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Join thousands of eco-conscious individuals tracking their impact, completing challenges, and building a sustainable future together.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button as={Link} to="/register" variant="secondary" size="lg" className="min-w-[180px] shadow-lg shadow-black/20">
                                Join Now - It's Free
                            </Button>
                            <Button as={Link} to="/challenges" variant="outline" size="lg" className="min-w-[180px] bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
                                Explore Challenges
                            </Button>
                        </div>

                        <p className="text-sm text-white/70 pt-4">
                            No credit card required • Join 10,000+ members
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
