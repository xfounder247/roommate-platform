import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-tight">
            <span className="text-red-500">Room</span>
            <span className="text-gray-900">Match</span>
          </Link>

          {/* Desktop Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/listings" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Listings</Link>
              <Link to="/matches" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Matches</Link>
              <Link to="/chat" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Chat</Link>
              <Link to="/profile" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Profile</Link>
              <button onClick={handleLogout} className="text-sm font-black text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">Logout</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">Login</Link>
              <Link to="/signup" className="text-sm font-black text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">Sign up free</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <div className="flex md:hidden items-center gap-2">
              <Link to="/login" className="text-sm font-bold text-gray-500 px-3 py-2">Login</Link>
              <Link to="/signup" className="text-sm font-black text-white bg-red-500 px-3 py-2 rounded-lg">Sign up</Link>
            </div>
          )}

          {/* Mobile logged in — show nothing, use bottom nav */}
          {user && (
            <div className="flex md:hidden items-center gap-2">
              <button onClick={handleLogout} className="text-xs font-black text-white bg-red-500 px-3 py-2 rounded-lg">Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation — Mobile Only */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around py-2 md:hidden">
          {[
            { to: '/', icon: '🏠', label: 'Home' },
            { to: '/listings', icon: '🏢', label: 'Listings' },
            { to: '/matches', icon: '❤️', label: 'Matches' },
            { to: '/chat', icon: '💬', label: 'Chat' },
            { to: '/profile', icon: '👤', label: 'Profile' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex flex-col items-center gap-0.5 px-3 py-1">
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-bold ${isActive(item.to) ? 'text-red-500' : 'text-gray-400'}`}>
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
