const express = require('express')
const router = express.Router()


const file = require('../controllers/file')

router.get('/:file_id/metadata', file.metadata) 
router.get('/:file_id', file.download) 
router.post('/:file_id', file.edit) 
router.post('/:file_id/move', file.move)
router.post('/:file_id/rename', file.rename)
router.delete('/:file_id', file.delete)
router.post('/:file_id/recover', file.recover)

module.exports = router