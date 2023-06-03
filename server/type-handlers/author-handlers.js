const { Author, Book } = require('../database/models');

const { queryBookFields } = require("./book-handlers");

const queryAuthorFields = (query) => {
	//subtypes to find
	const subtypes = {
		"books": {
			model: Book,
			query: queryBookFields,
		}
	};
	const include = [];

	//sequelize stuff to find
	const attributes = [];
	const where = {};

	//specify fields to find
	Object.keys(query)
		.filter(key => query[key])
		.filter(key => key != 'typeName') //filter out this meta-field
		.forEach(key => {
			//all author members queried should be scalar
			if (query[key].scalar) {
				//push this key into the attributes list
				attributes.push(key);
			}
			//handle compounds
			else {
				include.push({
					model: subtypes[key].model,
					...subtypes[key].query(query[key])
				}); //handle compound subtypes
			}

			//filter the members to a specific value
			if (query[key].match) {
				where[key] = query[key].match == 'NULL' ? null : query[key].match;
			}
		})
	;

	return { attributes, where, include };
};

const queryAuthor = async (query, typeGraph) => {
	const authorFields = queryAuthorFields(query);

	try {
		//search the database
		return await Author.findAll(authorFields);
	}
	catch(e) {
		console.log(e);
		throw "Query failed";
	}
};

const createAuthorFields = (query) => {
	const subtypes = {
		"Book": {
			model: Book,
			query: queryBookFields,
		}
	};

	//hook to monkey wrap
	let afterBulkCreate = (instances, options) => null;

	//the array of objects to insert
	const records = [];

	query.forEach((q, idx) => {
		//just in case
		if (!q.create) {
			throw 'Unexpected create == false';
		}

		//specify fields to create
		Object.keys(q)
			.filter(key => q[key])
			.filter(key => key != 'typeName' && key != 'create') //filter out these meta-fields
			.forEach(key => {
				//some author members should be scalar
				if (q[key].scalar) {
					//make sure this exists
					records[idx] = records[idx] || {};

					//push this key into the inserts list
					records[idx][key] = q[key].create;
					return;
				}

				//find each compound type, associate it with the created instances (using a wrapped hook)
				q[key].forEach(compoundType => {
					const prev = afterBulkCreate; //cache prev impl.

					const { where } = subtypes[compoundType.typeName].query(compoundType);

					afterBulkCreate = (instances, options) => {
						//monkey patch the associations
						instances.forEach(instance => {
							//BUGFIX: don't want records mixed
							if (instance.name != q["name"]?.create) {
								return;
							}

							subtypes[compoundType.typeName].model.update({
								authorIndex: instance["index"],
							}, {
								where: where
							});
						});

						//continue
						return prev(instances, options);
					}
				});
			})
		;
	});

	return [records, { afterBulkCreate }];
};

const createAuthor = async (query, typeGraph) => {
	const [authorRecords, authorOptions] = createAuthorFields(query);

	try {
		Author.afterBulkCreate(authorOptions.afterBulkCreate)

		//insert into the database
		await Author.bulkCreate(
			authorRecords,
			authorOptions,
		);
	}
	catch(e) {
		console.log(e);
		throw "Create failed";
	}

	return "OK";
};

const updateAuthor = async (query, typeGraph) => {
	throw 'Author update handler not yet implemented';
};

const deleteAuthor = async (query, typeGraph) => {
	throw 'Author delete handler not yet implemented';
};

module.exports = {
	queryAuthor,
	createAuthor,
	updateAuthor,
	deleteAuthor,
};
