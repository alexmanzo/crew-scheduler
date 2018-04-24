const mongoose = require('mongoose')
mongoose.Promise = global.Promise


const eventSchema = new mongoose.Schema({
	date: {type: String, required: true},
	time: {type: String, required: true},
	call: {type: String, required: true},
	sport: {type: String, required: true},
	opponent: {type: String, required: true},
	location: {type: String, required: true},
	positions: {type: Array, required: true}
})


eventSchema.methods.serialize = function() {
	return {
		id: this._id,
		date: this.date,
		time: this.time,
		call: this.call,
		sport: this.sport,
		opponent: this.opponent,
		location: this.location,
		positions: this.positions
	}
}

module.exports = mongoose.model('Event', eventSchema)