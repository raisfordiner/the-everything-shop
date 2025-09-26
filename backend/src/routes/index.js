const express = require('express')
const router = express.Router()

router.use('/', require('./defaultRoutes'))
router.use('/dummies', require('./dummyRoutes'))

module.exports = router
