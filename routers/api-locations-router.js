const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Location = require('../models/locations-model')


router.get('/', (req, res) => {
	Location
		.find().collation({locale:'en',strength: 2}).sort({location:1})
		.then(locations => {
			res.json(locations.map(location => location.serialize()))
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({error: 'Server Error'})
		})
})


module.exports = router

