const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const moment = require('moment')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Event = require('../models/events-model')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

function seedEventData () {
	console.info('seeding event info')
	const seedData = []

	for (let i=1; i<=10; i++) {
		seedData.push(generateEventData())
	}

	return Event.insertMany(seedData)
}

function generateEventData () {
	return {
		date: moment(faker.date.future()).format('dddd MM-DD-YYYY'),
		time: '07:00 PM',
		call: '06:00 PM',
		sport: faker.lorem.word(),
		opponent: faker.lorem.word(),
		location: faker.lorem.word(),
		positions: []
	}
}

function tearDownDb() {
	console.warn('Deleting database')
	return mongoose.connection.dropDatabase()
}

describe('events API', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL)
	})

	beforeEach(function() {
		return seedEventData()
	})

	afterEach(function() {
		tearDownDb()
	})

	after(function() {
		return closeServer()
	})

	describe('GET endpoint', function() {

		it('should return all existing events', function () {
			let res;
			return chai.request(app)
				.get('/api/events')
				.then(function(_res){
					res = _res
					expect(res).to.have.status(200)
					expect(res.body).to.have.length.of.at.least(1)
					return Event.count()
			})
		})

		it('should return event with right fields', function () {
			let resEvent;
			return chai.request(app)
				.get('/api/events')
				.then(function(res) {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.be.a('array')
					expect(res.body).to.have.length.of.at.least(1)

					res.body.forEach(function(event){
						expect(event).to.be.a('object')
						expect(event).to.include.keys('id', 'date', 'time', 'call', 'sport', 'opponent', 'location', 'positions')
					})

					resEvent = res.body[0]
					return Event.findById(resEvent.id)
				})
				.then (function(event){
					expect(resEvent.id).to.equal(event.id)
					expect(resEvent.date).to.equal(event.date)
					expect(resEvent.time).to.equal(event.time)
					expect(resEvent.call).to.equal(event.call)
					expect(resEvent.sport).to.equal(event.sport)
					expect(resEvent.opponent).to.equal(event.opponent)
					expect(resEvent.location).to.equal(event.location)
					expect(resEvent.positions).to.be.a('array')
				})

		})
	})

	describe('POST endpoint', function() {
		it('should add a new event', function() {
			const newEvent = generateEventData()
			console.log(newEvent)

			return chai.request(app)
				.post('/api/events')
				.send(newEvent)
				.then(function(res){
					expect(res).to.have.status(201)
					expect(res).to.be.json
					expect(res.body).to.be.a('object')
					expect(res.body).to.include.keys('id', 'date', 'time', 'call', 'sport', 'opponent', 'location', 'positions')
					expect(res.body.id).to.not.be.null
					expect(res.body.sport).to.equal(newEvent.sport)
					expect(res.body.opponent).to.equal(newEvent.opponent)
					expect(res.body.location).to.equal(newEvent.location)
				})
		})
	})
})
