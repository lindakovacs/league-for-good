/*
* Player model stores information about each player,
* their contact info, and teams they played on
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const capitalize = require('./plugins/capitalize');
const removeRefs = require('./plugins/removeAllRefs');

const PlayerSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phoneNum: {
		type: String
	},
	emergencyContact: {
		name: String,
		phoneNum: String,
		email: String,
		relation: String
	},
	address: {
		street: String,
		city: String,
		state: String,
		country: String
	},
	leagueId: {
		type: Schema.Types.ObjectId,
		ref: 'league'
	},
	teams: [{
		teamId: Schema.Types.ObjectId,
		seasonId: Schema.Types.ObjectId,
		position: [String],
		jerseyNum: Number
	}]},
	{
		collection: 'players',
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
);


const fields = [
	'firstName',
	'lastName',
	'emergencyContact.name'
];

PlayerSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`;
});

// TODO -- virtual should return team config relative to league AND seasonId
PlayerSchema.virtual('team').get(function() {
	return this.teams[0];
});

PlayerSchema.plugin(removeRefs, {
	modelName: 'league', field: 'pendingPlayers'
});

PlayerSchema.plugin(capitalize, { fields });

module.exports = mongoose.model('player', PlayerSchema);
