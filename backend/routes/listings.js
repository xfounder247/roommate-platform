const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const { createListing, getListings, deleteListing } = require('../controllers/listingController')

router.get('/', authenticate, getListings)
router.post('/', authenticate, createListing)
router.delete('/:id', authenticate, deleteListing)

module.exports = router