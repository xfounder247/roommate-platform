const supabase = require('../config/supabase')

const authenticate = async (req, res, next) => {
  // Get the token from the request header
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please log in.' })
  }

  // Verify the token with Supabase
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }

  // Attach the user to the request so other files can use it
  req.user = data.user
  next()
}

module.exports = authenticate