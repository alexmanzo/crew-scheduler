const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const Sport = require('../models/sports-model')

const jsonParser = bodyParser.json()


router.get('/', (req, res) => {
	Sport
		.find().collation({locale:'en',strength: 2}).sort({sport:1})
		.then(sports => {
			res.json(sports.map(sport => sport.serialize()))
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: 'Server Error'})
		})
})

router.post('/', jsonParser, (req, res) => {
	Sport
		.create({
			sport: req.body.sport
		})
		.then(sport => res.status(201).json(sport.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({error: 'Something went wrong'})
		})
})


module.exports = router


