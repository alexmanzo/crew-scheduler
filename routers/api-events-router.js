const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const jsonParser = bodyParser.json()
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

router.post('/', jsonParser, (req, res) => {
	Event
		.create({
				date: req.body.date,
				time: req.body.time,
				call: req.body.call,
				sport: req.body.sport,
				opponent: req.body.opponent,
				location: req.body.location,
				positions: req.body.positions
		})
		.then(event => res.status(201).json(event.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({error: 'Something went wrong'})
		})
})


module.exports = router