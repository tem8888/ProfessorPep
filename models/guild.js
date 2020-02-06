const {Schema, model} = require('mongoose');
const config = require('../config.js');

const Guild = Schema({
	idGuild: { type: String },
	nameGuild: { type: String },
	guildMembers: { type: Number },
	prefix: { type: String, default: config.prefix },
	channelId: { type: String, default: "" },
	points: { type: Number, default: 0 },
	answersCount: { type: Number, default: 0 },
	tournamentCount: { type: Number, default: 0 },
	hintTime: { type: Number, default: config.hintTime },
	skipLimit: { type: Number, default: config.skipLimit }
});

module.exports = model('Guild', Guild)