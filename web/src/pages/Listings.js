import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Listings = () => {
  const { token } = useAuth()
  const [listings, setListings] = useState([])
  const [city, setCity] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', rent: '', location: '',
    city: '', available_from: '', furnished: false, wifi: false, parking: false
  })
  const headers = { Authorization: `Bearer ${token}` }

  const fetchListings = () => {
    const url = city
      ? `${process.env.REACT_APP_API_URL}/api/listings?city=${city}`
      : `${process.env.REACT_APP_API_URL}/api/listings`
    axios.get(url, { headers }).then(res => setListings(res.data))
  }

  useEffect(() => { fetchListings() }, [city])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/listings`, form, { headers })
      alert('Listing created!')
      setShowForm(false)
      fetchListings()
    } catch {
      alert('Could not create listing.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Room Listings 🏠</h1>
            <p className="text-gray-500">Find your perfect room</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-medium transition">
            {showForm ? 'Cancel' : '+ Add Listing'}
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-8 gap-3">
          <span className="text-gray-400">🔍</span>
          <input
            placeholder="Filter by city..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
          />
        </div>

        {/* Add Listing Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">New Listing</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['title', 'rent', 'location', 'city'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field}</label>
                    <input
                      placeholder={field}
                      value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-gray-700 transition"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your room..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-gray-700 transition"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                <input
                  type="date"
                  value={form.available_from}
                  onChange={e => setForm({ ...form, available_from: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-gray-700 transition"
                  required
                />
              </div>
              <div className="flex gap-6">
                {['furnished', 'wifi', 'parking'].map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[feature]}
                      onChange={e => setForm({ ...form, [feature]: e.target.checked })}
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{feature}</span>
                  </label>
                ))}
              </div>
              <button type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-medium transition">
                Create Listing
              </button>
            </form>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="bg-rose-50 h-48 flex items-center justify-center">
                <span className="text-6xl">🏠</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-500 mb-3">📍 {listing.location}, {listing.city}</p>
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  ₹{listing.rent}<span className="text-sm font-normal text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">📅 Available from {listing.available_from}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.furnished && <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full">🛋️ Furnished</span>}
                  {listing.wifi && <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full">📶 WiFi</span>}
                  {listing.parking && <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full">🚗 Parking</span>}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{listing.description}</p>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500">Be the first to add a listing!</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Listings