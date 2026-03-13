// ============================================================
// COMMIT 16 — Phase 1: Skeleton — src/pages/auth/RegisterPage.jsx
// ============================================================
// COMMIT 17 — Phase 2: Core Logic — src/pages/auth/RegisterPage.jsx
// ============================================================
// COMMIT 18 — Phase 3: Validation — src/pages/auth/RegisterPage.jsx
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCode } from 'react-icons/fi'

export default function RegisterPage() {
  const navigate  = useNavigate()
  const { register, loading } = useAuth()

  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,   setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)

  // ── Validation ──────────────────────────────────────────
  function validate() {
    const e = {}
    if (!form.name.trim())                       e.name     = 'Name is required'
    if (!form.email)                             e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = 'Enter a valid email'
    if (!form.password)                          e.password = 'Password is required'
    else if (form.password.length < 6)           e.password = 'At least 6 characters'
    if (form.password !== form.confirm)          e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const result = await register(form.name.trim(), form.email, form.password)
    if (result.success) {
      toast.success('Account created! Let's start tracking 🚀')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  // ── Password strength ────────────────────────────────────
  function strength(pw) {
    if (!pw) return 0
    let s = 0
    if (pw.length >= 8)          s++
    if (/[A-Z]/.test(pw))        s++
    if (/[0-9]/.test(pw))        s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }

  const bars    = strength(form.password)
  const barColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']

  // ── UI ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary-400 mb-4">
            <FiCode size={28} />
            <span className="text-2xl font-bold text-gradient">CodoTrack</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-1">Start tracking your coding journey today</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Alex Smith"
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" tabIndex={-1}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Strength bars */}
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${i < bars ? barColors[bars - 1] : 'bg-gray-700'}`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPass ? 'text' : 'password'} name="confirm"
                  value={form.confirm} onChange={handleChange} placeholder="••••••••"
                  className={`input pl-10 ${errors.confirm ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
