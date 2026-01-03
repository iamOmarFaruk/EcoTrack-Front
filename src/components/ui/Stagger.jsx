import { motion } from 'framer-motion'

export const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

/**
 * Wrapper for staggered animations
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {number} props.viewportAmount - Amount of element visible before triggering (0-1)
 */
export function StaggerContainer({ children, className = "", viewportAmount = 0.1, ...props }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: viewportAmount }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/**
 * Item within a StaggerContainer
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export function StaggerItem({ children, className = "", ...props }) {
    return (
        <motion.div
            variants={itemVariants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
