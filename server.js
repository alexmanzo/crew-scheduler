const express = require('express')
const app = express()
const mongoose = require('mongoose')


app.use(express.static('public'))
app.listen(process.env.PORT || 8080, () => console.log('Your server is up and running'))




module.exports = { app }