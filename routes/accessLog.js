const express = require('express')
const router = express.Router()

//Import accessLog controller
const accessLog = require('../controllers/accessLog')

/**
 * Routes for /accessLog
 */

router.get("/", accessLog.listAccessLog)   
router.post("/create", accessLog.create) 

module.exports = router