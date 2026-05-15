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
  const [activeTab, setActiveTab] = useState('profile')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, { headers })
      .then(res => {
        setProfile(res.data)
        if (res.data.preferences?.[0]) setPrefs(res.data.preferences[0])
      })
      .catch(() => {
        // Show sample profile if not logged in
        setProfile({
          full_name: 'Vishal Singh',
          age: 27,
          gender: 'Male',
          location: 'Delhi',
          bio: 'Looking for a clean and quiet roommate who respects personal space.',
          budget_min: 10000,
          budget_max: 15000,
          photo_url: null
        })
      })
  }, [])

  const savePreferences = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/preferences`, prefs, { headers })
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">👤</div>
        <p className="text-gray-400 font-bold">Loading profile...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Profile Header Card */}
      <div className="bg-red-500 px-6 pt-8 pb-16 relative">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl font-black text-red-500 flex-shrink-0">
            {profile.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{profile.full_name}</h1>
            <p className="text-sm text-red-100 font-semibold mt-0.5">
              📍 {profile.location} · 🎂 {profile.age} yrs · {profile.gender}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                💰 ₹{profile.budget_min?.toLocaleString()} - ₹{profile.budget_max?.toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['profile', 'preferences', 'settings'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-xs font-black capitalize transition ${activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-600'}`}>
                {tab === 'profile' ? '👤 Profile' : tab === 'preferences' ? '⚙️ Preferences' : '🔒 Settings'}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-1.5 tracking-wide">BIO</label>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {profile.bio || 'No bio yet. Add one to attract better matches!'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'FULL NAME', value: profile.full_name },
                  { label: 'AGE', value: `${profile.age} years` },
                  { label: 'GENDER', value: profile.gender },
                  { label: 'CITY', value: profile.location },
                  { label: 'MIN BUDGET', value: `₹${profile.budget_min?.toLocaleString()}/mo` },
                  { label: 'MAX BUDGET', value: `₹${profile.budget_max?.toLocaleString()}/mo` },
                ].map(item => (
                  <div key={item.label}>
                    <div className="text-xs font-black text-gray-400 tracking-wide mb-1">{item.label}</div>
                    <div className="text-sm font-black text-gray-900">{item.value || 'Not set'}</div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black text-sm transition">
                Edit Profile
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-400 font-semibold">
                These help us find your best matches! 🎯
              </p>
              {[
                { label: 'Sleep Schedule', key: 'sleep_schedule', options: ['early bird', 'night owl'] },
                { label: 'Cleanliness', key: 'cleanliness', options: ['very clean', 'moderate', 'relaxed'] },
                { label: 'Smoking', key: 'smoking', options: ['yes', 'no', 'outside only'] },
                { label: 'Pets', key: 'pets', options: ['yes', 'no', 'allergic'] },
                { label: 'Guests', key: 'guests', options: ['often', 'sometimes', 'rarely'] },
                { label: 'Work Schedule', key: 'work_schedule', options: ['work from home', 'office', 'student'] }
              ].map(({ label, key, options }) => (
                <div key={key} className="flex justify-between items-center">
                  <label className="text-sm font-black text-gray-700">{label}</label>
                  <select
                    value={prefs[key]}
                    onChange={e => setPrefs({ ...prefs, [key]: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs font-bold text-gray-700 transition">
                    <option value="">Select...</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button onClick={savePreferences}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black text-sm transition">
                {saved ? '✅ Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-5 space-y-3">
              {[
                { icon: '🔔', label: 'Push Notifications', desc: 'Get notified about new matches' },
                { icon: '🔒', label: 'Privacy Settings', desc: 'Control who can see your profile' },
                { icon: '💳', label: 'Subscription', desc: 'Upgrade to Premium for more features' },
                { icon: '❓', label: 'Help & Support', desc: 'Get help from our team' },
                { icon: '⭐', label: 'Rate the App', desc: 'Tell us what you think' },
              ].map(item => (
                <div key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition border-2 border-gray-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</div>
                  </div>
                  <span className="text-gray-300 font-black">›</span>
                </div>
              ))}

              <button onClick={logout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-500 border-2 border-red-100 py-3 rounded-xl font-black text-sm transition mt-4">
                Logout
              </button>
            </div>
          )}

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { num: '12', label: 'Matches', icon: '❤️' },
            { num: '5', label: 'Liked you', icon: '👍' },
            { num: '3', label: 'Chats', icon: '💬' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-3 text-center border-2 border-gray-100">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-lg font-black text-red-500">{stat.num}</div>
              <div className="text-xs text-gray-400 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Profile