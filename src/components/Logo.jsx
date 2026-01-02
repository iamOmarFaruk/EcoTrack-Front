import { motion } from 'framer-motion'

export default function Logo({ className = "h-8 w-8" }) {
  return (
    <motion.img
      className={className}
      src="/logo.png"
      alt="EcoTrack logo"
      loading="eager"
      decoding="async"
      draggable="false"
      animate={{ rotate: 360 }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

