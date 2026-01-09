import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import whyGoGreenImg from '../assets/why-go-green.png'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98],
        },
    },
}

export default function CTA() {
    return (
        <section
            className="relative isolate overflow-hidden h-[50vh] min-h-[300px] sm:min-h-[400px] flex items-center justify-center bg-fixed bg-center bg-cover py-[200px] sm:py-0"
            style={{ backgroundImage: `url(${whyGoGreenImg})` }}
        >

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-12 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="mb-6 text-xl font-black tracking-tighter text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        Ready to Make a Real Difference?
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mb-8 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-white/90"
                    >
                        Join thousands of eco-conscious individuals tracking their impact, completing challenges, and building a sustainable future together.
                    </motion.p>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
                    >
                        <motion.div variants={itemVariants}>
                            <Button
                                as={Link}
                                to="/challenges"
                                className="!px-5 sm:!px-8 !py-2.5 sm:!py-4 text-sm sm:text-lg"
                            >
                                Explore Challenges
                            </Button>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button
                                as={Link}
                                to="/tips"
                                variant="secondary"
                                className="!px-5 sm:!px-8 !py-2.5 sm:!py-4 text-sm sm:text-lg"
                            >
                                Share Tips
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
