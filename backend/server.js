const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Allow requests from web and mobile app
app.use(cors())
app.use(express.json())

// Connect all routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/matches', require('./routes/matches'))
app.use('/api/listings', require('./routes/listings'))
app.use('/api/messages', require('./routes/messages'))

// Test route — visit this to check server is running
app.get('/', (req, res) => {
  res.send('Roommate Platform API is running! 🏠')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})