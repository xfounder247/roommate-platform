import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const onboardingSteps = [
  { id: 1, title: 'Your sleep schedule?', subtitle: 'Help us find compatible roommates', key: 'sleep_schedule', options: [
    { value: 'early bird', label: 'Early Bird', icon: '🌅', desc: 'Sleep before 11pm, wake up early' },
    { value: 'night owl', label: 'Night Owl', icon: '🌙', desc: 'Sleep late, wake up late' },
  ]},
  { id: 2, title: 'How clean are you?', subtitle: 'Cleanliness compatibility matters', key: 'cleanliness', options: [
    { value: 'very clean', label: 'Very Clean', icon: '✨', desc: 'I clean regularly and expect the same' },
    { value: 'moderate', label: 'Moderate', icon: '🙂', desc: 'Clean but not obsessive' },
    { value: 'relaxed', label: 'Relaxed', icon: '😌', desc: 'I clean when needed' },
  ]},
  { id: 3, title: 'Do you smoke?', subtitle: 'Important for shared spaces', key: 'smoking', options: [
    { value: 'no', label: "Don't Smoke", icon: '🚭', desc: 'I prefer smoke-free environment' },
    { value: 'outside only', label: 'Outside Only', icon: '🚪', desc: 'Only smoke outside' },
    { value: 'yes', label: 'Yes I Smoke', icon: '🚬', desc: 'I smoke indoors too' },
  ]},
  { id: 4, title: 'Are you okay with pets?', subtitle: 'Some people have furry friends', key: 'pets', options: [
    { value: 'yes', label: 'Love Pets', icon: '🐾', desc: 'I love animals!' },
    { value: 'no', label: 'No Pets', icon: '🙅', desc: "I'd prefer no pets" },
    { value: 'allergic', label: 'Allergic', icon: '🤧', desc: "I'm allergic to pets" },
  ]},
  { id: 5, title: 'How often guests?', subtitle: 'Set expectations early', key: 'guests', options: [
    { value: 'rarely', label: 'Rarely', icon: '🏠', desc: 'I prefer a quiet home' },
    { value: 'sometimes', label: 'Sometimes', icon: '👥', desc: 'Occasional guests are fine' },
    { value: 'often', label: 'Often', icon: '🎉', desc: 'I love having people over' },
  ]},
  { id: 6, title: 'Your work schedule?', subtitle: 'Helps match your lifestyle', key: 'work_schedule', options: [
    { value: 'office', label: 'Office', icon: '🏢', desc: 'I go to office daily' },
    { value: 'work from home', label: 'Work From Home', icon: '💻', desc: 'I work from home' },
    { value: 'student', label: 'Student', icon: '🎓', desc: "I'm a student" },
  ]},
]

const Onboarding = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [prefs, setPrefs] = useState({
    sleep_schedule: '', cleanliness: '',
    smoking: '', pets: '', guests: '', work_schedule: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const headers = { Authorization: `Bearer ${token}` }

  const totalSteps = onboardingSteps.length
  const current = onboardingSteps[step - 1]
  const progress = (step / totalSteps) * 100

  const next = async () => {
    setError('')
    if (!prefs[current.key]) {
      setError('Please select an option to continue')
      return
    }
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setLoading(true)
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/profile/preferences`,
          prefs,
          { headers }
        )
        navigate('/matches')
      } catch {
        alert('Could not save preferences. Try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="bg-red-500 px-5 pt-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-black text-white">RoomMatch</div>
          <button
            onClick={() => navigate('/matches')}
            className="text-white text-xs font-bold opacity-70 border border-white border-opacity-30 px-3 py-1.5 rounded-lg">
            Skip for now
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {onboardingSteps.map((s, i) => (
            <div key={i}
              className={`h-1.5 rounded-full transition-all ${i < step ? 'bg-white' : 'bg-white bg-opacity-30'} ${i === step - 1 ? 'flex-1' : 'w-4'}`} />
          ))}
        </div>

        <div className="text-xs text-red-200 font-bold mb-1">
          QUESTION {step} OF {totalSteps}
        </div>
        <div className="text-2xl font-black text-white leading-tight">
          {current.title}
        </div>
        <div className="text-xs text-red-100 mt-1 font-medium">
          {current.subtitle}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-red-500 transition-all duration-300"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Options */}
      <div className="flex-1 bg-white px-5 py-6">

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {current.options.map(option => (
            <button key={option.value}
              onClick={() => setPrefs({ ...prefs, [current.key]: option.value })}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left ${prefs[current.key] === option.value
                ? 'border-red-500 bg-red-50'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
              <span className="text-3xl flex-shrink-0">{option.icon}</span>
              <div className="flex-1">
                <div className={`text-base font-black ${prefs[current.key] === option.value ? 'text-red-500' : 'text-gray-800'}`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">
                  {option.desc}
                </div>
              </div>
              {prefs[current.key] === option.value && (
                <span className="text-red-500 font-black flex-shrink-0">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Previous answers summary */}
        {step > 1 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
            <p className="text-xs font-black text-gray-400 mb-2 tracking-wide">YOUR ANSWERS SO FAR</p>
            <div className="flex flex-wrap gap-2">
              {onboardingSteps.slice(0, step - 1).map(s => (
                prefs[s.key] && (
                  <span key={s.key} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border-2 border-gray-100 text-gray-600">
                    {s.options.find(o => o.value === prefs[s.key])?.icon} {prefs[s.key]}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom buttons */}
      <div className="bg-white px-5 pb-8 pt-4 border-t border-gray-100">
        <button
          onClick={next}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-base transition mb-3">
          {loading ? 'Saving...' : step === totalSteps ? 'Find My Matches 🎉' : 'Continue →'}
        </button>

        {step > 1 && (
          <button
            onClick={() => { setError(''); setStep(step - 1) }}
            className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-100 transition">
            ← Back
          </button>
        )}
      </div>

    </div>
  )
}

export default Onboarding
