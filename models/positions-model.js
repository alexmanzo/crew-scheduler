const mongoose = require('mongoose')
mongoose.Promise = global.Promise


const positionSchema = new mongoose.Schema({
	position: String,
})

positionSchema.methods.serialize = function() {
	return {
		id: this._id,
		position: this.position,
	}
}

module.exports = mongoose.model('Position', positionSchema)