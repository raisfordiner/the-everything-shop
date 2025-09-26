const pool = require('../config/db')

async function createDummy(name) {
    const query = `
        INSERT INTO dummy (name)
        VALUES ($1)
        RETURNING *;
    `
    const values = [name]
    const { rows } = await pool.query(query, values);
    return rows[0]
}

async function getAllDummies() {
    const query = `SELECT * FROM dummy ORDER BY id ASC;`
    const { rows } = await pool.query(query)
    return rows
}

module.exports = {
    createDummy,
    getAllDummies,
}
