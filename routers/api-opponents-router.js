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
	if (req.body.opponent == '') {
		res.status(400).json({error: 'No opponent entered'})
	}
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

router.put('/:id', jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    	res.status(400).json({
      		error: 'Request path id and request body id values must match'
    	})
  	}

  	let updatedOpponent = {
		opponent: req.body.opponent
  	}

  	Opponent
  		.findByIdAndUpdate(req.params.id, { $set: updatedOpponent }, { new: true })
  		.then(update => res.status(204).end())
  		.catch(err => res.status(500).json({message: 'something went wrong'}))	
})

router.delete('/:id', (req, res) => {
	Opponent
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




