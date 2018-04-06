const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Position = require('../models/positions-model')


router.get('/', (req, res) => {
	Position
		.find().collation({locale:'en',strength: 2}).sort({position:1})
		.then(positions => {
			res.json(positions.map(position => position.serialize()))
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: 'Server Error'})
		})
})


module.exports = router

