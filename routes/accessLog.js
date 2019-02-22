const express = require('express')
const router = express.Router()

//Import accessLog controller
const accessLog = require('../controllers/accessLog')

/**
 * Routes for /accessLog
 */

router.get("/", accessLog.listAccessLog)   

module.exports = router