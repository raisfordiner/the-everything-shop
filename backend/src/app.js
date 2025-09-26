const express = require('express')

const routes = require('./routes')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api', routes)

app.use('/', (req, res) => {
    res.json({
        msg: "Good"
    })
})



module.exports = app
