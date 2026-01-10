import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { handleMutationError } from '../../utils/errorHandler.js'
import Button from '../../components/ui/Button.jsx'

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@ecotrack.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = sessionStorage.getItem('adminRedirect') || '/control-panel/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      const redirectTo = sessionStorage.getItem('adminRedirect') || '/control-panel/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      handleMutationError(error, 'Unable to sign in. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-24 top-10 h-64 w-64 rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.35), transparent)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 py-8 md:flex-row md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          className="flex w-full max-w-md flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-6 shadow-2xl shadow-emerald-500/10 sm:rounded-3xl sm:p-8"
        >
          <motion.div
            className="flex items-center gap-3 text-white/80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 sm:h-11 sm:w-11 sm:rounded-xl"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <ShieldCheck className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
            </motion.div>
            <div>
              <p className="mb-0.5 text-[10px] uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">EcoTrack</p>
              <h1 className="text-lg font-bold text-white sm:text-xl">Admin Control Center</h1>
            </div>
          </motion.div>

          <motion.p
            className="mt-4 md:text-xl text-white/70 sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Full oversight for content, publishing, and user safety. Demo credentials are pre-filled for easy access.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              className="flex min-h-[64px] flex-1 items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-emerald-200">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Demo Email</p>
                <p className="font-semibold text-white">admin@ecotrack.com</p>
              </div>
            </motion.div>
            <motion.div
              className="flex min-h-[64px] flex-1 items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-emerald-200">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Demo Password</p>
                <p className="font-semibold text-white">admin123</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="w-full max-w-md"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="flex w-full flex-col justify-center rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur sm:rounded-3xl sm:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 sm:h-11 sm:w-11 sm:rounded-xl"
                whileHover={{ rotate: -10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <ShieldCheck className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
              </motion.div>
              <div>
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">Secure</p>
                <h2 className="text-lg font-bold text-white sm:text-xl">Sign in as Admin</h2>
              </div>
            </motion.div>

            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              <motion.div variants={itemVariants}>
                <label className="text-[10px] uppercase tracking-wide text-white/50 sm:text-xs">Email</label>
                <motion.div
                  className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 sm:mt-2 sm:rounded-xl sm:px-3"
                  whileFocus={{ scale: 1.02, borderColor: "rgba(52, 211, 153, 0.5)" }}
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-4 w-4 text-emerald-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
                    placeholder="admin@ecotrack.com"
                  />
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="text-[10px] uppercase tracking-wide text-white/50 sm:text-xs">Password</label>
                <motion.div
                  className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 sm:mt-2 sm:rounded-xl sm:px-3"
                  whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock className="h-4 w-4 text-emerald-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
                    placeholder="••••••••"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-white/50 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3"
              >
                <p className="text-xs text-blue-200/80">
                  Credentials are pre-filled. Just click "Sign in" to access the admin panel.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center bg-emerald-500 text-sm text-white hover:bg-emerald-400 sm:text-base"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Access Control Panel'}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
