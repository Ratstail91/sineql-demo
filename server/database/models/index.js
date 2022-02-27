const Book = require('./book');
const Author = require('./author');

//relations
Author.hasMany(Book);

//collate
module.exports = {
	Book,
	Author,
};