const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const moment = require('moment')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Availability = require('../models/availability-model')
const { TEST_DATABASE_URL } = require('../config')

chai.use(chaiHttp)

function seedAvailabilityData() {
    console.info('seeding availability info')
    const seedData = []

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateAvailabilityData())
    }

    return Availability.insertMany(seedData)
}

function generateAvailabilityData() {
    return {
        eventId: faker.random.uuid(),
        availableCrew: [
            faker.name.findName(),
            faker.name.findName(),
            faker.name.findName(),
            faker.name.findName()
        ]
    }
}

function tearDownDb() {
    console.warn('Deleting database')
    return mongoose.connection.dropDatabase()
}

describe('availability API', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL)
    })

    beforeEach(function() {
        return seedAvailabilityData()
    })

    afterEach(function() {
        tearDownDb()
    })

    after(function() {
        return closeServer()
    })

    describe('GET endpoint', function() {

        it('should return all existing event availability', function() {
            let res;
            return chai.request(app)
                .get('/api/availability')
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.length.of.at.least(1)
                    return Availability.count()
                })
        })

        it('should return event availability with right fields', function() {
            let resEvent;
            return chai.request(app)
                .get('/api/availability')
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res).to.be.json
                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.length.of.at.least(1)

                    res.body.forEach(function(availability) {
                        expect(availability).to.be.a('object')
                        expect(availability).to.include.keys('id', 'eventId', 'availableCrew')
                    })

                    resAvailability = res.body[0]
                    return Availability.findById(resAvailability.id)
                })
                .then(function(availability) {
                    expect(resAvailability.id).to.equal(availability.id)
                    expect(resAvailability.eventId).to.equal(availability.eventId)
                    expect(resAvailability.availableCrew).to.be.a('array')
                    expect(resAvailability.availableCrew[0]).to.equal(availability.availableCrew[0])
                })

        })

        it('should get availability of specific event', function() {
            let eventId;
            let res;

            return Availability
                .findOne()
                .then(function(availability) {
                    eventId = availability.eventId
                })

            return chai.request(app)
                .get(`api/availability/${eventId}`)
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.lengthOf(1)
                    return Availability.count()
                })

        })
    })

    describe('POST endpoint', function() {
        it('should add new availability', function() {
            const newAvailability = generateAvailabilityData()

            return chai.request(app)
                .post('/api/availability')
                .send(newAvailability)
                .then(function(res) {
                    expect(res).to.have.status(201)
                    expect(res).to.be.json
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.include.keys('id', 'eventId', 'availableCrew')
                    expect(res.body.id).to.not.be.null
                    expect(res.body.eventId).to.equal(newAvailability.eventId)
                    expect(resAvailability.availableCrew).to.be.a('array')
                })
        })
    })

    describe('DELETE endpoint', function() {
        let availability;

        it('should delete availability', function() {
            return Availability
                .findOne()
                .then(function(_availability) {
                    availability = _availability
                    return chai.request(app).delete(`/api/availability/${availability.id}`)
                })
                .then(function(res) {
                    expect(res).to.have.status(204)
                    return Availability.findById(availability.id)
                })
                .then(function(_availability) {
                    expect(_availability).to.be.null
                })
        })

        it('should delete a specific user from a specific event', function() {
            let eventId;
            let user;

            return Availability
                .findOne()
                .then(function(availability) {
                    eventId = availability.eventId
                    user = availability.availableCrew[0]
                })

            return chai.request(app)
                .delete(`api/availability/${user}/${eventId}`)
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(204)
                })

        })


    })

    describe('PUT endpoint', function() {
        it('should update field you send over', function() {
            const updateData = {
                availableCrew: faker.name.findName()
            }

            return Availability
                .findOne()
                .then(function(availability) {
                    updateData.id = availability.id

                    return chai.request(app)
                        .put(`/api/availability/${availability.id}`)
                        .send(updateData)
                })
                .then(function(res) {
                    expect(res).to.have.status(204)

                    return Availability.findById(updateData.id)
                })
                .then(function(availability) {
                    expect(availability.availableCrew).to.include(updateData.availableCrew)
                })
        })
    })
})