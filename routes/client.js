const express = require('express')
const router = express.Router()

//Import client controller
const client = require('../controllers/client')

/**
 * Routes for /client
 */

router.get('/:client_id', client.get)
router.get('/:client_id/files', client.files)
router.get('/:client_id/deleted_files', client.deleted_files)

module.exports = router
