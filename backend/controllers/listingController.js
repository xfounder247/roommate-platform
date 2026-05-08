const supabase = require('../config/supabase')

// CREATE a listing
const createListing = async (req, res) => {
  const { title, description, rent, location, city, available_from, furnished, wifi, parking } = req.body

  const { data, error } = await supabase
    .from('listings')
    .insert({
      owner_id: req.user.id,
      title, description, rent, location,
      city, available_from, furnished, wifi, parking
    })

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ message: 'Listing created!', data })
}

// GET all listings (with optional city filter)
const getListings = async (req, res) => {
  const { city } = req.query
  let query = supabase.from('listings').select('*, profiles(full_name, photo_url)')

  if (city) query = query.eq('city', city)

  const { data, error } = await query
  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json(data)
}

// DELETE a listing
const deleteListing = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('owner_id', req.user.id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ message: 'Listing deleted!' })
}

module.exports = { createListing, getListings, deleteListing }