const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Sport = require('../models/sports-model')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

function seedSportData () {
	console.info('seeding sport info')
	const seedData = []

	for (let i=1; i<=10; i++) {
		seedData.push(generateSportData())
	}

	return Sport.insertMany(seedData)
}

function generateSportData () {
	return {
		sport: faker.lorem.word()
	}
}

function tearDownDb() {
	console.warn('Deleting database')
	return mongoose.connection.dropDatabase()
}

describe('Sports API', function() {
	before(function(){
		return runServer(TEST_DATABASE_URL)
	})

	beforeEach(function(){
		return seedSportData()
	})

	afterEach(function() {
		return tearDownDb()
	})

	after(function() {
		return closeServer()
	})

	describe('GET endpoint', function() {

		it('should return all existing sports', function () {
			let res;
			return chai.request(app)
				.get('/api/sports')
				.then(function(_res){
					res = _res
					expect(res).to.have.status(200)
					expect(res.body).to.have.length.of.at.least(1)
					return Sport.count()
			})
		})

		it('should return sport with right fields', function () {
			let resSport;
			return chai.request(app)
				.get('/api/sports')
				.then(function(res) {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.be.a('array')
					expect(res.body).to.have.length.of.at.least(1)

					res.body.forEach(function(sport){
						expect(sport).to.be.a('object')
						expect(sport).to.include.keys('id', 'sport')
					})

					resSport = res.body[0]
					return Sport.findById(resSport.id)
				})
				.then (function(sport){
					expect(resSport.id).to.equal(sport.id)
					expect(resSport.sport).to.equal(sport.sport)
				})

		})
	})

	describe('POST endpoint', function() {
		it('should add a new sport', function() {
			const newSport = generateSportData()

			return chai.request(app)
				.post('/api/sports')
				.send(newSport)
				.then(function(res){
					expect(res).to.have.status(201)
					expect(res).to.be.json
					expect(res.body).to.be.a('object')
					expect(res.body).to.include.keys('id', 'sport')
					expect(res.body.id).to.not.be.null
					expect(res.body.sport).to.equal(newSport.sport)
				})
		})
	})

	describe('DELETE endpoint', function() {
		let sport;
		
		it('should delete a sport', function () {
			return Sport
			.findOne()
			.then(function(_sport) {
				sport = _sport
				return chai.request(app).delete(`/api/sports/${sport.id}`)
			})
			.then(function(res) {
				expect(res).to.have.status(204)
				return Sport.findById(sport.id)
			})
			.then(function(_sport) {
				expect(_sport).to.be.null
			})
		})


	})

	describe('PUT endpoint', function(){
		it('should update field you send over', function() {
			const updateData = {
				sport: faker.lorem.word()
			}

			return Sport
				.findOne()
				.then(function(sport) {
					updateData.id = sport.id

					return chai.request(app)
						.put(`/api/sports/${sport.id}`)
						.send(updateData)
				})
				.then(function(res) {
					expect(res).to.have.status(204)

					return Sport.findById(updateData.id)
				})
				.then(function(sport) {
					expect(sport.sport).to.equal(updateData.sport)
				})
		})
	})
})




