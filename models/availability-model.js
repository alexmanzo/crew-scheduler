const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise


const availabilitySchema = new mongoose.Schema({
	eventId: {type: String, required: true, unique: true},
	availableCrew: {type: Array},
})

//Prevents creating multiple availability objects for the same event.
availabilitySchema.plugin(uniqueValidator, { message: 'All events already accounted for.' })


availabilitySchema.methods.serialize = function() {
	return {
		id: this._id,
		eventId: this.eventId,
		availableCrew: this.availableCrew
	}
}

module.exports = mongoose.model('Availability', availabilitySchema)
