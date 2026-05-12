import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      {/* Sticky Top Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link to="/" className="text-xl font-black tracking-tight">
            <span className="text-red-500">Room</span>
            <span className="text-gray-900">Match</span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/listings"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  Listings
                </Link>
                <Link to="/matches"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  Matches
                </Link>
                <Link to="/chat"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  Chat
                </Link>
                <Link to="/profile"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  Profile
                </Link>
                <button onClick={handleLogout}
                  className="text-sm font-black text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  Login
                </Link>
                <Link to="/signup"
                  className="text-sm font-black text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                  Sign up free
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* Sticky Bottom Footer — only show when logged in */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around py-2">
          {[
            { to: '/', icon: '🏠', label: 'Home' },
            { to: '/listings', icon: '🏢', label: 'Listings' },
            { to: '/matches', icon: '❤️', label: 'Matches' },
            { to: '/chat', icon: '💬', label: 'Chat' },
            { to: '/profile', icon: '👤', label: 'Profile' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex flex-col items-center gap-1 px-4 py-1 group">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-bold text-gray-400 group-hover:text-red-500 transition">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default Navbar