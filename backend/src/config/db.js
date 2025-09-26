const { Pool } = require('pg')

const pool = new Pool({
    host: "db",
    user: "user123",
    database: "db123",
    password: "pass123",
    port: 5432,
})

module.exports = pool
