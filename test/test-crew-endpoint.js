const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const moment = require('moment')

const expect = chai.expect

const { app, runServer, closeServer } = require('../server')
const Crew = require('../models/crew-model')
const { TEST_DATABASE_URL } = require('../config')

chai.use(chaiHttp)

function seedCrewData() {
    console.info('seeding crew info')
    const seedData = []

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateCrewData())
    }

    return Crew.insertMany(seedData)
}

function generateCrewData() {
    return {
        eventId: faker.random.uuid(),
        crew: [
            {
                position: faker.lorem.word(),
                crewMember: faker.name.findName()
            },
            {
                position: faker.lorem.word(),
                crewMember: faker.name.findName()
            },
            {
                position: faker.lorem.word(),
                crewMember: faker.name.findName()
            },
            {
                position: faker.lorem.word(),
                crewMember: faker.name.findName()
            }
        ]
    }
}

function tearDownDb() {
    console.warn('Deleting database')
    return mongoose.connection.dropDatabase()
}

describe('crew API', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL)
    })

    beforeEach(function() {
        return seedCrewData()
    })

    afterEach(function() {
        tearDownDb()
    })

    after(function() {
        return closeServer()
    })

    describe('GET endpoint', function() {

        it('should return all existing event crew', function() {
            let res;
            return chai.request(app)
                .get('/api/crew')
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.length.of.at.least(1)
                    return Crew.count()
                })
        })

        it('should return event crew with right fields', function() {
            let resEvent;
            return chai.request(app)
                .get('/api/crew')
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res).to.be.json
                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.length.of.at.least(1)

                    res.body.forEach(function(crew) {
                        expect(crew).to.be.a('object')
                        expect(crew).to.include.keys('id', 'eventId', 'crew')
                    })

                    resCrew = res.body[0]
                    return Crew.findById(resCrew.id)
                })
                .then(function(crew) {
                    expect(resCrew.id).to.equal(crew.id)
                    expect(resCrew.eventId).to.equal(crew.eventId)
                    expect(resCrew.crew).to.be.a('array')
                    expect(resCrew.crew[0]).to.be.a('object')
                })

        })

        it('should get crew of specific event', function() {
            let eventId;
            let res;

            return Crew
                .findOne()
                .then(function(crew) {
                    eventId = crew.eventId
                })

            return chai.request(app)
                .get(`api/crew/${eventId}`)
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.lengthOf(1)
                    return Crew.count()
                })

        })
    })

    describe('POST endpoint', function() {
        it('should add new crew', function() {
            const newCrew = generateCrewData()

            return chai.request(app)
                .post('/api/crew')
                .send(newCrew)
                .then(function(res) {
                    expect(res).to.have.status(201)
                    expect(res).to.be.json
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.include.keys('id', 'eventId', 'crew')
                    expect(res.body.id).to.not.be.null
                    expect(res.body.eventId).to.equal(newCrew.eventId)
                    expect(resCrew.crew).to.be.a('array')
                })
        })
    })

    describe('DELETE endpoint', function() {
        let crew;

        it('should delete crew', function() {
            return Crew
                .findOne()
                .then(function(_crew) {
                    crew = _crew
                    return chai.request(app).delete(`/api/crew/${crew.id}`)
                })
                .then(function(res) {
                    expect(res).to.have.status(204)
                    return Crew.findById(crew.id)
                })
                .then(function(_crew) {
                    expect(_crew).to.be.null
                })
        })


    })

    describe('PUT endpoint', function() {
        it('should update field you send over', function() {
            const updateData = {
                crew:  {
                    position: faker.lorem.word(),
                    crewMember: faker.name.findName()
                }
            }

            return Crew
                .findOne()
                .then(function(crew) {
                    updateData.id = crew.id

                    return chai.request(app)
                        .put(`/api/crew/${crew.id}`)
                        .send(updateData)
                })
                .then(function(res) {
                    expect(res).to.have.status(204)

                    return Crew.findById(updateData.id)
                })
                .then(function(crew) {
                    expect(crew.crew[4].crewMember).to.equal(updateData.crew.crewMember)
                })
        })

        it('should pull all crew of a specific position', function() {
            let id;
            let position;

            return Crew
                .findOne()
                .then(function(crew) {
                    id = crew.id
                    position = crew.crew[0].position
                })

            return chai.request(app)
                .delete(`api/crew/${id}/${position}`)
                .then(function(_res) {
                    res = _res
                    expect(res).to.have.status(204)
                })

            return Crew
                .findById(id)
                .then(function(crew) {
                    for (let i=0; i < crew.crew.length; i++) {
                        expect(crew.crew[i].to.not.include(position))
                    }
                })    
        })
    })
})