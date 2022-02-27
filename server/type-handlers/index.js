const { queryWeather, createWeather, updateWeather, deleteWeather } = require('./weather-handlers');
const { queryBook, createBook, updateBook, deleteBook } = require('./book-handlers');
const { queryAuthor, createAuthor, updateAuthor, deleteAuthor } = require('./author-handlers');

//collate
module.exports = {
	queryHandlers: {
		Weather: queryWeather,
		Book: queryBook,
		Author: queryAuthor,
	},

	createHandlers: {
		Weather: createWeather,
		Book: createBook,
		Author: createAuthor,
	},

	updateHandlers: {
		Weather: updateWeather,
		Book: updateBook,
		Author: updateAuthor,
	},

	deleteHandlers: {
		Weather: deleteWeather,
		Book: deleteBook,
		Author: deleteAuthor,
	}
};
