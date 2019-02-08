const express = require('express')
const router = express.Router()
const upload = require('../multer')

const files = require('../controllers/files')

router.post("/folder/:folder_id/upload",upload.array('files',8), files.upload)   
router.get('/:file_id/:file_name', files.get_file) 

module.exports = router

    