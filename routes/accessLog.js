const express = require('express')
const router = express.Router()

//Import accessLog controller
const accessLog = require('../controllers/accessLog')
const accesslog_report = require('../controllers/accesslog_reports')

/**
 * Routes for /accessLog
 */

router.get("/:type?/:id?", accessLog.listAccessLog)   

/**
 * Reports
 */

 router.get("/report/client/:consultant_id", accesslog_report.consultant)


module.exports = router