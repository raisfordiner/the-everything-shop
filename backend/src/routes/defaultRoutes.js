const express = require('express')
const pool = require('../config/db')

const router = express.Router()

router.get('/', (req, res) => {
    res.sendStatus(200)
})

router.get('/health', (req, res) => {
    res.status(200).send({
        msg: "Server connected successfully"
    })
})

router.get('/ready', (req, res) => {
    res.status(200).send({
        msg: "Server is ready"
    })
})

router.post('/setup', async (req, res) => {
    const query = `
        CREATE TABLE dummy (id SERIAL PRIMARY KEY, name VARCHAR(100))
    `
    try {
        await pool.query(query)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router
