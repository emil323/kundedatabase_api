const express = require('express')
const router = express.Router()

//Import users controller
const users = require('../controllers/users')

/**
 * Routes for /users
 */

router.get("/", users.list)
router.post("/create", users.create)   

module.exports = router
