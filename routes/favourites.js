const express = require('express')
const router = express.Router()

//Import accessLog controller
const favourites = require('../controllers/favourites')

/**
 * Routes for /favourites
 */

router.get("/", favourites.listFavourites)   
router.post("/create", favourites.create)   
router.post("/delete", favourites.delete)

module.exports = router