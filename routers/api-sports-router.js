const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Sport = require('../models/sports-model')


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


module.exports = router


