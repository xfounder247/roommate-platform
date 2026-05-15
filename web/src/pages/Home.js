import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const categories = [
    { icon: '🎓', name: 'Students', count: '3,100+', color: 'bg-purple-50 border-purple-200' },
    { icon: '💼', name: 'Working Pro', count: '4,200+', color: 'bg-blue-50 border-blue-200' },
    { icon: '💻', name: 'WFH', count: '2,400+', color: 'bg-green-50 border-green-200' },
    { icon: '🏥', name: 'Medical', count: '600+', color: 'bg-yellow-50 border-yellow-200' },
    { icon: '🎨', name: 'Freelancers', count: '900+', color: 'bg-pink-50 border-pink-200' },
    { icon: '🐾', name: 'Pet Lovers', count: '800+', color: 'bg-orange-50 border-orange-200' },
    { icon: '🌙', name: 'Night Owls', count: '1,200+', color: 'bg-indigo-50 border-indigo-200' },
    { icon: '🏃', name: 'Fitness', count: '700+', color: 'bg-teal-50 border-teal-200' },
  ]

  const listings = [
    { city: 'Koramangala, Blr', detail: '2BHK · Furnished · WiFi', price: '12,000', rating: '4.9', tag: '95% match', tagColor: 'bg-red-500', bg: 'bg-red-50', emoji: '🏠' },
    { city: 'Bandra West, Mum', detail: '1BHK · Semi-furnished', price: '18,500', rating: '4.7', tag: 'New', tagColor: 'bg-gray-900', bg: 'bg-blue-50', emoji: '🏢' },
    { city: 'Hauz Khas, Delhi', detail: '3BHK · Fully furnished', price: '9,500', rating: '4.8', tag: '88% match', tagColor: 'bg-red-500', bg: 'bg-green-50', emoji: '🏘' },
    { city: 'Hitech City, Hyd', detail: '2BHK · Furnished · Gym', price: '14,000', rating: '4.6', tag: 'New', tagColor: 'bg-gray-900', bg: 'bg-yellow-50', emoji: '🏗' },
  ]

  const matches = [
    { initials: 'VS', name: 'Vikram Sharma, 26', location: 'Delhi', tags: ['Early bird', 'Non-smoker'], score: '95', color: 'bg-red-50 text-red-500' },
    { initials: 'PR', name: 'Priya Rao, 24', location: 'Bangalore', tags: ['Night owl', 'Pet lover'], score: '88', color: 'bg-blue-50 text-blue-500' },
    { initials: 'AM', name: 'Arjun Mehta, 28', location: 'Mumbai', tags: ['Early bird', 'WFH'], score: '82', color: 'bg-green-50 text-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero Section */}
      <div className="bg-red-500 px-4 py-8">
        <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-full text-xs font-bold mb-4">
          ⚡ India's #1 Roommate Platform
        </div>
        <h1 className="text-2xl font-black text-white leading-tight mb-2 tracking-tight">
          Find a roommate you'll actually love living with.
        </h1>
        <p className="text-xs text-red-100 mb-5 leading-relaxed">
          Match by lifestyle, habits and budget — not just location.
        </p>
        <div className="flex gap-2">
          <Link to="/signup"
            className="bg-white text-red-500 px-4 py-2.5 rounded-lg text-xs font-black hover:bg-red-50 transition flex-1 text-center">
            Find my match
          </Link>
          <Link to="/listings"
            className="border-2 border-white border-opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-white hover:bg-opacity-10 transition flex-1 text-center">
            Browse rooms
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-3 border-b-4 border-red-500">
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2 border-2 border-gray-100">
          <span className="text-red-500">🔍</span>
          <input
            type="text"
            placeholder="Search by city or lifestyle..."
            className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent"
          />
          <button className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-black">
            Search
          </button>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {['All', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'].map((city, i) => (
            <span key={city}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border-2 transition flex-shrink-0 ${i === 0
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-gray-200 text-gray-500 bg-white'}`}>
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 bg-gray-900">
        {[
          { num: '50K+', label: 'Users' },
          { num: '100+', label: 'Cities' },
          { num: '95%', label: 'Accuracy' },
          { num: '4.8★', label: 'Rating' },
        ].map(stat => (
          <div key={stat.label} className="py-2.5 text-center border-r border-gray-700 last:border-0">
            <div className="text-sm font-black text-red-500">{stat.num}</div>
            <div className="text-xs text-gray-400 font-bold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="px-4 py-5 bg-gray-50">
        <div className="mb-3">
          <h2 className="text-base font-black text-gray-900">Browse by category</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Find people who match your lifestyle</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(cat => (
            <div key={cat.name}
              onClick={() => navigate('/matches')}
              className={`rounded-xl p-2.5 text-center cursor-pointer border-2 ${cat.color}`}>
              <div className="text-xl mb-1">{cat.icon}</div>
              <div className="text-xs font-black text-gray-900 leading-tight">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-semibold">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 py-5 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-base font-black text-gray-900">Rooms near you</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Verified listings</p>
          </div>
          <Link to="/listings" className="text-xs text-red-500 font-black">See all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {listings.map(listing => (
            <div key={listing.city}
              onClick={() => navigate('/listings')}
              className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 cursor-pointer">
              <div className={`h-24 flex items-center justify-center text-3xl relative ${listing.bg}`}>
                {listing.emoji}
                <span className={`absolute top-2 left-2 text-white text-xs font-black px-1.5 py-0.5 rounded ${listing.tagColor}`}>
                  {listing.tag}
                </span>
              </div>
              <div className="p-2.5">
                <div className="text-xs font-black text-gray-900 mb-0.5 truncate">{listing.city}</div>
                <div className="text-xs text-gray-400 font-semibold mb-1.5 truncate">{listing.detail}</div>
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
      <div className="px-4 py-5 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-base font-black text-gray-900">Top matches</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">By lifestyle compatibility</p>
          </div>
          <Link to="/matches" className="text-xs text-red-500 font-black">See all →</Link>
        </div>
        <div className="flex flex-col gap-2">
          {matches.map(match => (
            <div key={match.name}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${match.color}`}>
                {match.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-gray-900 truncate">{match.name}</div>
                <div className="text-xs text-gray-400 truncate">📍 {match.location}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {match.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="text-base font-black text-red-500">{match.score}%</div>
                <button className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 px-4 py-6 text-center">
        <h2 className="text-lg font-black text-white mb-1">Your perfect roommate is waiting.</h2>
        <p className="text-xs text-gray-400 font-semibold mb-4">Join 50,000+ people on RoomMatch</p>
        <div className="flex gap-2">
          <Link to="/signup"
            className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-black">
            Find my match
          </Link>
          <Link to="/listings"
            className="flex-1 border-2 border-gray-600 text-white py-3 rounded-xl text-sm font-bold">
            Browse rooms
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home
