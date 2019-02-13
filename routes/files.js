const express = require('express')
const router = express.Router()
const upload = require('../multer')

const files = require('../controllers/files')

router.post('/folder/:folder_id/upload',upload.array('files',20), files.upload)   
router.post('/folder/:folder_id/create_folder', files.create_folder)

router.post('/folder/:folder_id/move/:parent_folder', files.move_folder)
router.post('/:file_id/move/:folder_id', files.move_file)

router.get('/:file_id/:file_name', files.get_file) 

module.exports = router

    ///files/a7dbd7f6-b19a-4b64-9c41-a7f7ca030843/move/0785ccfe-6d7c-4755-ab68-93e153d0d07f