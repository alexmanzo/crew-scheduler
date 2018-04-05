const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


router.get('/', (req, res) => {
	res.sendFile('availability.html', {"root": "./public"})
})

module.exports = router