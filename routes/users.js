const express = require('express')
const router = express.Router()
const requireAdmin = require('../auth/require-admin')

//Import users controller
const users = require('../controllers/users')

/**
 * Routes for /users
 */

router.get("/", requireAdmin(), users.list)

module.exports = router
