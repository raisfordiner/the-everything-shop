const express = require('express')
const router = express.Router()
const dummyController = require('../controllers/dummyController')

router.post('/', dummyController.create)
router.get('/', dummyController.getAll)
router.get('/:id', dummyController.getById)
router.put('/:id', dummyController.update)
router.delete('/:id', dummyController.remove)

module.exports = router
