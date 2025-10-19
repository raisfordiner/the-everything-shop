const express = require('express')
const routes = require('./routes')

app.use(express.json())

app.use('/', routes)

module.exports = app;
