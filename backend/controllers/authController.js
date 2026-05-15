const supabase = require('../config/supabase')

// SIGN UP
const signUp = async (req, res) => {
  const { email, password, full_name, age, gender, location } = req.body

  // Validate required fields
  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password and full name are required.' })
  }

  try {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, age, gender, location }
      }
    })

    if (error) return res.status(400).json({ error: error.message })

    // Insert profile into profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name,
          age: parseInt(age),
          gender,
          location
        })

      if (profileError) {
        console.log('Profile error:', profileError.message)
      }
    }

    res.status(201).json({
      message: 'Account created successfully! Please check your email to verify.',
      user: data.user
    })

  } catch (err) {
    console.log('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong. Try again.' })
  }
}

// LOG IN
const logIn = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    res.status(200).json({
      message: 'Logged in successfully!',
      token: data.session.access_token,
      user: data.user
    })

  } catch (err) {
    console.log('Login error:', err)
    res.status(500).json({ error: 'Something went wrong. Try again.' })
  }
}

module.exports = { signUp, logIn }