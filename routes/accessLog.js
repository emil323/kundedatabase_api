const express = require('express')
const router = express.Router()

//Import accessLog controller
const clients = require('../controllers/accessLog')

/**
 * Routes for /accessLog
 */

router.get("/", clients.listAccessLog)   

module.exports = router