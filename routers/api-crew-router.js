const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const jsonParser = bodyParser.json()
const Crew = require('../models/crew-model')
const User = require('../models/user-model')



router.get('/', jsonParser, (req, res) => {
    Crew
        .find()
        .then(crews => {
            res.json(crews.map(crew => crew.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

router.get('/:eventId', jsonParser, (req, res) => {
    Crew
        .find({ "eventId": `${req.params.eventId}` })
        .then(crews => {
            res.json(crews.map(crew => crew.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

router.post('/', jsonParser, (req, res) => {
    Crew
        .create({
            eventId: req.body.eventId,
            crew: req.body.crew
        })
        .then(crew => res.status(201).json(crew.serialize()))
        .catch(err => {
            if (err.name == 'ValidationError') {
                console.log('All events accounted for')
            } else {
            res.status(500).json({ error: 'Something went wrong' })
            }
        })


})


router.put('/:id/:position', jsonParser, (req, res) => {
    Crew
        .findByIdAndUpdate(req.params.id, { $pull: { "crew": {"position":`${req.params.position}`}}})
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})


router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        })
    }

    let updatedCrew = {
        crew: req.body.crew
    }
    Crew
        .findByIdAndUpdate(req.params.id, { $push: updatedCrew }, { new: true })
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})


router.delete('/:id', (req, res) => {
    Crew
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success' })
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: 'something went wrong' })
        })
})

module.exports = router