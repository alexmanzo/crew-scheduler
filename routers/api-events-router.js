const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const moment = require('moment')

const jsonParser = bodyParser.json()
const Event = require('../models/events-model')
const User = require('../models/user-model')


router.get('/', (req, res) => {
    Event
        .find()
        .then(events => {
            res.json(events.map(event => event.serialize()))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Server Error' })
        })
})

router.get('/:username', (req, res) => {
    return Event
            .find({"availability": `${req.params.username}`})
            .then(events => res.json(events.map(event => event.serialize())))
            .catch(err => {
              console.error(err)
              res.status(500).json({error: 'Something went wrong'})
            })

})

router.post('/', jsonParser, (req, res) => {
    Event
        .create({
            date: moment(req.body.date, 'YYYY-MM-DD').format('dddd MM-DD-YYYY'),
            time: moment(req.body.time, 'HHmm').format('hh:mm A'),
            call: moment(req.body.call, 'HHmm').format('hh:mm A'),
            sport: req.body.sport,
            opponent: req.body.opponent,
            location: req.body.location,
            positions: req.body.positions
        })
        .then(event => res.status(201).json(event.serialize()))
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: 'Something went wrong' })
        })
})

router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        })
    }

    let updatedEvent = {
        availability: req.body.availability
    }

    Event
        .findByIdAndUpdate(req.params.id, { $set: updatedEvent }, { new: true })
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})

router.put('/crew/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        })
    }

    let updatedEvent = {
        crew: req.body.crew
    }

    Event
        .findByIdAndUpdate(req.params.id, { $addToSet: updatedEvent }, { new: true })
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})

router.put('/remove-user/:username/:id', (req,res) => {
    Event
        .findByIdAndUpdate(req.params.id, { $pull: { "availability": `${req.params.username}` } } )
        .then(update => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'something went wrong' }))
})


module.exports = router