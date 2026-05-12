import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-rose-500 tracking-tight">
          RoomMatch
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/listings"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Listings
              </Link>
              <Link to="/matches"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Matches
              </Link>
              <Link to="/chat"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Chat
              </Link>
              <Link to="/profile"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Profile
              </Link>
              <button onClick={handleLogout}
                className="text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-5 py-2 rounded-full transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Login
              </Link>
              <Link to="/signup"
                className="text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-5 py-2 rounded-full transition">
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar