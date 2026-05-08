const supabase = require('../config/supabase')

// GET my profile
const getProfile = async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, preferences(*)')
    .eq('id', req.user.id)
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json(data)
}

// UPDATE my profile
const updateProfile = async (req, res) => {
  const { full_name, age, gender, bio, location, budget_min, budget_max } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name, age, gender, bio, location, budget_min, budget_max })
    .eq('id', req.user.id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ message: 'Profile updated!', data })
}

// UPDATE my preferences
const updatePreferences = async (req, res) => {
  const { sleep_schedule, cleanliness, smoking, pets, guests, work_schedule } = req.body

  // Check if preferences already exist
  const { data: existing } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (existing) {
    // Update existing preferences
    const { error } = await supabase
      .from('preferences')
      .update({ sleep_schedule, cleanliness, smoking, pets, guests, work_schedule })
      .eq('user_id', req.user.id)

    if (error) return res.status(400).json({ error: error.message })
  } else {
    // Create new preferences
    const { error } = await supabase
      .from('preferences')
      .insert({ user_id: req.user.id, sleep_schedule, cleanliness, smoking, pets, guests, work_schedule })

    if (error) return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ message: 'Preferences saved!' })
}

module.exports = { getProfile, updateProfile, updatePreferences }