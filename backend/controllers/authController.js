const supabase = require('../config/supabase')

// SIGN UP — create a new account
const signUp = async (req, res) => {
  const { email, password, full_name, age, gender, location } = req.body

  try {
    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return res.status(400).json({ error: error.message })

    // Save their profile info in our profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name,
        age,
        gender,
        location
      })

    if (profileError) return res.status(400).json({ error: profileError.message })

    res.status(201).json({ message: 'Account created! Please check your email.' })

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Try again.' })
  }
}

// LOG IN — sign into existing account
const logIn = async (req, res) => {
  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    // Send back the token (used for all future requests)
    res.status(200).json({
      message: 'Logged in successfully!',
      token: data.session.access_token,
      user: data.user
    })

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Try again.' })
  }
}

module.exports = { signUp, logIn }