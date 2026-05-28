'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react'
import { login } from '@/lib/actions/auth'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/admin/dashboard'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(username, password)
    if (!result.error) {
      router.push(from)
      router.refresh()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#040404]">
      {/* Bg */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 rounded-full bg-deep-green/25 blur-[120px]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
            <span className="text-black font-black text-base tracking-wider">YSE</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">CMS Login</h1>
          <p className="text-white/30 text-sm">YardStyle Entertainment — Admin Portal</p>
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-8 border border-white/8 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="input-dark w-full pl-10 pr-4 py-3.5 rounded-xl text-sm"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-white/35 mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-dark w-full pl-10 pr-10 py-3.5 rounded-xl text-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  <Lock size={15} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/15">
            <p className="text-gold text-[10px] font-bold tracking-widest uppercase mb-2">Demo Credentials</p>
            <p className="text-white/40 text-xs font-mono">username: <span className="text-white">admin</span></p>
            <p className="text-white/40 text-xs font-mono">password: <span className="text-white">YardStyle2026!</span></p>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          © 2026 YardStyle Entertainment. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
