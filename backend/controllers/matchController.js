const supabase = require('../config/supabase')

// GET potential matches based on preferences
const getMatches = async (req, res) => {
  // Get current user's preferences
  const { data: myPrefs } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (!myPrefs) {
    return res.status(400).json({ error: 'Please complete your preferences first.' })
  }

  // Get all other users with their preferences
  const { data: allUsers, error } = await supabase
    .from('profiles')
    .select('*, preferences(*)')
    .neq('id', req.user.id)

  if (error) return res.status(400).json({ error: error.message })

  // Score each user based on matching preferences
  const scored = allUsers.map(user => {
    let score = 0
    const p = user.preferences?.[0]
    if (!p) return { ...user, score: 0 }

    if (p.smoking === myPrefs.smoking) score += 20
    if (p.pets === myPrefs.pets) score += 20
    if (p.sleep_schedule === myPrefs.sleep_schedule) score += 20
    if (p.cleanliness === myPrefs.cleanliness) score += 20
    if (p.guests === myPrefs.guests) score += 10
    if (p.work_schedule === myPrefs.work_schedule) score += 10

    return { ...user, score }
  })

  // Sort by highest score first
  const sorted = scored.sort((a, b) => b.score - a.score)

  res.status(200).json(sorted)
}

// LIKE a user
const likeUser = async (req, res) => {
  const { receiver_id } = req.body

  // Check if they already liked us back
  const { data: existing } = await supabase
    .from('matches')
    .select('*')
    .eq('sender_id', receiver_id)
    .eq('receiver_id', req.user.id)
    .single()

  if (existing) {
    // It's a match! Update status to accepted
    await supabase
      .from('matches')
      .update({ status: 'accepted' })
      .eq('id', existing.id)

    return res.status(200).json({ message: "It's a match! 🎉" })
  }

  // Otherwise just send the like
  const { error } = await supabase
    .from('matches')
    .insert({ sender_id: req.user.id, receiver_id, status: 'pending' })

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ message: 'Like sent!' })
}

// GET all my accepted matches
const getMyMatches = async (req, res) => {
  const { data, error } = await supabase
    .from('matches')
    .select('*, profiles!matches_sender_id_fkey(*), profiles!matches_receiver_id_fkey(*)')
    .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
    .eq('status', 'accepted')

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json(data)
}

module.exports = { getMatches, likeUser, getMyMatches }