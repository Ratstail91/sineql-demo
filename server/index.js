//config
require('dotenv').config();

//express for testing
const express = require('express');
const app = express();

//uses text input
app.use(express.text());

//database connection
const database = require('./database');

//test the library
const sineQL = require('sineql');
const schema = require('./schema.js');
const typeHandlers = require('./type-handlers');

//omit 'queryHandlers', 'createHandlers', 'updateHandlers' or 'deleteHandlers' to disable those methods
const sine = sineQL(schema, typeHandlers, { debug: true });

//open the endpoint
app.post('/sineql', async (req, res) => {
	const [code, result] = await sine(req.body);
	res.status(code).send(result);
});

//startup
const port = process.env.WEB_PORT || 4000;
app.listen(port, async err => {
	await database.sync();
	console.log(`listening to *:${port}`);
});