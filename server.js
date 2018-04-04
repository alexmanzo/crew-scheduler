const express = require('express')
const app = express()


app.use(express.static('public'))
const server = app.listen(process.env.PORT || 8080, () => console.log('Your server is up and running'))


module.exports = { app, server }