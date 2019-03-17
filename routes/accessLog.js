const express = require('express')
const router = express.Router()

//Import accessLog controller
const accessLog = require('../controllers/accessLog')

/**
 * Routes for /accessLog
 */

router.get("/:type?/:id?", accessLog.listAccessLog)   

module.exports = router