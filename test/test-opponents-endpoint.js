const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Opponent = require('../models/opponents-model')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

function seedOpponentData () {
	console.info('seeding opponent info')
	const seedData = []

	for (let i=1; i<=10; i++) {
		seedData.push(generateOpponentData())
	}

	return Opponent.insertMany(seedData)
}

function generateOpponentData () {
	return {
		opponent: faker.lorem.word()
	}
}

function tearDownDb() {
	console.warn('Deleting database')
	return mongoose.connection.dropDatabase()
}

describe('opponents API', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL)
	})

	beforeEach(function() {
		return seedOpponentData()
	})

	afterEach(function() {
		tearDownDb()
	})

	after(function() {
		return closeServer()
	})

	describe('GET endpoint', function() {

		it('should return all existing opponents', function () {
			let res;
			return chai.request(app)
				.get('/api/opponents')
				.then(function(_res){
					res = _res
					expect(res).to.have.status(200)
					expect(res.body).to.have.length.of.at.least(1)
					return Opponent.count()
			})
		})

		it('should return opponent with right fields', function () {
			let resOpponent;
			return chai.request(app)
				.get('/api/opponents')
				.then(function(res) {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.be.a('array')
					expect(res.body).to.have.length.of.at.least(1)

					res.body.forEach(function(opponent){
						expect(opponent).to.be.a('object')
						expect(opponent).to.include.keys('id', 'opponent')
					})

					resOpponent = res.body[0]
					return Opponent.findById(resOpponent.id)
				})
				.then (function(opponent){
					expect(resOpponent.id).to.equal(opponent.id)
					expect(resOpponent.opponent).to.equal(opponent.opponent)
				})

		})
	})

	describe('POST endpoint', function() {
		it('should add a new opponent', function() {
			const newOpponent = generateOpponentData()

			return chai.request(app)
				.post('/api/opponents')
				.send(newOpponent)
				.then(function(res){
					expect(res).to.have.status(201)
					expect(res).to.be.json
					expect(res.body).to.be.a('object')
					expect(res.body).to.include.keys('id', 'opponent')
					expect(res.body.id).to.not.be.null
					expect(res.body.opponent).to.equal(newOpponent.opponent)
				})
		})
	})
})
