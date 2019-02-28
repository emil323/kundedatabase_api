const express = require('express')
const router = express.Router()
const upload = require('../multer')

const folder = require('../controllers/folder')

router.post('/:folder_id/upload',upload.array('files',20), folder.upload)   

router.post('/:folder_id/create_folder', folder.create_folder)
router.post('/:folder_id/move', folder.move)
router.post('/:folder_id/rename', folder.rename)
router.delete('/:folder_id', folder.delete)
router.post('/:folder_id/recover', folder.recover)

module.exports = router

