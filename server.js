const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')

mongoose.Promise = global.Promise

const adminDashboardRouter = require('./routers/admin-dashboard-router')
const crewDashboardRouter = require('./routers/crew-dashboard-router')
const assignCrewRouter = require('./routers/assign-crew-router')
const availabilityRouter = require('./routers/availability-router')
const createEventsRouter = require('./routers/create-events-router')
const eventsRouter = require('./routers/api-events-router')
const sportsRouter = require('./routers/api-sports-router')
const opponentRouter = require('./routers/api-opponents-router')
const positionRouter = require('./routers/api-positions-router')
const locationRouter = require('./routers/api-locations-router')

const { PORT, DATABASE_URL } = require('./config')

app.use(express.static('public'))
app.use(morgan('common'))
app.use('/admin-dashboard', adminDashboardRouter)
app.use('/crew-dashboard', crewDashboardRouter)
app.use('/assign-crew', assignCrewRouter)
app.use('/availability', availabilityRouter)
app.use('/create-events', createEventsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/sports', sportsRouter)
app.use('/api/opponents', opponentRouter)
app.use('/api/positions', positionRouter)
app.use('/api/locations', locationRouter)

let server;

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err)
			}
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`)
			resolve()
		})
		.on('error', err => {
			mongoose.disconnect()
			reject(err)
		})	
		})
	})
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.log(error(err)))
}


module.exports = { app }