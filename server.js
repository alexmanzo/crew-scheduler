require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')

const { localStrategy, jwtStrategy } = require('./strategies')

mongoose.Promise = global.Promise

const adminDashboardRouter = require('./routers/admin-dashboard-router')
const crewDashboardRouter = require('./routers/crew-dashboard-router')
const assignCrewRouter = require('./routers/assign-crew-router')
const availabilityPageRouter = require('./routers/availability-page-router')
const createEventsRouter = require('./routers/create-events-router')
const eventsRouter = require('./routers/api-events-router')
const sportsRouter = require('./routers/api-sports-router')
const opponentRouter = require('./routers/api-opponents-router')
const positionRouter = require('./routers/api-positions-router')
const locationRouter = require('./routers/api-locations-router')
const authRouter = require('./routers/api-auth-router')
const userRouter = require('./routers/api-user-router')
const crewRouter = require('./routers/api-crew-router')
const availabilityRouter = require('./routers/api-availability-router')

const { PORT, DATABASE_URL } = require('./config')

app.use(express.static('public'))
app.use(morgan('common'))

app.use('/admin-dashboard', adminDashboardRouter)
app.use('/crew-dashboard', crewDashboardRouter)
app.use('/assign-crew', assignCrewRouter)
app.use('/availability', availabilityPageRouter)
app.use('/create-events', createEventsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/sports', sportsRouter)
app.use('/api/opponents', opponentRouter)
app.use('/api/positions', positionRouter)
app.use('/api/locations', locationRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/crew', crewRouter)
app.use('/api/availability', availabilityRouter)



// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  if (req.method === 'OPTIONS') {
    return res.send(204)
  }
  next()
})

passport.use(localStrategy)
passport.use(jwtStrategy)

const jwtAuth = passport.authenticate('jwt', { session: false })

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


module.exports = { app, runServer, closeServer }