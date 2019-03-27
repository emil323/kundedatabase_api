const express = require('express')
const router = express.Router()
const requireAdmin = require('../auth/require-admin')

//Import accessLog controller
const accessLog = require('../controllers/accessLog')
const accesslog_report = require('../controllers/accesslog_reports')

/**
 * Routes for /accessLog
 */

router.get("/:type?/:id?", requireAdmin(), accessLog.listAccessLog)   

/**
 * Reports
 */

 router.get("/report/client/:consultant_id",requireAdmin(), accesslog_report.consultant)


module.exports = router