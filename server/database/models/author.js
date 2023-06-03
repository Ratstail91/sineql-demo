const Sequelize = require('sequelize');
const sequelize = require('..');

const Book = require("./book");

const Author = sequelize.define('author', {
	index: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	name: {
		type: Sequelize.TEXT,
		allowNull: false,
		defaultValue: null,
		unique: true,
	}
});

Author.hasMany(Book);

module.exports = Author;