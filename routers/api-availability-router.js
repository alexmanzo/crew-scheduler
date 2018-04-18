const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const jsonParser = bodyParser.json()
const Availability = require('../models/availability-model')
const User = require('../models/user-model')


router.get('/', jsonParser, (req, res) => {
    Availability
        .find().collation({locale:'en',strength: 2}).sort({availableCrew:1})
        .then(crewAvailability => {
            res.json(crewAvailability.map(availability => availability.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

router.get('/:eventId', jsonParser, (req, res) => {
    Availability
        .find({ "eventId": `${req.params.eventId}` })
        .then(crewAvailability => {
            res.json(crewAvailability.map(availability => availability.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

router.post('/', jsonParser, (req, res) => {
    Availability
        .create({
            eventId: req.body.eventId,
            availableCrew: req.body.availableCrew
        })
        .then(event => res.status(201).json(event.serialize()))
        .catch(err => {
            if (err.name == 'ValidationError') {
                console.log('All events accounted for')
            } else {
            res.status(500).json({ error: 'Something went wrong' })
            }
        })
})

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        })
    }

    let updatedAvailability = {
        availableCrew: req.body.availableCrew
    }

    Availability
        .findByIdAndUpdate(req.params.id, { $push: updatedAvailability }, { new: true })
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})

router.delete('/:user/:eventId', (req, res) => {
    Availability
    .findOneAndRemove({ "eventId": `${req.params.eventId}`, "availableCrew": `${req.params.user}` })
    .then(update => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'something went wrong' }))
})


router.delete('/:id', (req, res) => {
    Availability
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
