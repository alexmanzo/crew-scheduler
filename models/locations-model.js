const mongoose = require('mongoose')
mongoose.Promise = global.Promise


const locationSchema = new mongoose.Schema({
	location: String,
})

locationSchema.methods.serialize = function() {
	return {
		id: this._id,
		location: this.location,
	}
}

module.exports = mongoose.model('Location', locationSchema)