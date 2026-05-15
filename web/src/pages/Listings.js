import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Listings = () => {
  const { token } = useAuth()
  const [listings, setListings] = useState([])
  const [city, setCity] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
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

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const emojis = ['🏠', '🏢', '🏘', '🏗', '🏡', '🏬']
  const bgs = ['from-red-50 to-red-100', 'from-blue-50 to-blue-100', 'from-green-50 to-green-100', 'from-yellow-50 to-yellow-100', 'from-purple-50 to-purple-100', 'from-pink-50 to-pink-100']

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Room Listings 🏠</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            {listings.length} verified rooms available
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-sm transition">
          {showForm ? '✕ Cancel' : '+ Add Listing'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-3 border-b border-gray-100 flex gap-3 flex-wrap items-center">
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 gap-2 border-2 border-gray-100 flex-1 min-w-48">
          <span className="text-red-500">🔍</span>
          <input
            placeholder="Search by city or area..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="border-none outline-none text-sm text-gray-700 bg-transparent flex-1"
          />
        </div>
        {['All', 'Under ₹10k', '₹10-20k', 'Furnished', 'WiFi'].map(filter => (
          <button key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition ${activeFilter === filter
              ? 'border-red-500 text-red-500 bg-red-50'
              : 'border-gray-200 text-gray-500 bg-white hover:border-red-300'}`}>
            {filter}
          </button>
        ))}
        <select className="border-2 border-gray-200 outline-none text-xs text-gray-600 font-bold px-3 py-2 rounded-xl bg-white cursor-pointer">
          <option>Sort: Newest</option>
          <option>Sort: Price ↑</option>
          <option>Sort: Price ↓</option>
          <option>Sort: Rating</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        {[
          { num: '2,400+', label: 'Total listings' },
          { num: '95%', label: 'Verified rooms' },
          { num: '4.8★', label: 'Avg rating' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-3 text-center border-2 border-gray-100">
            <div className="text-lg font-black text-red-500">{stat.num}</div>
            <div className="text-xs text-gray-400 font-semibold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Listing Form */}
      {showForm && (
        <div className="mx-6 mb-4 bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-5">Add New Listing</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'title', label: 'TITLE', placeholder: 'e.g. Spacious 2BHK' },
                { key: 'rent', label: 'RENT (₹/month)', placeholder: '12000' },
                { key: 'location', label: 'AREA', placeholder: 'Koramangala' },
                { key: 'city', label: 'CITY', placeholder: 'Bangalore' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">DESCRIPTION</label>
              <textarea
                placeholder="Describe your room..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5 tracking-wide">AVAILABLE FROM</label>
              <input type="date" value={form.available_from}
                onChange={e => setForm({ ...form, available_from: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
                required />
            </div>
            <div className="flex gap-6">
              {['furnished', 'wifi', 'parking'].map(feature => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[feature]}
                    onChange={e => setForm({ ...form, [feature]: e.target.checked })}
                    className="w-4 h-4 accent-red-500" />
                  <span className="text-sm font-bold text-gray-700 capitalize">{feature}</span>
                </label>
              ))}
            </div>
            <button type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-black text-sm transition">
              Create Listing →
            </button>
          </form>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
        {listings.length === 0 ? (
          // Show sample cards when no listings exist
          [
            { city: 'Koramangala, Bangalore', detail: '2BHK · 2nd floor · Available now', rent: '12,000', rating: '4.9', tag: '95% match', tagColor: 'bg-red-500', idx: 0, amenities: ['🛋️ Furnished', '📶 WiFi', '🚗 Parking'] },
            { city: 'Bandra West, Mumbai', detail: '1BHK · 3rd floor · From Jun 1', rent: '18,500', rating: '4.7', tag: 'New', tagColor: 'bg-gray-900', idx: 1, amenities: ['🛋️ Semi-furnished', '📶 WiFi'] },
            { city: 'Hauz Khas, Delhi', detail: '3BHK · Ground floor · Available now', rent: '9,500', rating: '4.8', tag: '88% match', tagColor: 'bg-red-500', idx: 2, amenities: ['🛋️ Furnished', '🚗 Parking'] },
          ].map((listing, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className={`h-40 flex items-center justify-center text-5xl bg-gradient-to-br relative ${bgs[listing.idx]}`}>
                {emojis[listing.idx]}
                <span className={`absolute top-3 left-3 text-white text-xs font-black px-2.5 py-1 rounded-lg ${listing.tagColor}`}>
                  {listing.tag}
                </span>
                <button onClick={() => toggleSave(i)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-sm">
                  {saved.includes(i) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="p-4">
                <div className="text-sm font-black text-gray-900 mb-1">{listing.city}</div>
                <div className="text-xs text-gray-400 font-semibold mb-3">{listing.detail}</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {listing.amenities.map(a => (
                    <span key={a} className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 text-gray-500">{a}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-black text-gray-900">₹{listing.rent}<span className="text-xs font-normal text-gray-400">/mo</span></div>
                  <div className="text-xs font-black text-red-500">{listing.rating}★</div>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-black text-xs transition">
                  Contact Owner
                </button>
              </div>
            </div>
          ))
        ) : (
          listings.map((listing, i) => (
            <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className={`h-40 flex items-center justify-center text-5xl bg-gradient-to-br relative ${bgs[i % bgs.length]}`}>
                {emojis[i % emojis.length]}
                <span className="absolute top-3 left-3 text-white text-xs font-black px-2.5 py-1 rounded-lg bg-red-500">
                  New
                </span>
                <button onClick={() => toggleSave(listing.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-sm">
                  {saved.includes(listing.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="p-4">
                <div className="text-sm font-black text-gray-900 mb-1">{listing.title}</div>
                <div className="text-xs text-gray-400 font-semibold mb-3">
                  📍 {listing.location}, {listing.city} · 📅 From {listing.available_from}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {listing.furnished && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 text-gray-500">🛋️ Furnished</span>}
                  {listing.wifi && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 text-gray-500">📶 WiFi</span>}
                  {listing.parking && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 text-gray-500">🚗 Parking</span>}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-black text-gray-900">₹{listing.rent}<span className="text-xs font-normal text-gray-400">/mo</span></div>
                  <div className="text-xs font-black text-red-500">4.8★</div>
                </div>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{listing.description}</p>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-black text-xs transition">
                  Contact Owner
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {listings.length === 0 && (
        <p className="text-center text-xs text-gray-400 font-semibold mt-4">
          👆 Sample listings shown — add your own above!
        </p>
      )}

    </div>
  )
}

export default Listings