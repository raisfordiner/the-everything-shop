const express = require('express')
const router = express.Router()
const dummyController = require('../controllers/dummyController')

router.post('/', dummyController.create)
router.get('/', dummyController.getAll)

module.exports = router
