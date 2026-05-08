const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const { getProfile, updateProfile, updatePreferences } = require('../controllers/profileController')

router.get('/', authenticate, getProfile)
router.put('/', authenticate, updateProfile)
router.put('/preferences', authenticate, updatePreferences)

module.exports = router