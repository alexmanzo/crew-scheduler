const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const jsonParser = bodyParser.json()

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

router.post('/', jsonParser, (req, res) => {
	Opponent
		.create({
			opponent: req.body.opponent
		})
		.then(opponent => res.status(201).json(opponent.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({error: 'Something went wrong'})
		})
})


module.exports = router




