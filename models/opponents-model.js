const mongoose = require('mongoose')
mongoose.Promise = global.Promise


const opponentSchema = new mongoose.Schema({
	opponent: String,
})

opponentSchema.methods.serialize = function() {
	return {
		id: this._id,
		opponent: this.opponent,
	}
}

module.exports = mongoose.model('Opponent', opponentSchema)