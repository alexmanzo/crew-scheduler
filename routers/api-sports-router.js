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
	if (req.body.sport == '') {
		res.status(400).json({error: 'No sport added'})
	}

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

router.put('/:id', jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    	res.status(400).json({
      		error: 'Request path id and request body id values must match'
    	})
  	}

  	let updatedSport = {
  		id: req.params.id,
		sport: req.body.sport
  	}

  	Sport
  		.findByIdAndUpdate(req.params.id, {$set: updatedSport}, { new: true})
  		.then(updatedPost => res.status(204).end())
  		.catch(err => res.status(500).json({message: 'something went wrong'}))	
})

router.delete('/:id', (req, res) => {
	Sport
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


