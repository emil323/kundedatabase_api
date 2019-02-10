const express = require('express')
const router = express.Router()

//Import clients controller
const clients = require('../controllers/clients')

/**
 * Routes for /clients
 */

router.get("/", clients.list)
router.post("/create", clients.create)   
  
module.exports = router

    