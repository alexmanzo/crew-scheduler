const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect

const { app, server } = require('../server')

chai.use(chaiHttp)

describe('HTML up and working', function() {
	it('should verify root is receiving HTML', function() {
		return chai.request(app)
		.get('/')
		.then(function(res) {
			expect(res).to.have.status(200)
		})
	})
})