const express = require('express')
const app = express()
const mongoose = require('mongoose')

const adminDashboardRouter = require('./routers/admin-dashboard-router')
const crewDashboardRouter = require('./routers/crew-dashboard-router')
const assignCrewRouter = require('./routers/assign-crew-router')
const availabilityRouter = require('./routers/availability-router')
const createEventsRouter = require('./routers/create-events-router')


app.use(express.static('public'))
app.use('/admin-dashboard', adminDashboardRouter)
app.use('/crew-dashboard', crewDashboardRouter)
app.use('/assign-crew', assignCrewRouter)
app.use('/availability', availabilityRouter)
app.use('/create-events', createEventsRouter)
app.listen(process.env.PORT || 8080, () => console.log('Your server is up and running'))




module.exports = { app }