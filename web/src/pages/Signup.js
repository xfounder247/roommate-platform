import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

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

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Left Panel */}
      <div className="bg-red-500 p-10 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-black text-white tracking-tight mb-10">
            RoomMatch
          </div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-3">
            Find your perfect roommate today.
          </h1>
          <p className="text-sm text-red-100 leading-relaxed mb-8 font-medium">
            Join 50,000+ people who found their ideal roommate based on lifestyle compatibility.
          </p>
          <div className="space-y-4">
            {[
              { icon: '🧠', text: 'Smart lifestyle matching algorithm' },
              { icon: '💬', text: 'Real-time chat with matches' },
              { icon: '🏠', text: 'Verified room listings across India' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-white font-semibold">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Match Pills */}
        <div className="space-y-2 mt-10">
          {[
            { initials: 'VS', name: 'Vikram, 26 · Delhi', loc: 'Non-smoker · Early bird', score: '95%' },
            { initials: 'PR', name: 'Priya, 24 · Bangalore', loc: 'Pet lover · Student', score: '88%' },
          ].map(p => (
            <div key={p.name} className="bg-white bg-opacity-20 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-black text-red-500 flex-shrink-0">
                {p.initials}
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-white">{p.name}</div>
                <div className="text-xs text-red-100">{p.loc}</div>
              </div>
              <div className="text-sm font-black text-white">{p.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-white p-10 flex flex-col justify-center">
        <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-gray-400 font-medium mb-7">
          Start finding your perfect roommate in minutes
        </p>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">FULL NAME</label>
              <input name="full_name" type="text" placeholder="John Doe"
                value={form.full_name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
                required />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">AGE</label>
              <input name="age" type="number" placeholder="25"
                value={form.age} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
                required />
            </div>
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
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">CITY</label>
              <input name="location" type="text" placeholder="Delhi"
                value={form.location} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 focus:bg-white text-sm text-gray-700 transition"
                required />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-black text-sm transition mt-2">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-300 font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <button className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:border-gray-200 transition flex items-center justify-center gap-2">
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