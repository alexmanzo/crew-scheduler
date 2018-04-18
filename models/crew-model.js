const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise


const crewSchema = new mongoose.Schema({
	eventId: {type: String, required: true, unique: true},
	crew: Array
})

crewSchema.plugin(uniqueValidator, { message: 'All events already accounted for.' })

crewSchema.methods.serialize = function() {
	return {
		id: this._id,
		eventId: this.eventId,
		crew: this.crew
	}
}

module.exports = mongoose.model('Crew', crewSchema)

