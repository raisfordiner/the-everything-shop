const express = require('express')
const routes = require('./routes')

require('dotenv').config()
const PORT = process.env.PORT
const app = express()

app.use(express.json())

app.use('/', routes)

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log("Listening on port ", PORT)
})
