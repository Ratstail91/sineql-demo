const { Book } = require('../database/models');

//utils
const checkDateFormat = date => /(19\d{2}|20\d{2})[-\/.](0[1-9]|1[012])[-\/.](0[1-9]|[12][0-9]|3[01])/.test(date) || date == 'NULL';

const queryBookFields = (query) => {
	//sequelize stuff to find
	const attributes = [];
	const where = {};

	//specify fields to find
	Object.keys(query)
		.filter(key => key != 'typeName') //filter out this meta-field
		.forEach(key => {
			//all book members queried should be scalar
			if (query[key].scalar) {
				//push this key into the attributes list
				attributes.push(key);
			}

			//filter the members to a specific value
			if (query[key].match) {
				where[key] = query[key].match == 'NULL' ? null : query[key].match;
			}
		})
	;

	return { attributes, where };
};

const queryBook = async (query, typeGraph) => {
	const bookFields = queryBookFields(query);

	try {
		//search the database
		return await Book.findAll({
			...bookFields,
			raw: true,
		});
	}
	catch(e) {
		console.log(e);
		throw "Query failed";
	}
};

const createBookFields = (query) => {
	//the array of objects to insert
	const inserts = [];

	query.forEach((q, idx) => {
		//just in case
		if (!q.create) {
			throw 'Unexpected create == false';
		}

		//specify fields to create
		Object.keys(q)
			.filter(key => key != 'typeName' && key != 'create') //filter out these meta-fields
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

	return inserts;
};

const createBook = async (query, typeGraph) => {
	const bookFields = createBookFields(query);

	try {
		//insert into the database
		await Book.bulkCreate(
			bookFields,
		);
	}
	catch(e) {
		console.log(e);
		throw "Create failed";
	}

	return "OK";
};

const updateBookFields = (query) => {
	const final = [];

	query.forEach((q) => {
		//the array of objects to update
		const updates = {};
		const where = {};

		//just in case
		if (!q.update && !q.match) {
			throw 'Unexpected field (expected an update or match keyword)';
		}

		//specify fields to update
		Object.keys(q)
			.filter(key => key != 'typeName' && key != 'update') //filter out these meta-fields
			.forEach(key => {
				//check published date format
				if (key == 'published') {
					if (q[key].update && !checkDateFormat(q[key].update)) {
						throw 'Wrong date format for published';
					}
				}

				//all book members should be scalar
				if (q[key].update) {
					//push this key into the updates object
					updates[key] = q[key].update;
				}

				//filter the members to a specific value
				if (q[key].match) {
					where[key] = q[key].match == 'NULL' ? null : q[key].match;
				}
			})
		;

		final.push({ ...updates, ...where });
	});

	return { updates: final, updateOnDuplicate: Object.keys(updates) };
};

const updateBook = async (query, typeGraph) => {
	const { updates, ...opts } = updateBookFields(query);

	try {
		await Book.bulkCreate(
			updates,
			opts,
		);
	}
	catch(e) {
		console.log(e);
		throw "Update failed";
	}

	//finally
	return "OK";
};

const deleteBook = async (query, typeGraph) => {
	//can handle multiple delete queries at once, so keep it like this
	const promises = query.map(async (q) => {
		//the array of objects to delete
		const where = {};

		//just in case
		if (!q.delete) {
			throw 'Unexpected field (expected match keyword)';
		}

		//specify fields to delete
		Object.keys(q)
			.filter(key => key != 'typeName' && key != 'delete') //filter out these meta-fields
			.forEach(key => {
				//check published date format
				if (key == 'published') {
					if (q[key].match && !checkDateFormat(q[key].match)) {
						throw 'Wrong date format for published';
					}
				}

				//filter the members to a specific value
				if (q[key].match) {
					where[key] = q[key].match == 'NULL' ? null : q[key].match;
				}
			})
		;

		//update the database
		await Book.destroy({ where });
	});

	try {
		await Promise.all(promises);
	}
	catch(e) {
		console.log(e);
		throw "Delete failed";
	}

	//finally
	return "OK";
};

module.exports = {
	queryBook,
	createBook,
	updateBook,
	deleteBook,
};
