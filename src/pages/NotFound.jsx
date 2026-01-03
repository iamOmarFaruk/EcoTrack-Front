import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { Compass, Home, Search } from 'lucide-react'

export default function NotFound() {
  useDocumentTitle('404 - Not Found')

  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary)/0.03),transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 blur-[100px]"
      >
        <div className="aspect-square w-[500px] rounded-full bg-primary/10 opacity-40" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Visual indicator */}
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
              className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 shadow-sm"
            >
              <Compass className="h-10 w-10 text-primary" />
            </motion.div>
          </div>

          <h1 className="relative mb-4 text-8xl font-black tracking-tighter text-heading sm:text-9xl">
            <span className="bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">4</span>
            <span className="bg-gradient-to-b from-primary/80 to-primary/40 bg-clip-text text-transparent">0</span>
            <span className="bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">4</span>
          </h1>

          <h2 className="mb-6 text-3xl font-bold text-heading sm:text-4xl">
            Oops! Page Not Found
          </h2>

          <p className="mx-auto mb-10 max-w-md text-lg text-text/70 leading-relaxed">
            Looks like this page got lost in the forest.<br />
            Don't worry, we'll help you find your way back home.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button as={Link} to="/" className="group h-12 w-full gap-2 px-8 sm:w-auto">
                <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Go Back Home
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                as={Link}
                to="/challenges"
                variant="secondary"
                className="group h-12 w-full gap-2 px-8 sm:w-auto"
              >
                <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                Explore Challenges
              </Button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-sm text-text/50"
          >
            Mistaken? Feel free to{' '}
            <Link
              to="/contact"
              className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-darker hover:decoration-primary"
            >
              Contact Support
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}


