const mongoose = require('mongoose')
mongoose.Promise = global.Promise


const sportSchema = new mongoose.Schema({
	sport: String,
})

sportSchema.methods.serialize = function() {
	return {
		id: this._id,
		sport: this.sport,
	}
}

module.exports = mongoose.model('Sport', sportSchema)