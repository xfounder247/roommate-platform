const supabase = require('../config/supabase')

// SEND a message
const sendMessage = async (req, res) => {
  const { match_id, content } = req.body

  const { data, error } = await supabase
    .from('messages')
    .insert({ match_id, sender_id: req.user.id, content })

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ message: 'Message sent!', data })
}

// GET all messages in a match/conversation
const getMessages = async (req, res) => {
  const { match_id } = req.params

  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(full_name, photo_url)')
    .eq('match_id', match_id)
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json(data)
}

module.exports = { sendMessage, getMessages }