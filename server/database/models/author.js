const Sequelize = require('sequelize');
const sequelize = require('..');

module.exports = sequelize.define('author', {
	index: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	name: {
		type: Sequelize.TEXT,
		allowNull: true,
		defaultValue: null
	}
});
