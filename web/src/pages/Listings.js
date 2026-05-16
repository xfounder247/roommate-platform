import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabaseClient'

const Listings = () => {
  const { token, user } = useAuth()
  const [listings, setListings] = useState([])
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

  const fetchListings = () => {
    const url = city
      ? `${process.env.REACT_APP_API_URL}/api/listings?city=${city}`
      : `${process.env.REACT_APP_API_URL}/api/listings`
    axios.get(url, { headers }).then(res => setListings(res.data)).catch(() => {})
  }

  useEffect(() => { fetchListings() }, [city])

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

      const { data } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName)

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

  const sampleListings = [
    { id: 's1', city: 'Koramangala, Bangalore', detail: '2BHK · Furnished · WiFi', rent: '12,000', rating: '4.9', tag: '95% match', tagColor: 'bg-red-500', idx: 0, amenities: ['🛋️ Furnished', '📶 WiFi', '🚗 Parking'] },
    { id: 's2', city: 'Bandra West, Mumbai', detail: '1BHK · Semi-furnished', rent: '18,500', rating: '4.7', tag: 'New', tagColor: 'bg-gray-900', idx: 1, amenities: ['🛋️ Semi-furnished', '📶 WiFi'] },
    { id: 's3', city: 'Hauz Khas, Delhi', detail: '3BHK · Fully furnished', rent: '9,500', rating: '4.8', tag: '88% match', tagColor: 'bg-red-500', idx: 2, amenities: ['🛋️ Furnished', '🚗 Parking'] },
    { id: 's4', city: 'Hitech City, Hyderabad', detail: '2BHK · Furnished · Gym', rent: '14,000', rating: '4.6', tag: 'New', tagColor: 'bg-gray-900', idx: 3, amenities: ['🛋️ Furnished', '📶 WiFi', '🏋️ Gym'] },
  ]

  const displayListings = listings.length > 0 ? listings : sampleListings

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Room Listings 🏠</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            {displayListings.length} rooms available
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs transition">
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2 border-2 border-gray-100 mb-3">
          <span className="text-red-500">🔍</span>
          <input
            placeholder="Search by city or area..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="border-none outline-none text-sm text-gray-700 bg-transparent flex-1"
          />
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
          { num: '2,400+', label: 'Listings' },
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
                  <input
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">DESCRIPTION</label>
              <textarea
                placeholder="Describe your room..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1 tracking-wide">AVAILABLE FROM</label>
              <input type="date" value={form.available_from}
                onChange={e => setForm({ ...form, available_from: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-xs text-gray-700 transition"
                required />
            </div>

            {/* Photo Upload */}
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
                    <img key={i} src={url} alt="room"
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
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

      {/* Listings Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {displayListings.map((listing, i) => (
          <div key={listing.id || i}
            className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer">
            {/* Show real photo if available */}
            {listing.photos?.[0] ? (
              <img src={listing.photos[0]} alt="room"
                className="w-full h-28 object-cover" />
            ) : (
              <div className={`h-28 flex items-center justify-center text-4xl relative ${bgs[(listing.idx !== undefined ? listing.idx : i) % bgs.length]}`}>
                {emojis[(listing.idx !== undefined ? listing.idx : i) % emojis.length]}
                <span className={`absolute top-2 left-2 text-white text-xs font-black px-1.5 py-0.5 rounded ${listing.tagColor || 'bg-red-500'}`}>
                  {listing.tag || 'New'}
                </span>
              </div>
            )}
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
                  ₹{listing.rent}<span className="text-xs font-normal text-gray-400">/mo</span>
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

      {listings.length === 0 && (
        <p className="text-center text-xs text-gray-400 font-semibold mt-3 pb-4">
          👆 Sample listings — add your own above!
        </p>
      )}

    </div>
  )
}

export default Listings
