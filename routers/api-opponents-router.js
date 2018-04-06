const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Opponent = require('../models/opponents-model')


router.get('/', (req, res) => {
	Opponent
		.find().collation({locale:'en',strength: 2}).sort({opponent:1})
		.then(opponents => {
			res.json(opponents.map(opponent => opponent.serialize()))
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: 'Server Error'})
		})
})


module.exports = router




