const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Event = require('../models/events-model')


router.get('/', (req, res) => {
	Event
		.find()
		.then(events => {
			res.json(events.map(event => event.serialize()))
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: 'Server Error'})
		})
})


module.exports = router