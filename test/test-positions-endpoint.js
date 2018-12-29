const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Position = require('../models/positions-model')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp)

function seedPositionData () {
	console.info('seeding position info')
	const seedData = []

	for (let i=1; i<=10; i++) {
		seedData.push(generatePositionData())
	}

	return Position.insertMany(seedData)
}

function generatePositionData () {
	return {
		position: faker.lorem.word()
	}
}

function tearDownDb() {
	console.warn('Deleting database')
	return mongoose.connection.dropDatabase()
}

describe('positions API', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL)
	})

	beforeEach(function() {
		return seedPositionData()
	})

	afterEach(function() {
		tearDownDb()
	})

	after(function() {
		return closeServer()
	})

	describe('GET endpoint', function() {

		it('should return all existing positions', function () {
			let res;
			return chai.request(app)
				.get('/api/positions')
				.then(function(_res){
					res = _res
					expect(res).to.have.status(200)
					expect(res.body).to.have.length.of.at.least(1)
					return Position.count()
			})
		})

		it('should return position with right fields', function () {
			let resPosition;
			return chai.request(app)
				.get('/api/positions')
				.then(function(res) {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.be.a('array')
					expect(res.body).to.have.length.of.at.least(1)

					res.body.forEach(function(position){
						expect(position).to.be.a('object')
						expect(position).to.include.keys('id', 'position')
					})

					resPosition = res.body[0]
					return Position.findById(resPosition.id)
				})
				.then (function(position){
					expect(resPosition.id).to.equal(position.id)
					expect(resPosition.position).to.equal(position.position)
				})

		})
	})

	// describe('POST endpoint', function() {
	// 	it('should add a new position', function() {
	// 		const newPosition = generatePositionData()

	// 		return chai.request(app)
	// 			.post('/api/positions')
	// 			.send(newPosition)
	// 			.then(function(res){
	// 				expect(res).to.have.status(201)
	// 				expect(res).to.be.json
	// 				expect(res.body).to.be.a('object')
	// 				expect(res.body).to.include.keys('id', 'position')
	// 				expect(res.body.id).to.not.be.null
	// 				expect(res.body.position).to.equal(newPosition.position)
	// 			})
	// 	})
	// })

	describe('DELETE endpoint', function() {
		let position;
		
		it('should delete a position', function () {
			return Position
			.findOne()
			.then(function(_position) {
				position = _position
				return chai.request(app).delete(`/api/positions/${position.id}`)
			})
			.then(function(res) {
				expect(res).to.have.status(204)
				return Position.findById(position.id)
			})
			.then(function(_position) {
				expect(_position).to.be.null
			})
		})


	})

	describe('PUT endpoint', function(){
		it('should update field you send over', function() {
			const updateData = {
				position: faker.lorem.word()
			}

			return Position
				.findOne()
				.then(function(position) {
					updateData.id = position.id

					return chai.request(app)
						.put(`/api/positions/${position.id}`)
						.send(updateData)
				})
				.then(function(res) {
					expect(res).to.have.status(204)

					return Position.findById(updateData.id)
				})
				.then(function(position) {
					expect(position.position).to.equal(updateData.position)
				})
		})
	})
})
