import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Matches = () => {
  const { token } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/matches`, { headers })
      .then(res => { setMatches(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/matches/like`,
        { receiver_id: id }, { headers })
      alert(res.data.message)
    } catch {
      alert('Could not send like. Try again.')
    }
  }

  const sampleMatches = [
    { id: 1, full_name: 'Vikram Sharma', age: 26, location: 'Delhi', score: 95, budget_min: 10000, budget_max: 15000, bio: 'Software engineer who loves cooking and early mornings.', tags: ['Early bird', 'Non-smoker', 'WFH', 'Very clean'], color: 'bg-red-50 text-red-500' },
    { id: 2, full_name: 'Priya Rao', age: 24, location: 'Bangalore', score: 88, budget_min: 8000, budget_max: 12000, bio: 'Medical student looking for a quiet and clean place.', tags: ['Night owl', 'Pet lover', 'Student', 'Moderate'], color: 'bg-blue-50 text-blue-500' },
    { id: 3, full_name: 'Arjun Mehta', age: 28, location: 'Mumbai', score: 82, budget_min: 15000, budget_max: 20000, bio: 'Finance professional who enjoys fitness and cooking.', tags: ['Early bird', 'Office', 'No pets', 'Very clean'], color: 'bg-green-50 text-green-500' },
    { id: 4, full_name: 'Sneha Patel', age: 25, location: 'Pune', score: 78, budget_min: 7000, budget_max: 10000, bio: 'Freelance designer who works from home mostly.', tags: ['Night owl', 'Pet lover', 'WFH', 'Relaxed'], color: 'bg-purple-50 text-purple-500' },
    { id: 5, full_name: 'Rahul Gupta', age: 27, location: 'Hyderabad', score: 74, budget_min: 12000, budget_max: 18000, bio: 'IT professional who loves movies and gaming.', tags: ['Night owl', 'Non-smoker', 'Office', 'Moderate'], color: 'bg-yellow-50 text-yellow-600' },
    { id: 6, full_name: 'Ananya Singh', age: 23, location: 'Chennai', score: 70, budget_min: 6000, budget_max: 9000, bio: 'Engineering student looking for budget-friendly options.', tags: ['Early bird', 'No pets', 'Student', 'Very clean'], color: 'bg-pink-50 text-pink-500' },
  ]

  const displayMatches = matches.length > 0 ? matches : sampleMatches

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-400 font-bold">Finding your matches...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Matches 💜</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">
          Ranked by lifestyle compatibility
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
        {['All', 'Students', 'Working Professionals', 'WFH', 'Pet Lovers', 'Non-smokers'].map(filter => (
          <button key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition ${activeFilter === filter
              ? 'border-red-500 text-red-500 bg-red-50'
              : 'border-gray-200 text-gray-500 bg-white hover:border-red-300'}`}>
            {filter}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        {[
          { num: displayMatches.length, label: 'Total matches' },
          { num: `${displayMatches[0]?.score || 95}%`, label: 'Top match' },
          { num: '6', label: 'Preferences used' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-3 text-center border-2 border-gray-100">
            <div className="text-lg font-black text-red-500">{stat.num}</div>
            <div className="text-xs text-gray-400 font-semibold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
        {displayMatches.map((match) => (
          <div key={match.id}
            className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-md transition cursor-pointer">

            {/* Top section */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 ${match.color || 'bg-red-50 text-red-500'}`}>
                {match.full_name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-gray-900">{match.full_name}, {match.age}</div>
                <div className="text-xs text-gray-400 font-semibold mt-0.5">📍 {match.location}</div>
              </div>
              <div className="text-2xl font-black text-red-500 flex-shrink-0">
                {match.score}%
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
              <div className="bg-red-500 h-1.5 rounded-full transition-all"
                style={{ width: `${match.score}%` }}>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(match.tags || []).map(tag => (
                <span key={tag} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio */}
            {match.bio && (
              <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 leading-relaxed">
                {match.bio}
              </p>
            )}

            {/* Budget */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-400 font-semibold">Budget</span>
              <span className="text-xs font-black text-gray-900">
                ₹{match.budget_min?.toLocaleString()} - ₹{match.budget_max?.toLocaleString()}/mo
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLike(match.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-black text-xs transition">
                ❤️ Like
              </button>
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl font-black text-xs transition border-2 border-gray-100">
                💬 Message
              </button>
            </div>

          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <p className="text-center text-xs text-gray-400 font-semibold mt-4 pb-6">
          👆 Sample matches shown — complete your preferences to see real matches!
        </p>
      )}

    </div>
  )
}

export default Matches