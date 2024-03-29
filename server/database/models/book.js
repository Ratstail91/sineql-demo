const Sequelize = require('sequelize');
const sequelize = require('..');

const Book = sequelize.define('book', {
	index: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	title: {
		type: Sequelize.TEXT,
		allowNull: false,
		defaultValue: null,
		unique: true,
	},

	published: {
		type: 'DATETIME',
		allowNull: true,
		defaultValue: null
	}
});

module.exports = Book;