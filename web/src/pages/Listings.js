import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import supabase from '../supabaseClient'

const listingSteps = [
  { id: 1, title: 'What type of room?', subtitle: 'Select the room type' },
  { id: 2, title: 'Where is it located?', subtitle: 'City and area details' },
  { id: 3, title: "What's the rent?", subtitle: 'Monthly rent amount' },
  { id: 4, title: 'What amenities?', subtitle: 'Select all that apply' },
  { id: 5, title: 'When is it available?', subtitle: 'Move-in date' },
  { id: 6, title: 'Add photos', subtitle: 'Show your room to potential roommates' },
  { id: 7, title: 'Describe your room', subtitle: 'Tell us more about it' },
]

const Listings = () => {
  const { token } = useAuth()
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [city, setCity] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [listingStep, setListingStep] = useState(1)
  const [saved, setSaved] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', rent: '', location: '',
    city: '', available_from: '', furnished: false, wifi: false,
    parking: false, ac: false, laundry: false, gym: false
  })
  const [error, setError] = useState('')
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

  useEffect(() => {
    let result = listings
    if (city) {
      result = result.filter(l =>
        (l.city || '').toLowerCase().includes(city.toLowerCase()) ||
        (l.title || '').toLowerCase().includes(city.toLowerCase())
      )
    }
    if (activeFilter === 'Under ₹10k') result = result.filter(l => parseInt(l.rent) < 10000)
    else if (activeFilter === '₹10-20k') result = result.filter(l => parseInt(l.rent) >= 10000 && parseInt(l.rent) <= 20000)
    else if (activeFilter === 'Furnished') result = result.filter(l => l.furnished === true)
    else if (activeFilter === 'WiFi') result = result.filter(l => l.wifi === true)
    setFiltered(result)
  }, [city, activeFilter, listings])

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `listing-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('listings').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('listings').getPublicUrl(fileName)
      setUploadedPhotos(prev => [...prev, data.publicUrl])
    } catch {
      alert('Could not upload photo.')
    }
    setUploading(false)
  }

  const nextStep = () => {
    setError('')
    if (listingStep === 1 && !form.title) { setError('Please select room type'); return }
    if (listingStep === 2 && (!form.city || !form.location)) { setError('Please fill city and area'); return }
    if (listingStep === 3 && !form.rent) { setError('Please enter rent amount'); return }
    if (listingStep === 5 && !form.available_from) { setError('Please select available date'); return }
    if (listingStep < listingSteps.length) setListingStep(listingStep + 1)
    else handleCreate()
  }

  const handleCreate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/listings`,
        { ...form, photos: uploadedPhotos }, { headers })
      alert('Listing created! 🎉')
      setShowForm(false)
      setListingStep(1)
      setUploadedPhotos([])
      setForm({ title: '', description: '', rent: '', location: '', city: '', available_from: '', furnished: false, wifi: false, parking: false, ac: false, laundry: false, gym: false })
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

  // Multi-step form modal
  if (showForm) {
    const current = listingSteps[listingStep - 1]
    const progress = (listingStep / listingSteps.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

        {/* Header */}
        <div className="bg-red-500 px-5 pt-8 pb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-black text-white">Add Listing</div>
            <button onClick={() => { setShowForm(false); setListingStep(1) }}
              className="text-white text-xl font-black">✕</button>
          </div>
          <div className="flex gap-1.5 mb-4">
            {listingSteps.map((s, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i < listingStep ? 'bg-white' : 'bg-white bg-opacity-30'} ${i === listingStep - 1 ? 'flex-1' : 'w-4'}`} />
            ))}
          </div>
          <div className="text-xs text-red-200 font-bold mb-1">STEP {listingStep} OF {listingSteps.length}</div>
          <div className="text-2xl font-black text-white leading-tight">{current.title}</div>
          <div className="text-xs text-red-100 mt-1 font-medium">{current.subtitle}</div>
        </div>

        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 bg-white px-5 py-6 overflow-y-auto">

          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Step 1 - Room Type */}
          {listingStep === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '1BHK', icon: '🏠', label: '1 BHK' },
                { value: '2BHK', icon: '🏡', label: '2 BHK' },
                { value: '3BHK', icon: '🏘', label: '3 BHK' },
                { value: 'Studio', icon: '🏢', label: 'Studio' },
                { value: 'PG', icon: '🏬', label: 'PG Room' },
                { value: 'Shared', icon: '👥', label: 'Shared Room' },
              ].map(type => (
                <button key={type.value}
                  onClick={() => setForm({ ...form, title: type.value })}
                  className={`p-4 rounded-2xl border-2 transition text-center ${form.title === type.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-100 bg-gray-50'}`}>
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className={`text-sm font-black ${form.title === type.value ? 'text-red-500' : 'text-gray-700'}`}>
                    {type.label}
                  </div>
                  {form.title === type.value && <div className="text-xs text-red-400 mt-1">Selected ✓</div>}
                </button>
              ))}
            </div>
          )}

          {/* Step 2 - Location */}
          {listingStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">CITY</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'].map(c => (
                    <button key={c}
                      onClick={() => setForm({ ...form, city: c })}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition ${form.city === c
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-100 bg-gray-50 text-gray-700'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">AREA / LOCALITY</label>
                <input
                  placeholder="e.g. Koramangala, Bandra, Hauz Khas"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-base text-gray-700 transition"
                />
              </div>
            </div>
          )}

          {/* Step 3 - Rent */}
          {listingStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">MONTHLY RENT (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 12000"
                  value={form.rent}
                  onChange={e => setForm({ ...form, rent: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-2xl font-black text-gray-700 transition"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">Enter amount in Indian Rupees</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[8000, 10000, 15000, 20000].map(amount => (
                  <button key={amount}
                    onClick={() => setForm({ ...form, rent: amount.toString() })}
                    className={`p-3 rounded-xl border-2 text-sm font-bold transition ${form.rent === amount.toString()
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-100 bg-gray-50 text-gray-700'}`}>
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 - Amenities */}
          {listingStep === 4 && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'furnished', icon: '🛋️', label: 'Furnished' },
                { key: 'wifi', icon: '📶', label: 'WiFi included' },
                { key: 'parking', icon: '🚗', label: 'Parking' },
                { key: 'ac', icon: '❄️', label: 'AC' },
                { key: 'laundry', icon: '👕', label: 'Laundry' },
                { key: 'gym', icon: '🏋️', label: 'Gym access' },
              ].map(amenity => (
                <button key={amenity.key}
                  onClick={() => setForm({ ...form, [amenity.key]: !form[amenity.key] })}
                  className={`p-4 rounded-2xl border-2 transition text-center ${form[amenity.key]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-100 bg-gray-50'}`}>
                  <div className="text-3xl mb-2">{amenity.icon}</div>
                  <div className={`text-xs font-black ${form[amenity.key] ? 'text-red-500' : 'text-gray-700'}`}>
                    {amenity.label}
                  </div>
                  {form[amenity.key] && <div className="text-xs text-red-400 mt-1">✓</div>}
                </button>
              ))}
            </div>
          )}

          {/* Step 5 - Available Date */}
          {listingStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">AVAILABLE FROM</label>
                <input
                  type="date"
                  value={form.available_from}
                  onChange={e => setForm({ ...form, available_from: e.target.value })}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-base text-gray-700 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Immediately', 'Within 2 weeks', 'Within a month', 'Flexible'].map(option => (
                  <button key={option}
                    onClick={() => {
                      const today = new Date()
                      const date = option === 'Immediately' ? today
                        : option === 'Within 2 weeks' ? new Date(today.setDate(today.getDate() + 14))
                        : option === 'Within a month' ? new Date(today.setDate(today.getDate() + 30))
                        : new Date(today.setDate(today.getDate() + 60))
                      setForm({ ...form, available_from: date.toISOString().split('T')[0] })
                    }}
                    className="p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-xs font-bold text-gray-700 hover:border-red-300 transition">
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6 - Photos */}
          {listingStep === 6 && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-red-300 transition">
                <span className="text-4xl">📷</span>
                <span className="text-sm font-black text-gray-600">
                  {uploading ? 'Uploading...' : 'Tap to add photos'}
                </span>
                <span className="text-xs text-gray-400 font-medium">{uploadedPhotos.length} photos added</span>
                <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" multiple />
              </label>
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedPhotos.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="room" className="w-full h-24 rounded-xl object-cover" />
                      <button
                        onClick={() => setUploadedPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 text-center font-medium">
                Listings with photos get 3x more views!
              </p>
            </div>
          )}

          {/* Step 7 - Description */}
          {listingStep === 7 && (
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 tracking-wide">DESCRIPTION</label>
              <textarea
                placeholder="Describe your room, neighborhood, ideal roommate..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-base text-gray-700 transition"
                rows={6}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {form.description.length}/500 characters
              </p>
            </div>
          )}

        </div>

        {/* Bottom Buttons */}
        <div className="bg-white px-5 pb-8 pt-4 border-t border-gray-100">
          <button onClick={nextStep}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-base transition mb-3">
            {listingStep === listingSteps.length ? 'Post Listing 🎉' : 'Continue →'}
          </button>
          {listingStep > 1 && (
            <button onClick={() => { setError(''); setListingStep(listingStep - 1) }}
              className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-100 transition">
              ← Back
            </button>
          )}
        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Room Listings 🏠</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">{filtered.length} rooms found</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs transition">
          + Add
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
          {city && <button onClick={() => setCity('')} className="text-gray-400 font-black text-sm">✕</button>}
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
              <div className="text-xs font-black text-gray-900 mb-0.5 truncate">{listing.city || listing.title}</div>
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
