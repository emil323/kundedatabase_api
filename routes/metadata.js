const express = require('express')
const router = express.Router()

const requireAdmin = require('../auth/require-admin')
const metadata = require('../controllers/metadata')

router.get('/default_values',requireAdmin(), metadata.default_values)
router.put('/default_values',requireAdmin(), metadata.update_default_values)

module.exports = router

