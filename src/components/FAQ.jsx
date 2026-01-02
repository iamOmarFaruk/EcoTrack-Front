import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'

const faqs = [
    {
        question: "What is EcoTrack and how does it help the environment?",
        answer: "EcoTrack is a community-driven platform designed to help you track, understand, and reduce your environmental footprint. By participating in challenges, logging eco-friendly activities, and monitoring your stats, you can make measurable changes to your daily life that collectively make a big difference for our planet."
    },
    {
        question: "How do the challenges work?",
        answer: "Challenges are time-bound events where the community comes together to achieve a specific goal, like 'Zero Waste Week' or 'Bike to Work Month'. You can join a challenge, log your progress, and earn badges while seeing how your individual efforts contribute to the community's total impact."
    },
    {
        question: "Is EcoTrack free to use?",
        answer: "Yes! EcoTrack is completely free for individuals. Our mission is to make sustainability accessible to everyone. We may offer premium features for organizations or advanced analytics in the future, but the core tracking and community features will always remain free."
    },
    {
        question: "How is my carbon footprint calculated?",
        answer: "We use standard scientific data and calculations based on the activities you log. For example, when you log a commute by bike instead of car, we calculate the emissions saved based on average vehicle emission rates and the distance traveled."
    },
    {
        question: "Can I invite friends and compete with them?",
        answer: "Absolutely! Everything is better with friends. You can invite your friends to EcoTrack, see their progress, and even compete in friendly leaderboards to see who can save the most CO2 or complete the most challenges."
    }
]

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <motion.div
            initial={false}
            className={`border border-border/60 rounded-xl overflow-hidden mb-4 transition-colors duration-300 ${isOpen ? 'bg-primary/5 border-primary/30' : 'bg-surface hover:border-primary/30'}`}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
            >
                <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-primary' : 'text-heading'}`}>
                    {question}
                </span>
                <span className={`flex-shrink-0 ml-4 p-1 rounded-full border transition-all duration-300 ${isOpen ? 'bg-primary text-white border-primary rotate-180' : 'border-border text-text/60'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", marginTop: 0 },
                            collapsed: { opacity: 0, height: 0, marginTop: -10 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-6 pb-6 text-text/80 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Decorative background elements */}


            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <SectionHeading
                    badge="Common Questions"
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about getting started with EcoTrack"
                />

                <div className="mt-10">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
