const pool = require('../config/db')

async function create(name) {
    const query = `
        INSERT INTO dummy (name)
        VALUES ($1)
        RETURNING *;
    `
    const values = [name]
    const { rows } = await pool.query(query, values);
    return rows[0]
}

async function getAll() {
    const query = `SELECT * FROM dummy ORDER BY id ASC;`
    const { rows } = await pool.query(query)
    return rows
}

async function getById(id) {
    const query = `
        SELECT id, name FROM dummy
        WHERE id = $1;
    `
    const values = [id]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

async function update(id, name) {
    const query = `
        UPDATE dummy
        SET name = $2
        WHERE id = $1
        RETURNING id, name;
    `
    const values = [id, name]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

async function remove(id) {
    const query = `
        DELETE FROM dummy
        WHERE id = $1
        RETURNING id, name;
    `
    const values = [id]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
}
