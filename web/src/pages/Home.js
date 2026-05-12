import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Find your perfect
          <span className="text-rose-500"> roommate</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Match with compatible roommates based on your lifestyle, budget and preferences — not just location.
        </p>

        {/* Search Bar */}
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-6 py-3 max-w-2xl mx-auto shadow-sm mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by city, budget or lifestyle..."
            className="flex-1 outline-none text-gray-700 text-base bg-transparent"
          />
          <Link to="/signup"
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-medium transition">
            Search
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['Under ₹15k', 'Pet friendly', 'Non-smoking', 'Work from home', 'Furnished', 'WiFi included'].map(filter => (
            <span key={filter}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-gray-400 cursor-pointer transition">
              {filter}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-20">
          {[
            { number: '10,000+', label: 'Happy roommates' },
            { number: '500+', label: 'Cities covered' },
            { number: '95%', label: 'Match accuracy' }
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why RoomMatch?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '❤️', title: 'Smart Matching', desc: 'Our algorithm matches you by sleep schedule, cleanliness, pets, smoking and more — not just location.' },
              { icon: '🏠', title: 'Room Listings', desc: 'Browse thousands of verified room listings with photos, amenities and availability dates.' },
              { icon: '💬', title: 'Live Chat', desc: 'Chat instantly with your matches. No phone numbers needed until you are ready.' }
            ].map(feature => (
              <div key={feature.title}
                className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to find your roommate?
        </h2>
        <p className="text-xl text-gray-500 mb-10">
          Join thousands of people who found their perfect roommate on RoomMatch.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup"
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full text-lg font-medium transition">
            Get started for free
          </Link>
          <Link to="/login"
            className="border border-gray-200 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-full text-lg font-medium transition">
            I have an account
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home