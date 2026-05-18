import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabaseClient'

const EditProfile = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    budget_min: '',
    budget_max: '',
    photo_url: ''
  })
  const headers = { Authorization: `Bearer ${token}` }

  const totalSteps = 5

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, { headers })
      .then(res => {
        const p = res.data
        setForm({
          full_name: p.full_name || '',
          age: p.age || '',
          gender: p.gender || '',
          location: p.location || '',
          bio: p.bio || '',
          budget_min: p.budget_min || '',
          budget_max: p.budget_max || '',
          photo_url: p.photo_url || ''
        })
        setPhotoUrl(p.photo_url)
      })
      .catch(() => {})
  }, [])

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id || 'user'}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setPhotoUrl(data.publicUrl)
      setForm(prev => ({ ...prev, photo_url: data.publicUrl }))
    } catch {
      alert('Could not upload photo.')
    }
    setUploading(false)
  }

  const next = () => {
    setError('')
    if (step === 1 && !form.full_name.trim()) { setError('Please enter your name'); return }
    if (step === 2 && !form.gender) { setError('Please select your gender'); return }
    if (step === 3 && (!form.age || form.age < 18)) { setError('Age must be 18 or above'); return }
    if (step === 4 && !form.location) { setError('Please select your city'); return }
    if (step < totalSteps) setStep(step + 1)
    else handleSave()
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, form, { headers })
      alert('Profile updated! ✅')
      navigate('/profile')
    } catch {
      alert('Could not update profile.')
    }
    setLoading(false)
  }

  const steps = [
    { title: 'Your name', subtitle: 'How others will see you' },
    { title: 'Your gender', subtitle: 'Help us find better matches' },
    { title: 'Your age', subtitle: 'Must be 18 or above' },
    { title: 'Your city', subtitle: 'We show you local matches' },
    { title: 'About you', subtitle: 'Bio and budget details' },
  ]

  const current = steps[step - 1]
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="bg-red-500 px-5 pt-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/profile')}
            className="text-white font-black text-lg">←</button>
          <div className="text-base font-black text-white">Edit Profile</div>
          <button onClick={() => navigate('/profile')}
            className="text-white font-black text-sm opacity-70">Cancel</button>
        </div>
        <div className="flex gap-1.5 mb-4">
          {steps.map((s, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < step ? 'bg-white' : 'bg-white bg-opacity-30'} ${i === step - 1 ? 'flex-1' : 'w-4'}`} />
          ))}
        </div>
        <div className="text-xs text-red-200 font-bold mb-1">STEP {step} OF {totalSteps}</div>
        <div className="text-2xl font-black text-white leading-tight">{current.title}</div>
        <div className="text-xs text-red-100 mt-1 font-medium">{current.subtitle}</div>
      </div>

      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 bg-white px-5 py-6">

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Step 1 - Name & Photo */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="flex flex-col items-center py-4">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-2xl bg-red-50 flex items-center justify-center text-3xl font-black text-red-500 overflow-hidden">
                  {photoUrl
                    ? <img src={photoUrl} alt="profile" className="w-full h-full object-cover" />
                    : form.full_name?.charAt(0) || '👤'
                  }
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-md">
                  <span className="text-white text-sm">📷</span>
                  <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                {uploading ? 'Uploading...' : 'Tap camera to change photo'}
              </p>
            </div>

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
            </div>
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
                  : 'border-gray-100 bg-gray-50'}`}>
                <span className="text-3xl">{option.icon}</span>
                <span className={`text-base font-black ${form.gender === option.value ? 'text-red-500' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {form.gender === option.value && <span className="ml-auto text-red-500 font-black">✓</span>}
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
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-2xl font-black text-gray-700 transition"
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
            {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurugram', 'Noida'].map(city => (
              <button key={city}
                onClick={() => setForm({ ...form, location: city })}
                className={`p-4 rounded-2xl border-2 transition text-left ${form.location === city
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-100 bg-gray-50'}`}>
                <div className={`text-sm font-black ${form.location === city ? 'text-red-500' : 'text-gray-900'}`}>
                  {city}
                </div>
                {form.location === city && <div className="text-xs text-red-400 mt-0.5">Selected ✓</div>}
              </button>
            ))}
          </div>
        )}

        {/* Step 5 - Bio & Budget */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">BIO</label>
              <textarea
                placeholder="Tell potential roommates about yourself..."
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                rows={4}
              />
              <p className="text-xs text-gray-400 mt-1">{form.bio.length}/300 characters</p>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">BUDGET RANGE (₹/month)</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold">Minimum</p>
                  <input
                    type="number"
                    placeholder="e.g. 8000"
                    value={form.budget_min}
                    onChange={e => setForm({ ...form, budget_min: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold">Maximum</p>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={form.budget_max}
                    onChange={e => setForm({ ...form, budget_max: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                  />
                </div>
              </div>
            </div>

            {/* Quick budget options */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under ₹8k', min: 0, max: 8000 },
                { label: '₹8k-15k', min: 8000, max: 15000 },
                { label: '₹15k-25k', min: 15000, max: 25000 },
                { label: 'Above ₹25k', min: 25000, max: 50000 },
              ].map(b => (
                <button key={b.label}
                  onClick={() => setForm({ ...form, budget_min: b.min, budget_max: b.max })}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold transition ${form.budget_max === b.max
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Buttons */}
      <div className="bg-white px-5 pb-8 pt-4 border-t border-gray-100">
        <button
          onClick={next}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-base transition mb-3">
          {loading ? 'Saving...' : step === totalSteps ? 'Save Profile ✅' : 'Continue →'}
        </button>
        {step > 1 && (
          <button onClick={() => { setError(''); setStep(step - 1) }}
            className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-100 transition">
            ← Back
          </button>
        )}
      </div>

    </div>
  )
}

export default EditProfile
