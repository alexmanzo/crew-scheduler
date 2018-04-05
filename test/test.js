const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect

const { app, server } = require('../server')

chai.use(chaiHttp)

describe('Static Pages Working', function() {
	it('should verify root works', function() {
		return chai.request(app)
		.get('/')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify admin dashboard works', function() {
		return chai.request(app)
		.get('/admin-dashboard')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify crew dashboard works', function() {
		return chai.request(app)
		.get('/crew-dashboard')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})
	it('should verify availability works', function() {
		return chai.request(app)
		.get('/availability')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify create-events works', function() {
		return chai.request(app)
		.get('/create-events')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify assign-crew works', function() {
		return chai.request(app)
		.get('/assign-crew')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})
})
