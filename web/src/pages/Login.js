import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabaseClient'

const Login = () => {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      if (supabaseError) {
        setError(supabaseError.message)
        setLoading(false)
        return
      }
      const token = data.session.access_token
      localStorage.setItem('token', token)
      setToken(token)
      navigate('/matches')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert('Please enter your email!')
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: 'https://roompartner.in/reset-password'
      })
      if (error) {
        alert(error.message)
        return
      }
      setForgotSent(true)
    } catch {
      alert('Something went wrong. Try again.')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://roompartner.in/matches'
      }
    })
    if (error) setError(error.message)
  }

  // Forgot Password Screen
  if (showForgot) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-red-500 px-4 py-8 text-center">
          <div className="text-2xl font-black text-white tracking-tight mb-2">
            RoomMatch
          </div>
          <h1 className="text-xl font-black text-white leading-tight mb-2">
            Reset Password 🔑
          </h1>
          <p className="text-xs text-red-100 font-medium">
            We'll send you a reset link
          </p>
        </div>

        <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-4 py-8">
          {forgotSent ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-lg font-black text-gray-900 mb-2">Check your email!</h2>
              <p className="text-sm text-gray-400 font-medium mb-6">
                We sent a password reset link to {forgotEmail}
              </p>
              <button onClick={() => { setShowForgot(false); setForgotSent(false) }}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-black text-sm">
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">EMAIL</label>
                <input type="email" placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition mb-4"
                />
                <button onClick={handleForgotPassword}
                  className="w-full bg-red-500 text-white py-3.5 rounded-xl font-black text-sm transition mb-4">
                  Send Reset Link →
                </button>
                <button onClick={() => setShowForgot(false)}
                  className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-bold text-sm transition border-2 border-gray-100">
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Red Banner */}
      <div className="bg-red-500 px-4 py-8 text-center">
        <div className="text-2xl font-black text-white tracking-tight mb-2">
          RoomMatch
        </div>
        <h1 className="text-xl font-black text-white leading-tight mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-xs text-red-100 font-medium">
          Sign in to find your perfect roommate
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-4 py-8">

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">EMAIL</label>
            <input name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
              required />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">PASSWORD</label>
            <input name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
              required />
          </div>

          <div className="flex justify-end">
            <button type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs text-red-500 font-black hover:underline">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-black text-sm transition">
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-300 font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <button onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:border-gray-200 transition flex items-center justify-center gap-2">
          🌐 Continue with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-500 font-black hover:underline">Sign up free</Link>
        </p>

      </div>
    </div>
  )
}

export default Login
