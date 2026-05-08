const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const { sendMessage, getMessages } = require('../controllers/messageController')

router.post('/', authenticate, sendMessage)
router.get('/:match_id', authenticate, getMessages)

module.exports = router