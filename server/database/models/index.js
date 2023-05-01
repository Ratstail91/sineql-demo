const Book = require('./book');
const Author = require('./author');

//relations
Author.hasMany(Book);
Book.belongsTo(Author);

//collate
module.exports = {
	Book,
	Author,
};