import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import supabase from '../supabaseClient'

const steps = [
  { id: 1, title: "What's your name?", subtitle: 'This is how you appear to others' },
  { id: 2, title: "What's your gender?", subtitle: 'Help us find better matches' },
  { id: 3, title: 'How old are you?', subtitle: 'Must be 18 or above' },
  { id: 4, title: 'Which city are you in?', subtitle: 'We show you local matches' },
  { id: 5, title: "What's your budget?", subtitle: 'Monthly rent you can afford' },
  { id: 6, title: 'Create your password', subtitle: 'Keep your account secure' },
  { id: 7, title: "What's your email?", subtitle: 'We send your login link here' },
]

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurugram', 'Noida']
const budgets = [
  { label: 'Under ₹8k', min: 0, max: 8000, icon: '💚' },
  { label: '₹8k - ₹15k', min: 8000, max: 15000, icon: '💛' },
  { label: '₹15k - ₹25k', min: 15000, max: 25000, icon: '🧡' },
  { label: 'Above ₹25k', min: 25000, max: 50000, icon: '❤️' },
]

const Signup = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: '', gender: '', age: '', location: '',
    budget_min: 0, budget_max: 0, password: '', email: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const totalSteps = steps.length
  const progress = (step / totalSteps) * 100
  const current = steps[step - 1]

  const next = () => {
    setError('')
    if (step === 1 && !form.full_name.trim()) { setError('Please enter your name'); return }
    if (step === 2 && !form.gender) { setError('Please select your gender'); return }
    if (step === 3 && (!form.age || form.age < 18)) { setError('You must be 18 or above'); return }
    if (step === 4 && !form.location) { setError('Please select your city'); return }
    if (step === 5 && !form.budget_min) { setError('Please select your budget'); return }
    if (step === 6 && form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (step < totalSteps) setStep(step + 1)
    else handleSubmit()
  }

  const back = () => { setError(''); setStep(step - 1) }

  const handleSubmit = async () => {
    if (!form.email) { setError('Please enter your email'); return }
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
      options: { redirectTo: 'https://roompartner.in/matches' }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* Top Header */}
      <div className="bg-red-500 px-5 pt-8 pb-10">
        <div className="text-xl font-black text-white tracking-tight mb-4">RoomMatch</div>

        {/* Step Dots */}
        <div className="flex gap-1.5 mb-4">
          {steps.map((s, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < step ? 'bg-white' : 'bg-white bg-opacity-30'} ${i === step - 1 ? 'flex-1' : 'w-4'}`} />
          ))}
        </div>

        <div className="text-xs text-red-200 font-bold mb-1">STEP {step} OF {totalSteps}</div>
        <div className="text-2xl font-black text-white leading-tight">{current.title}</div>
        <div className="text-xs text-red-100 mt-1 font-medium">{current.subtitle}</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 bg-white px-5 py-6">

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Step 1 - Name */}
        {step === 1 && (
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">FULL NAME</label>
            <input
              type="text"
              placeholder="e.g. Vishal Singh"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-lg text-gray-700 transition"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">This is how you'll appear to other users</p>
          </div>
        )}

        {/* Step 2 - Gender */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              { value: 'male', label: 'Male', icon: '👨' },
              { value: 'female', label: 'Female', icon: '👩' },
              { value: 'other', label: 'Other / Prefer not to say', icon: '🧑' },
            ].map(option => (
              <button key={option.value}
                onClick={() => setForm({ ...form, gender: option.value })}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${form.gender === option.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                <span className="text-3xl">{option.icon}</span>
                <span className={`text-base font-black ${form.gender === option.value ? 'text-red-500' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {form.gender === option.value && <span className="ml-auto text-red-500">✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Step 3 - Age */}
        {step === 3 && (
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">YOUR AGE</label>
            <input
              type="number"
              placeholder="e.g. 25"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-lg text-gray-700 transition"
              min="18"
              max="60"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">Must be 18 years or above</p>
          </div>
        )}

        {/* Step 4 - City */}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {cities.map(city => (
              <button key={city}
                onClick={() => setForm({ ...form, location: city })}
                className={`p-4 rounded-2xl border-2 transition text-left ${form.location === city
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                <div className="text-sm font-black text-gray-900">{city}</div>
                {form.location === city && <div className="text-xs text-red-500 font-bold mt-0.5">Selected ✓</div>}
              </button>
            ))}
          </div>
        )}

        {/* Step 5 - Budget */}
        {step === 5 && (
          <div className="space-y-3">
            {budgets.map(budget => (
              <button key={budget.label}
                onClick={() => setForm({ ...form, budget_min: budget.min, budget_max: budget.max })}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${form.budget_max === budget.max
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                <span className="text-3xl">{budget.icon}</span>
                <span className={`text-base font-black ${form.budget_max === budget.max ? 'text-red-500' : 'text-gray-700'}`}>
                  {budget.label}
                </span>
                {form.budget_max === budget.max && <span className="ml-auto text-red-500">✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Step 6 - Password */}
        {step === 6 && (
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">PASSWORD</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-lg text-gray-700 transition"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">At least 6 characters</p>
          </div>
        )}

        {/* Step 7 - Email */}
        {step === 7 && (
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-lg text-gray-700 transition"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2 font-medium">We'll send a verification link</p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-xs text-gray-300 font-bold">OR</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            <button onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              🌐 Continue with Google
            </button>
          </div>
        )}

      </div>

      {/* Bottom Buttons */}
      <div className="bg-white px-5 pb-8 pt-4 border-t border-gray-100">
        <button
          onClick={next}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-base transition mb-3">
          {loading ? 'Creating account...' : step === totalSteps ? 'Create Account 🎉' : 'Continue →'}
        </button>

        {step > 1 && (
          <button onClick={back}
            className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-100 transition">
            ← Back
          </button>
        )}

        {step === 1 && (
          <p className="text-center text-xs text-gray-400 mt-3 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-red-500 font-black">Sign in</Link>
          </p>
        )}
      </div>

    </div>
  )
}

export default Signup
