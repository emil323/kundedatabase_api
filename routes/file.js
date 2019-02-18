const express = require('express')
const router = express.Router()


const file = require('../controllers/file')

router.get('/:file_id', file.download) 
router.post('/:file_id/move', file.move)
router.post('/:file_id/rename', file.rename)
router.delete('/:file_id', file.delete)

module.exports = router