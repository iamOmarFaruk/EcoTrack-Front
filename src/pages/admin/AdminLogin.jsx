import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import Button from '../../components/ui/Button.jsx'

const DEMO_EMAIL = 'admin@ecotrack.com'
const DEMO_PASSWORD = 'Admin#2025'

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
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
      // handled by context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full blur-[110px]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent)' }}></div>
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.35), transparent)' }}></div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-4 py-16">
        <div className="hidden flex-1 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-black p-10 shadow-2xl shadow-emerald-500/10 md:block">
          <div className="flex items-center gap-3 text-white/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">EcoTrack</p>
              <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
            </div>
          </div>

          <p className="mt-6 text-lg text-white/70">
            Full oversight for content, publishing, and user safety. Use the demo credentials below to explore the entire control panel.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-emerald-200">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Demo Email</p>
                <p className="font-semibold text-white">{DEMO_EMAIL}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-emerald-200">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Demo Password</p>
                <p className="font-semibold text-white">{DEMO_PASSWORD}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">Secure</p>
                <h2 className="text-2xl font-bold text-white">Sign in as Admin</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Email</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Mail size={16} className="text-emerald-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                    placeholder="admin@ecotrack.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Password</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Lock size={16} className="text-emerald-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-white/50 hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center bg-emerald-500 text-white hover:bg-emerald-400"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Access Control Panel'}
              </Button>
              <p className="text-center text-xs text-white/50">
                Routes and mutations are protected behind the admin token and mirrored in the backend.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
