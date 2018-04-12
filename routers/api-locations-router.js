const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const jsonParser = bodyParser.json()

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

router.post('/', jsonParser, (req, res) => {
	if (req.body.location == '') {
		res.status(400).json({error: 'No location added'})
	}
	Location
		.create({
			location: req.body.location
		})
		.then(location => res.status(201).json(location.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({error: 'Something went wrong'})
		})
})

router.put('/:id', jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    	res.status(400).json({
      		error: 'Request path id and request body id values must match'
    	})
  	}

  	let updatedLocation = {
		location: req.body.location
  	}

  	Location
  		.findByIdAndUpdate(req.params.id, { $set: updatedLocation }, { new: true })
  		.then(update => res.status(204).end())
  		.catch(err => res.status(500).json({message: 'something went wrong'}))	
})

router.delete('/:id', (req, res) => {
	Location
		.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).json({message: 'success'})
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({error: 'something went wrong'})
		})
})


module.exports = router

