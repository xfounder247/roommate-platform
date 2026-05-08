const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const { getMatches, likeUser, getMyMatches } = require('../controllers/matchController')

router.get('/', authenticate, getMatches)
router.post('/like', authenticate, likeUser)
router.get('/my-matches', authenticate, getMyMatches)

module.exports = router