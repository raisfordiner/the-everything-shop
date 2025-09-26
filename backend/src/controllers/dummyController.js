const dummyModel = require('../models/dummyModel')

async function create(req, res) {
    try {
        const { name } = req.body
        const newDummy = await dummyModel.createDummy(name)
        res.status(201).json(newDummy)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getAll(req, res) {
    try {
        const dummies = await dummyModel.getAllDummies()
        res.json(dummies)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    create,
    getAll,
}
