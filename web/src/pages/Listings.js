import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabaseClient'

const Listings = () => {
  const { token, user } = useAuth()
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [city, setCity] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', rent: '', location: '',
    city: '', available_from: '', furnished: false, wifi: false, parking: false
  })
  const headers = { Authorization: `Bearer ${token}` }

  const sampleListings = [
    { id: 's1', city: 'Koramangala, Bangalore', title: 'Spacious 2BHK', detail: '2BHK · Furnished · WiFi', rent: 12000, rating: '4.9', tag: '95% match', tagColor: 'bg-red-500', idx: 0, amenities: ['🛋️ Furnished', '📶 WiFi', '🚗 Parking'], furnished: true, wifi: true, parking: true },
    { id: 's2', city: 'Bandra West, Mumbai', title: 'Cozy 1BHK', detail: '1BHK · Semi-furnished', rent: 18500, rating: '4.7', tag: 'New', tagColor: 'bg-gray-900', idx: 1, amenities: ['🛋️ Semi-furnished', '📶 WiFi'], furnished: true, wifi: true, parking: false },
    { id: 's3', city: 'Hauz Khas, Delhi', title: 'Modern 3BHK', detail: '3BHK · Fully furnished', rent: 9500, rating: '4.8', tag: '88% match', tagColor: 'bg-red-500', idx: 2, amenities: ['🛋️ Furnished', '🚗 Parking'], furnished: true, wifi: false, parking: true },
    { id: 's4', city: 'Hitech City, Hyderabad', title: 'Premium 2BHK', detail: '2BHK · Furnished · Gym', rent: 14000, rating: '4.6', tag: 'New', tagColor: 'bg-gray-900', idx: 3, amenities: ['🛋️ Furnished', '📶 WiFi', '🏋️ Gym'], furnished: true, wifi: true, parking: false },
    { id: 's5', city: 'Koramangala, Bangalore', title: 'Budget 1BHK', detail: '1BHK · Semi-furnished', rent: 8000, rating: '4.5', tag: 'New', tagColor: 'bg-gray-900', idx: 4, amenities: ['📶 WiFi'], furnished: false, wifi: true, parking: false },
    { id: 's6', city: 'Connaught Place, Delhi', title: 'Luxury Studio', detail: 'Studio · Fully furnished', rent: 22000, rating: '4.9', tag: 'Premium', tagColor: 'bg-red-500', idx: 5, amenities: ['🛋️ Furnished', '📶 WiFi', '🚗 Parking'], furnished: true, wifi: true, parking: true },
  ]

  const fetchListings = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/listings`, { headers })
      .then(res => {
        const data = res.data.length > 0 ? res.data : sampleListings
        setListings(data)
        setFiltered(data)
      })
      .catch(() => {
        setListings(sampleListings)
        setFiltered(sampleListings)
      })
  }

  useEffect(() => { fetchListings() }, [])

  // Search & Filter Logic
  useEffect(() => {
    let result = listings

    // Search by city
    if (city) {
      result = result.filter(l =>
        (l.city || '').toLowerCase().includes(city.toLowerCase()) ||
        (l.title || '').toLowerCase().includes(city.toLowerCase()) ||
        (l.location || '').toLowerCase().includes(city.toLowerCase())
      )
    }

    // Filter chips
    if (activeFilter === 'Under ₹10k') {
      result = result.filter(l => parseInt(l.rent) < 10000)
    } else if (activeFilter === '₹10-20k') {
      result = result.filter(l => parseInt(l.rent) >= 10000 && parseInt(l.rent) <= 20000)
    } else if (activeFilter === 'Furnished') {
      result = result.filter(l => l.furnished === true)
    } else if (activeFilter === 'WiFi') {
      result = result.filter(l => l.wifi === true)
    }

    setFiltered(result)
  }, [city, activeFilter, listings])

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `listing-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage
        .from('listings')
        .upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('listings').getPublicUrl(fileName)
      setUploadedPhotos(prev => [...prev, data.publicUrl])
      alert('Photo uploaded! ✅')
    } catch {
      alert('Could not upload photo.')
    }
    setUploading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/listings`,
        { ...form, photos: uploadedPhotos }, { headers })
      alert('Listing created!')
      setShowForm(false)
      setUploadedPhotos([])
      fetchListings()
    } catch {
      alert('Could not create listing.')
    }
  }

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const emojis = ['🏠', '🏢', '🏘', '🏗', '🏡', '🏬']
  const bgs = ['bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50', 'bg-pink-50']

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Room Listings 🏠</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            {filtered.length} rooms found
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs transition">
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2 border-2 border-gray-100 mb-3">
          <span className="text-red-500">🔍</span>
          <input
            placeholder="Search by city, area or title..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="border-none outline-none text-sm text-gray-700 bg-transparent flex-1"
          />
          {city && (
            <button onClick={() => setCity('')} className="text-gray-400 font-black text-sm">✕</button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Under ₹10k', '₹10-20k', 'Furnished', 'WiFi'].map(filter => (
            <button key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition flex-shrink-0 ${activeFilter === filter
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-gray-200 text-gray-500 bg-white'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        {[
          { num: `${filtered.length}`, label: 'Found' },
          { num: '95%', label: 'Verified' },
          { num: '4.8★', label: 'Rating' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-2.5 text-center border-2 border-gray-100">
            <div className="text-sm font-black text-red-500">{stat.num}</div>
            <div className="text-xs text-gray-400 font-semibold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Listing Form */}
      {showForm && (
        <div className="mx-4 mb-3 bg-white rounded-2xl border-2 border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900 mb-4">Add New Listing</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'title', label: 'TITLE', placeholder: '2BHK in Delhi' },
                { key: 'rent', label: 'RENT (₹)', placeholder: '12000' },
                { key: 'location', label: 'AREA', placeholder: 'Koramangala' },
                { key: 'city', label: 'CITY', placeholder: 'Bangalore' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">{field.label}</label>
                  <input placeholder={field.placeholder} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                    required />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">DESCRIPTION</label>
              <textarea placeholder="Describe your room..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                rows={3} />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">AVAILABLE FROM</label>
              <input type="date" value={form.available_from}
                onChange={e => setForm({ ...form, available_from: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                required />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">ROOM PHOTOS</label>
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer">
                <span className="text-lg">📷</span>
                <span className="text-xs font-bold text-gray-500">
                  {uploading ? 'Uploading...' : `Tap to add photo (${uploadedPhotos.length} added)`}
                </span>
                <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
              </label>
              {uploadedPhotos.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {uploadedPhotos.map((url, i) => (
                    <img key={i} src={url} alt="room" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {['furnished', 'wifi', 'parking'].map(feature => (
                <label key={feature} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form[feature]}
                    onChange={e => setForm({ ...form, [feature]: e.target.checked })}
                    className="w-4 h-4 accent-red-500" />
                  <span className="text-xs font-bold text-gray-700 capitalize">{feature}</span>
                </label>
              ))}
            </div>
            <button type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black text-sm transition">
              Create Listing →
            </button>
          </form>
        </div>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-sm font-black text-gray-900 mb-1">No listings found</p>
          <p className="text-xs text-gray-400 font-semibold">Try a different search or filter</p>
          <button onClick={() => { setCity(''); setActiveFilter('All') }}
            className="mt-4 bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-xs">
            Clear filters
          </button>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.map((listing, i) => (
          <div key={listing.id || i}
            className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer relative">
            {listing.photos?.[0] ? (
              <img src={listing.photos[0]} alt="room" className="w-full h-28 object-cover" />
            ) : (
              <div className={`h-28 flex items-center justify-center text-4xl ${bgs[(listing.idx !== undefined ? listing.idx : i) % bgs.length]}`}>
                {emojis[(listing.idx !== undefined ? listing.idx : i) % emojis.length]}
              </div>
            )}
            <span className={`absolute top-2 left-2 text-white text-xs font-black px-1.5 py-0.5 rounded ${listing.tagColor || 'bg-red-500'}`}>
              {listing.tag || 'New'}
            </span>
            <button onClick={() => toggleSave(listing.id || i)}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-xs">
              {saved.includes(listing.id || i) ? '❤️' : '🤍'}
            </button>
            <div className="p-3">
              <div className="text-xs font-black text-gray-900 mb-0.5 truncate">
                {listing.city || listing.title}
              </div>
              <div className="text-xs text-gray-400 font-semibold mb-2 truncate">
                {listing.detail || `📍 ${listing.location}, ${listing.city}`}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {(listing.amenities || [
                  listing.furnished && '🛋️ Furnished',
                  listing.wifi && '📶 WiFi',
                  listing.parking && '🚗 Parking',
                ].filter(Boolean)).slice(0, 2).map(a => (
                  <span key={a} className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">{a}</span>
                ))}
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-black text-gray-900">
                  ₹{parseInt(listing.rent).toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span>
                </div>
                <div className="text-xs font-black text-red-500">{listing.rating || '4.8'}★</div>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-black text-xs transition">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Listings
