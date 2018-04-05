const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect

const { app, server } = require('../server')

chai.use(chaiHttp)

describe('HTML up and working', function() {
	it('should verify root works', function() {
		return chai.request(app)
		.get('/')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify dashboard works', function() {
		return chai.request(app)
		.get('/dashboard.html')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify availability works', function() {
		return chai.request(app)
		.get('/availability.html')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify create-events works', function() {
		return chai.request(app)
		.get('/create-events.html')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})

	it('should verify assign-crew works', function() {
		return chai.request(app)
		.get('/assign-crew.html')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})
})