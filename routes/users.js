const express = require('express')
const router = express.Router()

const users = require('../controllers/users')

router.get('/:token', users.list) 

module.exports = router
