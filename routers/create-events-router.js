const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


router.get('/', (req, res) => {
	res.sendFile('create-events.html', {"root": "./public"})
})

module.exports = router