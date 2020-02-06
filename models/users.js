const {Schema, model} = require('mongoose');

const User = Schema({
	idUser: String,
	idUserGuild: String,
	name: String,
	answersCount: Number,
	points: Number,
	points_tour: { type: Number, default: 0 }
});

module.exports = model('User', User)