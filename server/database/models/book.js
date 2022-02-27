const Sequelize = require('sequelize');
const sequelize = require('..');

module.exports = sequelize.define('book', {
	index: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	title: {
		type: Sequelize.TEXT,
		allowNull: true,
		defaultValue: null
	},

	published: {
		type: 'DATETIME',
		allowNull: true,
		defaultValue: null
	}
});
