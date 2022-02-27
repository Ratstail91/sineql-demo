const { Book } = require('../database/models');

//utils
const checkDateFormat = date => /(19\d{2}|20\d{2})[-\/.](0[1-9]|1[012])[-\/.](0[1-9]|[12][0-9]|3[01])/.test(date);

const queryBook = async (query, typeGraph) => {
	//sequelize stuff to find
	const attributes = [];

	//specify fields to find
	Object.keys(query)
		.filter(key => key != 'typeName') //filter out this meta-field
		.forEach(key => {
			//check published date
			if (key == 'published' && !checkDateFormat(query[key].match)) {
				throw 'Wrong date format for published';
			}

			//all book members should be scalar
			if (query[key].scalar) {
				//push this key into the attributes list
				attributes.push(key);
			}
		})
	;

	//search the database
	const result = await Book.findAll({
		attributes: attributes
	});

	//finally
	return result;
};

const createBook = async (query, typeGraph) => {
	//the array of objects to insert
	const inserts = [];

	query.forEach((q, idx) => {
		//just in case
		if (!q.create) {
			throw 'Unexpected create == false';
		}

		//specify fields to create
		Object.keys(q)
			.filter(key => key != 'typeName' && key != 'create') //filter out this meta-field
			.forEach(key => {
				//check published date
				if (key == 'published' && !checkDateFormat(q[key].create)) {
					throw 'Wrong date format for published';
				}

				//all book members should be scalar
				if (q[key].scalar) {
					//make sure this exists
					inserts[idx] = inserts[idx] || {};

					//push this key into the inserts list
					inserts[idx][key] = q[key].create;
				}
			})
		;
	});

	//insert into the database
	const results = await Book.bulkCreate(inserts, { fields: ['title', 'published']});

	//determine what fields to return
	const returns = [];

	query.map((q, idx) => {
		//make sure it exists
		returns[idx] = returns[idx] || {};

		//specify fields to return in each record
		const keys = Object.keys(q)
			.filter(key => key != 'typeName' && key != 'create') //filter out this meta-field
			.forEach(key => {
				if (q[key].scalar) {
					returns[idx][key] = results[idx][key];
				}
			})
		;
	});

	//finally
	return returns;
};

const updateBook = async (query, typeGraph) => {
	throw 'Not yet implemented';
};

const deleteBook = async (query, typeGraph) => {
	throw 'Not yet implemented';
};

module.exports = {
	queryBook,
	createBook,
	updateBook,
	deleteBook,
};
