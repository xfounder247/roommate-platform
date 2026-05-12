import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { token, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [prefs, setPrefs] = useState({
    sleep_schedule: '', cleanliness: '',
    smoking: '', pets: '', guests: '', work_schedule: ''
  })
  const [saved, setSaved] = useState(false)
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, { headers })
      .then(res => {
        setProfile(res.data)
        if (res.data.preferences?.[0]) setPrefs(res.data.preferences[0])
      })
  }, [])

  const savePreferences = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/preferences`, prefs, { headers })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-4xl font-bold text-rose-500 mx-auto mb-4">
            {profile.full_name?.charAt(0) || '?'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h1>
          <p className="text-gray-500 mb-4">📍 {profile.location} · 🎂 {profile.age} years old</p>
          <p className="text-gray-600 mb-4">{profile.bio || 'No bio yet.'}</p>
          <p className="text-sm text-gray-500">
            💰 Budget: ₹{profile.budget_min} - ₹{profile.budget_max}/month
          </p>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">⚙️ My Preferences</h2>
          <p className="text-sm text-gray-500 mb-6">These help us find your best matches!</p>

          <div className="space-y-4">
            {[
              { label: 'Sleep Schedule', key: 'sleep_schedule', options: ['early bird', 'night owl'] },
              { label: 'Cleanliness', key: 'cleanliness', options: ['very clean', 'moderate', 'relaxed'] },
              { label: 'Smoking', key: 'smoking', options: ['yes', 'no', 'outside only'] },
              { label: 'Pets', key: 'pets', options: ['yes', 'no', 'allergic'] },
              { label: 'Guests', key: 'guests', options: ['often', 'sometimes', 'rarely'] },
              { label: 'Work Schedule', key: 'work_schedule', options: ['work from home', 'office', 'student'] }
            ].map(({ label, key, options }) => (
              <div key={key} className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <select
                  value={prefs[key]}
                  onChange={e => setPrefs({ ...prefs, [key]: e.target.value })}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-gray-700 text-sm transition">
                  <option value="">Select...</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button onClick={savePreferences}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition mt-6">
            {saved ? '✅ Saved!' : 'Save Preferences'}
          </button>
        </div>

        {/* Logout Button */}
        <button onClick={logout}
          className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-200 py-3 rounded-xl font-medium transition">
          Logout
        </button>

      </div>
    </div>
  )
}

export default Profile