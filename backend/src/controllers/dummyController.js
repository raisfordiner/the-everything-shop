const dummyModel = require('../models/dummyModel')

async function create(req, res) {
    try {
        const { name } = req.body

        const newDummy = await dummyModel.create(name)

        res.status(201).json(newDummy)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getAll(req, res) {
    try {
        const dummies = await dummyModel.getAll()

        res.json(dummies)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params

        const dummy = await dummyModel.getById(id)

        if (!dummy) {
            res.status(404).json({ err: 'Not Found' })
            return
        }
        res.status(200).json(dummy)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function update(req, res) {
    try {
        const { id } = req.params
        const { name } = req.body

        const dummy = await dummyModel.update(id, name)

        if (!dummy) {
            res.status(404).json({ err: 'Not Found' })
            return
        }
        res.json(dummy)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params

        const dummy = await dummyModel.remove(id)

        if (!dummy) {
            res.status(404).json({ err: 'Not Found' })
            return
        }
        res.json(dummy)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
}
