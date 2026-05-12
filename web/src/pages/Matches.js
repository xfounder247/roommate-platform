import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Matches = () => {
  const { token } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Finding your matches... 🔍</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Matches 💜</h1>
          <p className="text-gray-500">People who match your lifestyle and preferences</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-500">Complete your preferences to start matching!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
              <div key={match.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition">

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-bold text-rose-500">
                    {match.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{match.full_name}</h3>
                    <p className="text-sm text-gray-500">📍 {match.location}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-gray-900">₹{match.budget_min} - ₹{match.budget_max}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Match Score</span>
                    <span className="font-medium text-rose-500">{match.score}%</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all"
                    style={{ width: `${match.score}%` }}>
                  </div>
                </div>

                {match.bio && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{match.bio}</p>
                )}

                <button
                  onClick={() => handleLike(match.id)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-medium transition text-sm">
                  ❤️ Like
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Matches