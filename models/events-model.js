const mongoose = require('mongoose')


const EventSchema = new mongoose.Schema({
	date: {type: String, required: true},
	time: {type: String, required: true},
	call time: {type: String, required: true},
	sport: {type: String, required: true},
	opponent: {type: String, required: true},
	location: {type: String, required: true},
	crew positions: {type: Array, required: true}
})

module.exports = mongoose.model('Event', EventSchema)