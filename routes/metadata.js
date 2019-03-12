const express = require('express')
const router = express.Router()

const metadata = require('../controllers/metadata')

router.get('/default_values', metadata.default_values)


module.exports = router

