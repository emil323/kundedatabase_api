const express = require('express')
const router = express.Router()

//Import accessLog controller
const accessLog = require('../controllers/accessLog')

/**
 * Routes for /accessLog
 */

router.get("/:client_id?", accessLog.listAccessLog)   

module.exports = router