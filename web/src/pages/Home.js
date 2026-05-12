import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const categories = [
    { icon: '🎓', name: 'Students', count: '3,100+ people', color: 'bg-purple-50 border-purple-200' },
    { icon: '💼', name: 'Working Professionals', count: '4,200+ people', color: 'bg-blue-50 border-blue-200' },
    { icon: '💻', name: 'Work from Home', count: '2,400+ people', color: 'bg-green-50 border-green-200' },
    { icon: '🏥', name: 'Medical Staff', count: '600+ people', color: 'bg-yellow-50 border-yellow-200' },
    { icon: '🎨', name: 'Freelancers', count: '900+ people', color: 'bg-pink-50 border-pink-200' },
    { icon: '🐾', name: 'Pet Lovers', count: '800+ people', color: 'bg-orange-50 border-orange-200' },
    { icon: '🌙', name: 'Night Owls', count: '1,200+ people', color: 'bg-indigo-50 border-indigo-200' },
    { icon: '🏃', name: 'Fitness Lovers', count: '700+ people', color: 'bg-teal-50 border-teal-200' },
  ]

  const listings = [
    { city: 'Koramangala, Blr', detail: '2BHK · Furnished · WiFi', price: '12,000', rating: '4.9', tag: '95% match', tagColor: 'bg-red-500', bg: 'bg-red-50', emoji: '🏠' },
    { city: 'Bandra West, Mum', detail: '1BHK · Semi-furnished', price: '18,500', rating: '4.7', tag: 'New', tagColor: 'bg-gray-900', bg: 'bg-blue-50', emoji: '🏢' },
    { city: 'Hauz Khas, Delhi', detail: '3BHK · Fully furnished', price: '9,500', rating: '4.8', tag: '88% match', tagColor: 'bg-red-500', bg: 'bg-green-50', emoji: '🏘' },
    { city: 'Hitech City, Hyd', detail: '2BHK · Furnished · Gym', price: '14,000', rating: '4.6', tag: 'New', tagColor: 'bg-gray-900', bg: 'bg-yellow-50', emoji: '🏗' },
  ]

  const matches = [
    { initials: 'VS', name: 'Vikram Sharma, 26 · Delhi', tags: ['Early bird', 'Non-smoker', 'WFH', 'Very clean'], score: '95', color: 'bg-red-50 text-red-500' },
    { initials: 'PR', name: 'Priya Rao, 24 · Bangalore', tags: ['Night owl', 'Pet lover', 'Student', 'Moderate'], score: '88', color: 'bg-blue-50 text-blue-600' },
    { initials: 'AM', name: 'Arjun Mehta, 28 · Mumbai', tags: ['Early bird', 'Office', 'No pets', 'Very clean'], score: '82', color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-red-500 px-6 py-10 flex gap-6 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-full text-xs font-bold mb-4">
            ⚡ India's #1 Roommate Platform
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-3 tracking-tight">
            Find a roommate<br />you'll actually<br />love living with.
          </h1>
          <p className="text-sm text-red-100 mb-6 leading-relaxed max-w-sm">
            Match by sleep schedule, lifestyle, habits and budget — not just location.
          </p>
          <div className="flex gap-3">
            <Link to="/signup"
              className="bg-white text-red-500 px-5 py-2.5 rounded-lg text-sm font-black hover:bg-red-50 transition">
              Find my match
            </Link>
            <Link to="/listings"
              className="border-2 border-white border-opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-white hover:bg-opacity-10 transition">
              Browse rooms
            </Link>
          </div>
        </div>

        {/* Match Pills */}
        <div className="flex flex-col gap-2 w-52 flex-shrink-0">
          {[
            { initials: 'VS', name: 'Vikram, 26', loc: 'Delhi · Non-smoker', score: '95%', color: 'bg-red-100 text-red-500' },
            { initials: 'PR', name: 'Priya, 24', loc: 'Bangalore · Pet lover', score: '88%', color: 'bg-blue-100 text-blue-600' },
            { initials: 'AM', name: 'Arjun, 28', loc: 'Mumbai · WFH', score: '82%', color: 'bg-green-100 text-green-600' },
          ].map(p => (
            <div key={p.name} className="bg-white rounded-xl p-3 flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${p.color}`}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-400 truncate">{p.loc}</div>
              </div>
              <div className="text-sm font-black text-red-500">{p.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-6 py-4 border-b-4 border-red-500">
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-3 border-2 border-gray-100">
          <span className="text-red-500 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by city, area or lifestyle..."
            className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent"
          />
          <div className="w-px h-6 bg-gray-200"></div>
          <select className="border-none outline-none text-xs text-gray-600 font-bold bg-transparent">
            <option>Any budget</option>
            <option>Under ₹10k</option>
            <option>₹10k - ₹20k</option>
            <option>Above ₹20k</option>
          </select>
          <div className="w-px h-6 bg-gray-200"></div>
          <select className="border-none outline-none text-xs text-gray-600 font-bold bg-transparent">
            <option>Any type</option>
            <option>1BHK</option>
            <option>2BHK</option>
            <option>3BHK</option>
          </select>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-red-600 transition">
            Search
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['All', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Gurugram'].map((city, i) => (
            <span key={city}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border-2 transition ${i === 0
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-gray-200 text-gray-500 bg-white hover:border-red-300'}`}>
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 bg-gray-900">
        {[
          { num: '50K+', label: 'Roommates' },
          { num: '100+', label: 'Cities' },
          { num: '95%', label: 'Accuracy' },
          { num: '4.8★', label: 'Rating' },
        ].map(stat => (
          <div key={stat.label} className="py-3 text-center border-r border-gray-700 last:border-0">
            <div className="text-lg font-black text-red-500">{stat.num}</div>
            <div className="text-xs text-gray-400 font-bold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="px-6 py-8 bg-gray-50">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Browse by category</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Find people who match your lifestyle</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map(cat => (
            <div key={cat.name}
              onClick={() => navigate('/matches')}
              className={`rounded-xl p-4 text-center cursor-pointer border-2 hover:shadow-sm transition ${cat.color}`}>
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-xs font-black text-gray-900 leading-tight">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1 font-semibold">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-6 py-8 bg-white">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Rooms near you</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Verified listings with match scores</p>
          </div>
          <Link to="/listings" className="text-xs text-red-500 font-black">See all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {listings.map(listing => (
            <div key={listing.city}
              onClick={() => navigate('/listings')}
              className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 cursor-pointer hover:shadow-md transition">
              <div className={`h-28 flex items-center justify-center text-4xl relative ${listing.bg}`}>
                {listing.emoji}
                <span className={`absolute top-2 left-2 text-white text-xs font-black px-2 py-0.5 rounded ${listing.tagColor}`}>
                  {listing.tag}
                </span>
              </div>
              <div className="p-3">
                <div className="text-xs font-black text-gray-900 mb-1">{listing.city}</div>
                <div className="text-xs text-gray-400 font-semibold mb-2">{listing.detail}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-black text-gray-900">₹{listing.price}<span className="text-xs font-normal text-gray-400">/mo</span></div>
                  <div className="text-xs font-black text-red-500">{listing.rating}★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matches */}
      <div className="px-6 py-8 bg-gray-50">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Your top matches</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Ranked by lifestyle compatibility</p>
          </div>
          <Link to="/matches" className="text-xs text-red-500 font-black">See all →</Link>
        </div>
        <div className="flex flex-col gap-3">
          {matches.map(match => (
            <div key={match.name}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100 cursor-pointer hover:shadow-sm transition">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${match.color}`}>
                {match.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-gray-900 mb-1">{match.name}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {match.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-lg font-black text-red-500">{match.score}%</div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/matches') }}
                  className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gray-900 px-6 py-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white mb-1">Your perfect roommate is waiting.</h2>
          <p className="text-xs text-gray-400 font-semibold">Join 50,000+ people who found their match on RoomMatch</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link to="/signup"
            className="bg-red-500 text-white px-5 py-3 rounded-lg text-sm font-black hover:bg-red-600 transition">
            Find my match
          </Link>
          <Link to="/listings"
            className="border-2 border-gray-600 text-white px-5 py-3 rounded-lg text-sm font-bold hover:border-gray-400 transition">
            Browse rooms
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home