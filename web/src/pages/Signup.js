import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import supabase from '../supabaseClient'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    age: '', gender: '', location: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, form)
      alert('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Red Banner */}
      <div className="bg-red-500 px-4 py-8 text-center">
        <div className="text-2xl font-black text-white tracking-tight mb-2">
          RoomMatch
        </div>
        <h1 className="text-xl font-black text-white leading-tight mb-2">
          Create your account 🏠
        </h1>
        <p className="text-xs text-red-100 font-medium">
          Find your perfect roommate in minutes
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
            <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">FULL NAME</label>
            <input name="full_name" type="text" placeholder="John Doe"
              value={form.full_name} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
              required />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">AGE</label>
              <input name="age" type="number" placeholder="25"
                value={form.age} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
                required />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">GENDER</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
                required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">CITY</label>
            <input name="location" type="text" placeholder="Delhi, Mumbai, Bangalore..."
              value={form.location} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
              required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-black text-sm transition">
            {loading ? 'Creating account...' : 'Create Account →'}
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
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 font-black hover:underline">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Signup
